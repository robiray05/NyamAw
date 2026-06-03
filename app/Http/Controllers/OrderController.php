<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
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
        $request->validate([
            'cart' => 'required|array|min:1',
            'total_price' => 'required|numeric',
        ]);

        DB::transaction(function () use ($request) {
            $firstItem = $request->cart[0];

            $order = Order::create([
                'user_id' => auth()->id(),
                'menu_id' => $firstItem['id'], 
                'total_price' => $request->total_price,
                'status' => 'menunggu_pembayaran', 
                'payment_status' => 'pending',
            ]);

            foreach ($request->cart as $item) {
                $notes = [];
                if (!empty($item['customOptions']['tambahAyam'])) {
                    $notes[] = 'Tambah Ayam (+Rp8.000)';
                }
                if (!empty($item['customOptions']['tambahTelur'])) {
                    $notes[] = 'Tambah Telur (+Rp4.000)';
                }
                if (isset($item['customOptions']['pedas']) && $item['customOptions']['pedas'] > 0) {
                    $notes[] = 'Pedas Lv ' . $item['customOptions']['pedas'];
                }

                $customNotesString = implode(', ', $notes);

                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_id' => $item['id'],
                    'quantity' => $item['qty'],
                    'subtotal' => $item['itemTotal'],
                    'custom_notes' => $customNotesString ?: null,
                    // INI KUNCI RAHASIANYA: Simpan data mentah JSON agar bisa dihitung modalnya
                    'custom_options' => isset($item['customOptions']) ? json_encode($item['customOptions']) : null,
                ]);
            }
        }); 

        return back()->with('success', 'Pesanan kamu berhasil dibuat!');
    }

    public function history()
    {
        $orders = Order::with(['menu', 'items.menu', 'review', 'complaint'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Orders/History', [
            'orders' => $orders
        ]);
    }
}