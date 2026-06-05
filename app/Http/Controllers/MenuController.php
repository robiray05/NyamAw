<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
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
            ->get()
            ->map(function ($menu) {
                $menu->image_url = $menu->image ? asset('storage/' . $menu->image) : null;
                return $menu;
            });

        return Inertia::render('Menu/Index', [
            'menus' => $menus
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'modal_price' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', 
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('menus', 'public');
        }

        Menu::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'modal_price' => $request->modal_price,
            'image' => $imagePath,
            'is_available' => true,
        ]);

        return redirect()->back()->with('success', 'Menu baru berhasil ditambahkan!');
    }

    public function update(Request $request, Menu $menu)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'modal_price' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $dataToUpdate = [
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'modal_price' => $request->modal_price,
        ];

        if ($request->hasFile('image')) {
            if ($menu->image) {
                Storage::disk('public')->delete($menu->image);
            }
            
            $dataToUpdate['image'] = $request->file('image')->store('menus', 'public');
        }

        $menu->update($dataToUpdate);

        return redirect()->back()->with('success', 'Menu berhasil diperbarui!');
    }

    public function destroy(Menu $menu)
    {
        if ($menu->image) {
            Storage::disk('public')->delete($menu->image);
        }
        
        $menu->delete();

        return redirect()->back()->with('success', 'Menu berhasil dihapus!');
    }

    public function reviews(Menu $menu)
    {
        $menu->load(['reviews' => function($query) {
            $query->with('user')->latest();
        }]);

        return Inertia::render('Menu/Reviews', [
            'menu' => $menu
        ]);
    }
}