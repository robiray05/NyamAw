<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        // Cek agar satu pesanan tidak bisa diulas dua kali
        $existingReview = Review::where('order_id', $request->order_id)->first();
        if ($existingReview) {
            return back()->withErrors(['message' => 'Pesanan ini sudah diulas.']);
        }

        Review::create([
            'user_id' => auth()->id(),
            'menu_id' => $request->menu_id,
            'order_id' => $request->order_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Ulasan berhasil dikirim!');
    }
}