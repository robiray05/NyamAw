<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminMenuController extends Controller
{
    public function index()
    {
        $menus = Menu::latest()->get();
        return Inertia::render('Admin/ManageMenus', [
            'menus' => $menus
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'modal_price' => 'required|numeric',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = '/storage/' . $request->file('image')->store('menus', 'public');
        }

        Menu::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'modal_price' => $request->modal_price,
            'image' => $imagePath,
        ]);

        return back()->with('success', 'Menu berhasil ditambahkan.');
    }

    public function update(Request $request, Menu $menu)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'modal_price' => 'required|numeric',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = $menu->image;
        if ($request->hasFile('image')) {
            if ($menu->image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $menu->image));
            }
            $imagePath = '/storage/' . $request->file('image')->store('menus', 'public');
        }

        $menu->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'modal_price' => $request->modal_price,
            'image' => $imagePath,
        ]);

        return back()->with('success', 'Menu berhasil diperbarui.');
    }

    public function destroy(Menu $menu)
    {
        if ($menu->image) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $menu->image));
        }
        $menu->delete();

        return back()->with('success', 'Menu berhasil dihapus.');
    }
}