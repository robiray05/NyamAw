<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index()
    {
        // 👇 TUKANG SAPU OTOMATIS: Batalkan pesanan yang lewat 60 menit 👇
        Order::where('payment_status', 'pending')
            ->where('created_at', '<', now()->subMinutes(60))
            ->update([
                'payment_status' => 'failed',
                'status' => 'dibatalkan'
            ]);

        $orders = Order::with(['menu', 'items.menu'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'whatsapp_number' => 'required|string',
            'total_price' => 'required|numeric',
            'items' => 'required|array|min:1',
        ]);

        // 2. Simpan ke Database Nyam.Aw
        $order = DB::transaction(function () use ($request) {
            $newOrder = Order::create([
                'user_id' => auth()->id(),
                'total_price' => $request->total_price,
                'whatsapp_number' => $request->whatsapp_number,
                'status' => 'menunggu_pembayaran', 
                'payment_status' => 'pending',
            ]);

            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $newOrder->id,
                    'menu_id' => $item['menu_id'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['subtotal'],
                    'custom_notes' => $item['custom_notes'] ?? null,
                ]);
            }
            
            return $newOrder;
        }); 

        // 3. Persiapan Tembak DOKU Checkout
        $clientId = env('DOKU_CLIENT_ID');
        $secretKey = env('DOKU_SECRET_KEY');
        $requestId = (string) Str::uuid();
        $timestamp = gmdate("Y-m-d\TH:i:s\Z");
        $targetPath = '/checkout/v1/payment'; // KITA KEMBALI KE JALUR AMAN

        $body = [
            "order" => [
                "amount" => (int) $order->total_price,
                "invoice_number" => "NYAMAW_" . $order->id . "_" . time(),
                "callback_url" => route('orders.history'), // Otomatis balik ke histori jika sukses
                "auto_redirect" => true
            ],
            "payment" => [
                "payment_due_date" => 60,
            ]
        ];

        $jsonBody = json_encode($body);
        $signature = $this->generateDokuSignature($jsonBody, $targetPath, $clientId, $requestId, $timestamp, $secretKey);

        $response = Http::withHeaders([
            'Client-Id' => $clientId,
            'Request-Id' => $requestId,
            'Request-Timestamp' => $timestamp,
            'Signature' => $signature,
            'Content-Type' => 'application/json'
        ])->post(env('DOKU_URL') . $targetPath, $body);

        $dokuData = $response->json();

        // 4. Jika Sukses, lemparkan pelanggan ke Halaman QRIS DOKU
        if (isset($dokuData['response']['payment']['url'])) {
            return Inertia::location($dokuData['response']['payment']['url']);
        }

        // Jika apes masih gagal, kita tampilkan pesan error asli DOKU di layar
        return back()->withErrors(['whatsapp_number' => 'Gagal memproses DOKU: ' . json_encode($dokuData)]);
    }

    public function pay($id)
    {
        $order = Order::findOrFail($id);

        if ($order->user_id !== auth()->id() || $order->payment_status !== 'pending') {
            return redirect()->route('orders.history');
        }

        return Inertia::render('Orders/Pay', [
            'order' => $order
        ]);
    }

    private function generateDokuSignature($body, $targetPath, $clientId, $requestId, $timestamp, $secretKey) 
    {
        $digest = base64_encode(hash('sha256', $body, true));
        $signatureComponent = "Client-Id:{$clientId}\nRequest-Id:{$requestId}\nRequest-Timestamp:{$timestamp}\nRequest-Target:{$targetPath}\nDigest:{$digest}";
        $signature = base64_encode(hash_hmac('sha256', $signatureComponent, $secretKey, true));
        return "HMACSHA256=" . $signature;
    }

    public function webhook(Request $request)
    {
        // 1. CCTV Rahasia: Catat semua laporan masuk dari DOKU ke file log Laravel
        \Illuminate\Support\Facades\Log::info('Webhook DOKU Masuk:', $request->all());

        $orderInfo = $request->order;
        
        if (!$orderInfo || !isset($orderInfo['invoice_number'])) {
            return response()->json(['message' => 'DOKU Test Connection Success'], 200);
        }

        $invoiceParts = explode('_', $orderInfo['invoice_number']);
        if (count($invoiceParts) < 2) {
            return response()->json(['message' => 'Format invoice tidak dikenali'], 200);
        }
        
        $orderId = $invoiceParts[1]; 
        $order = Order::find($orderId);
        
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 200);
        }

        // 2. Tangkap status transaksi (Ini untuk mendeteksi E-Wallet)
        $transactionStatus = $request->transaction['status'] ?? '';
        
        // 3. Tangkap bukti transfer (Ini jurus khusus untuk mendeteksi Virtual Account)
        $isVAPaid = $request->has('virtual_account_payment');

        // 4. Jika salah satu di atas benar, gas update database!
        if ($transactionStatus === 'SUCCESS' || $isVAPaid) {
            $order->update([
                'payment_status' => 'success',
                'status' => 'pembayaran_berhasil'
            ]);
        } elseif (in_array($transactionStatus, ['FAILED', 'EXPIRED'])) {
            $order->update([
                'payment_status' => 'failed',
                'status' => 'dibatalkan'
            ]);
        }

        return response()->json(['message' => 'Webhook berhasil diproses'], 200);
    }

    public function history()
    {
        // 👇 TUKANG SAPU OTOMATIS (Biar aman, kita pasang di sini juga) 👇
        Order::where('payment_status', 'pending')
            ->where('created_at', '<', now()->subMinutes(60))
            ->update([
                'payment_status' => 'failed',
                'status' => 'dibatalkan'
            ]);

        $orders = Order::with(['menu', 'items.menu', 'review', 'complaint'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Orders/History', [
            'orders' => $orders
        ]);
    }
}