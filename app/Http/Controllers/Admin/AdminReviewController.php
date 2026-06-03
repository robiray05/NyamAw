<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class AdminReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with(['user', 'menu'])->latest()->get();

        return inertia('Admin/ManageReviews', [
            'reviews' => $reviews
        ]);
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return back()->with('success', 'Ulasan berhasil dihapus.');
    }

    // PERBAIKAN UTAMA: Menggunakan ID murni untuk mengunci penyimpanan ke Database
    public function reply(Request $request, $id)
    {
        $request->validate([
            'admin_reply' => 'required|string|min:3'
        ]);

        // Cari data ulasan langsung berdasarkan ID-nya
        $review = Review::findOrFail($id);
        
        // Simpan langsung ke properti objeknya agar bypass semua proteksi mass-assignment
        $review->admin_reply = $request->admin_reply;
        $review->save();

        return back()->with('success', 'Balasan berhasil dikirim.');
    }
}