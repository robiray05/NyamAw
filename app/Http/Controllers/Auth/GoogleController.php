<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Exception;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // 1. DAFTAR EMAIL ADMIN (Silakan ganti/tambahkan email kamu di sini)
            $adminEmails = [
                'robby24ti@mahasiswa.pcr.ac.id', 
                'alif24ti@mahasiswa.pcr.ac.id',
                'nadini24ti@mahasiswa.pcr.ac.id',
            ];

            // 2. Cek apakah email yang login ada di dalam daftar $adminEmails
            $role = in_array($googleUser->email, $adminEmails) ? 'admin' : 'user';

            // 3. Cari user di database
            $user = User::where('google_id', $googleUser->id)
                        ->orWhere('email', $googleUser->email)
                        ->first();

            if (!$user) {
                // Jika belum pernah daftar sama sekali, buatkan akun baru
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'role' => $role, // Otomatis admin atau user
                ]);
            } else {
                // Jika sudah ada, pastikan google_id terisi
                if (empty($user->google_id)) {
                    $user->update(['google_id' => $googleUser->id]);
                }
                
                // Fitur Sakti: Kalau kamu tiba-tiba menambahkan email user lama ke daftar $adminEmails,
                // sistem akan otomatis meng-upgrade akunnya jadi admin saat dia login lagi!
                if ($user->role !== $role && in_array($googleUser->email, $adminEmails)) {
                    $user->update(['role' => 'admin']);
                }
            }

            // 4. Login paksa user tersebut
            Auth::login($user);

            // 5. Arahkan sesuai jabatannya
            if ($user->role === 'admin') {
                return redirect()->route('admin.dashboard')->with('success', 'Selamat datang kembali, Admin!');
            }

            return redirect('/menu')->with('success', 'Berhasil masuk dengan Google!');

        } catch (Exception $e) {
            return redirect('/login')->with('error', 'Gagal masuk menggunakan akun Google. Silakan coba lagi.');
        }
    }
}