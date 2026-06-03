<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SalesReportExport;

class AdminReportController extends Controller
{
    public function index()
    {
        // KEMBALI MENGGUNAKAN 'items.menu' SAJA
        $orders = Order::with(['user', 'items.menu'])->latest()->get();

        $completedOrders = $orders->whereIn('status', ['selesai', 'Selesai']);
        $totalRevenue = $completedOrders->sum('total_price');
        $totalOrders = $orders->count();

        $totalCost = 0;
        foreach ($completedOrders as $order) {
            $orderItems = $order->items ?? [];
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
                    $totalCost += $modalItem;
                }
            }
        }
        $netProfit = $totalRevenue - $totalCost;

        $ordersData = $orders->map(function ($order) {
            $modal = 0;
            $orderItems = $order->items ?? [];
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
                    $modal += $modalItem;
                }
            }
            $order->total_modal = $modal;
            $order->net_profit = $order->total_price - $modal;
            return $order;
        });

        return inertia('Admin/ManageReports', [
            'orders' => $ordersData,
            'totalRevenue' => $totalRevenue,
            'totalOrders' => $totalOrders,
            'totalCost' => $totalCost,
            'netProfit' => $netProfit
        ]);
    }

    public function export()
    {
        return Excel::download(new SalesReportExport, 'Laporan_Penjualan_NyamAw.xlsx');
    }
}