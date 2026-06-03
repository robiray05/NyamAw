<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            // TAMBAHKAN KODE INI UNTUK MENGIRIM ANGKA NOTIFIKASI ADMIN
            'pending_orders_count' => $request->user() && $request->user()->role === 'admin'
                ? \App\Models\Order::whereIn('status', ['menunggu_pembayaran', 'dimasak'])->count()
                : 0,

            'pending_complaints_count' => $request->user() && $request->user()->role === 'admin'
                ? \App\Models\Complaint::where('status', 'pending')->count()
                : 0,

            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
        ]);
    }
}
