<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Carbon\Carbon;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // KEMBALI MENGGUNAKAN 'items.menu' SAJA AGAR TIDAK ERROR
        $todayOrdersData = Order::with('items.menu')
            ->whereDate('created_at', $today)
            ->whereIn('status', ['selesai', 'Selesai'])
            ->get();

        $todayRevenue = $todayOrdersData->sum('total_price');
        $todayOrders = Order::whereDate('created_at', $today)->count();
        $pendingOrders = Order::whereNotIn('status', ['selesai', 'Selesai', 'dibatalkan', 'Dibatalkan'])->count();

        $todayTotalCost = 0;
        foreach ($todayOrdersData as $order) {
            $orderItems = $order->items ?? []; // Hapus deteksi orderItems yang bikin error
            
            foreach ($orderItems as $item) {
                if ($item->menu) {
                    $qty = $item->quantity ?? $item->qty ?? 1;
                    $modalItem = $qty * $item->menu->modal_price;

                    $optionsData = $item->custom_options ?? $item->customOptions ?? null;
                    $options = is_string($optionsData) ? json_decode($optionsData, true) : $optionsData;

                    if ($options) {
                        $tambahAyam = $options['tambahAyam'] ?? $options['tambah_ayam'] ?? false;
                        $tambahTelur = $options['tambahTelur'] ?? $options['tambah_telur'] ?? false;

                        if (isset($options['customOptions'])) {
                            $tambahAyam = $tambahAyam ?: ($options['customOptions']['tambahAyam'] ?? false);
                            $tambahTelur = $tambahTelur ?: ($options['customOptions']['tambahTelur'] ?? false);
                        }
                        if (isset($options['custom_options'])) {
                            $tambahAyam = $tambahAyam ?: ($options['custom_options']['tambahAyam'] ?? false);
                            $tambahTelur = $tambahTelur ?: ($options['custom_options']['tambahTelur'] ?? false);
                        }

                        if ($tambahAyam == true || $tambahAyam === 'true' || $tambahAyam == 1) $modalItem += (5000 * $qty);
                        if ($tambahTelur == true || $tambahTelur === 'true' || $tambahTelur == 1) $modalItem += (2000 * $qty);
                    }

                    $todayTotalCost += $modalItem;
                }
            }
        }
        $netProfit = $todayRevenue - $todayTotalCost; 

        $weeklySales = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $ordersAtDate = Order::whereDate('created_at', $date)
                ->whereIn('status', ['selesai', 'Selesai'])
                ->sum('total_price');

            $weeklySales[] = [
                'name' => $date->locale('id')->isoFormat('dddd'),
                'total' => $ordersAtDate
            ];
        }

        $recentOrders = Order::with(['user', 'menu'])->latest()->take(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'todayRevenue' => $todayRevenue,
            'todayOrders' => $todayOrders,
            'pendingOrders' => $pendingOrders,
            'netProfit' => $netProfit,
            'weeklySales' => $weeklySales,
            'recentOrders' => $recentOrders
        ]);
    }
}