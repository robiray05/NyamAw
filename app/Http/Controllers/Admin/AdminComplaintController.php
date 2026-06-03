<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;

class AdminComplaintController extends Controller
{
    public function index()
    {
        // Memanggil order.items.menu agar nama menu terbaca akurat
        $complaints = Complaint::with(['user', 'order.items.menu'])->latest()->get();

        return inertia('Admin/Complaints/Index', [
            'complaints' => $complaints
        ]);
    }

    public function updateStatus(Request $request, Complaint $complaint)
    {
        // Validasi agar admin wajib mengisi balasan
        $request->validate([
            'admin_reply' => 'required|string|min:3'
        ]);

        $complaint->update([
            'status' => 'selesai',
            'admin_reply' => $request->admin_reply
        ]);

        return back()->with('success', 'Komplain berhasil dibalas dan ditandai selesai.');
    }
}