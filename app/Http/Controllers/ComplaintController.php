<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'reason' => 'required|string',
        ]);

        Complaint::create([
            'user_id' => auth()->id(),
            'order_id' => $request->order_id,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Komplain berhasil dikirim.');
    }
}