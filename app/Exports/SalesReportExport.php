<?php

namespace App\Exports;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SalesReportExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    public function collection()
    {
        // KEMBALI MENGGUNAKAN 'items.menu' SAJA
        return Order::with(['user', 'items.menu'])->latest()->get();
    }

    public function map($order): array
    {
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
        $profit = $order->total_price - $modal;

        return [
            '#' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
            $order->created_at->format('d-m-Y H:i'),
            $order->user ? $order->user->name : 'Pelanggan Nyam.Aw',
            $order->status,
            'Rp ' . number_format($order->total_price, 0, ',', '.'),
            'Rp ' . number_format($modal, 0, ',', '.'),
            'Rp ' . number_format($profit, 0, ',', '.')
        ];
    }

    public function headings(): array
    {
        return [
            'ID Pesanan',
            'Tanggal & Waktu',
            'Nama Pelanggan',
            'Status Pesanan',
            'Total Pendapatan',
            'Total Modal (HPP)',
            'Keuntungan Bersih'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}