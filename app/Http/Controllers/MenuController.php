<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index()
    {
        $menus = Menu::withCount('reviews as total_reviews')
            ->withAvg('reviews as avg_rating', 'rating')
            ->latest()
            ->get();

        return Inertia::render('Menu/Index', [
            'menus' => $menus
        ]);
    }

    public function reviews(Menu $menu)
    {
        // Memastikan data ulasan pelanggan beserta relasi user dan balasan admin dimuat secara fresh
        $menu->load(['reviews' => function($query) {
            $query->with('user')->latest();
        }]);

        return Inertia::render('Menu/Reviews', [
            'menu' => $menu
        ]);
    }
}