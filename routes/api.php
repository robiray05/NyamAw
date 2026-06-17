<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// INI RUTE SAKTI KITA (Pakai "any" biar bisa menerima POST dari DOKU dan GET dari Browser)
Route::any('/doku/webhook', [OrderController::class, 'webhook']);