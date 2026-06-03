<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOrderController extends Controller
{
    public function index()
    {
        // Menarik semua data order beserta relasi user dan item makanannya
        $orders = Order::with(['user', 'items.menu'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return Inertia::render('Admin/ManageOrders', [
            'orders' => $orders
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:menunggu_pembayaran,diproses,sedang_dimasak,siap_diambil,selesai',
            'payment_status' => 'required|in:pending,success,failed'
        ]);

        $order->update($validated);

        return back()->with('success', 'Status pesanan berhasil diperbarui.');
    }
}