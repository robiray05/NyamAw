<?php

use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminMenuController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminReviewController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ==========================================
// RUTE PUBLIK (Bisa diakses tanpa login)
// ==========================================
Route::get('/', function () {
    return Inertia::render('Guest/Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/menu', [MenuController::class, 'index'])->name('menu.index');
Route::get('/menu/{menu}/reviews', [\App\Http\Controllers\MenuController::class, 'reviews'])->name('menu.reviews');

Route::get('/about', function () {
    return Inertia::render('Guest/About');
})->name('about');

Route::get('/contact', function () {
    return \Inertia\Inertia::render('Guest/Contact');
})->name('contact');

// ==========================================
// RUTE USER (Harus login)
// ==========================================
Route::middleware('auth')->group(function () {
    // Profil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Transaksi & Ulasan
    Route::post('/checkout', [OrderController::class, 'store'])->name('checkout.store');
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::get('/riwayat-pesanan', [OrderController::class, 'history'])->name('orders.history');
    Route::post('/complaints', [\App\Http\Controllers\ComplaintController::class, 'store'])->name('complaints.store');
});

// ==========================================
// RUTE SPESIFIK ROLE USER
// ==========================================
Route::middleware(['auth', 'role:user'])->group(function () {
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
});

// ==========================================
// RUTE ADMIN (Harus login & Role Admin)
// ==========================================
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard Admin
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Kelola Menu & Pesanan
    Route::resource('/menus', AdminMenuController::class);
    Route::resource('/orders', AdminOrderController::class);
    Route::put('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.update_status');

    // Kelola Komplain
    Route::get('/complaints', [\App\Http\Controllers\Admin\AdminComplaintController::class, 'index'])->name('complaints.index');
    Route::put('/complaints/{complaint}/status', [\App\Http\Controllers\Admin\AdminComplaintController::class, 'updateStatus'])->name('complaints.update_status');

    // Kelola Ulasan (SUDAH DIPERBAIKI & TIDAK BERTUMPUK)
    Route::get('/reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
    Route::post('/reviews/{review}/reply', [AdminReviewController::class, 'reply'])->name('reviews.reply');
    Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy'])->name('reviews.destroy');

    Route::get('/reports', [\App\Http\Controllers\Admin\AdminReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export', [\App\Http\Controllers\Admin\AdminReportController::class, 'export'])->name('reports.export');
});

require __DIR__ . '/auth.php';