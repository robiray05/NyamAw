<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Menampilkan halaman login (Hanya berisi tombol Google).
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            // Menangkap pesan error/sukses dari session jika ada
            'status' => session('status'),
            'error' => session('error'),
        ]);
    }

    /**
     * Menghancurkan sesi pengguna (Logout).
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}