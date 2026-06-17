<?php

use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminMenuController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\Admin\AdminComplaintController;
use App\Http\Controllers\Admin\AdminReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Guest/Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/menu', [MenuController::class, 'index'])->name('menu.index');
Route::get('/menu/{menu}/reviews', [MenuController::class, 'reviews'])->name('menu.reviews');

Route::get('/about', function () {
    return Inertia::render('Guest/About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Guest/Contact');
})->name('contact');

// TARUH DI LUAR GRUP MIDDLEWARE AUTH (RUTE PUBLIK)
Route::post('/doku/webhook', [OrderController::class, 'webhook'])->name('doku.webhook');

// RUTE USER (Harus login)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::get('/riwayat-pesanan', [OrderController::class, 'history'])->name('orders.history');
    Route::post('/complaints', [ComplaintController::class, 'store'])->name('complaints.store');

    // INI DIA JALUR QRIS BARU KITA
    Route::post('/checkout/proses-nyamaw', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/checkout/{order}/bayar-qris', [OrderController::class, 'pay'])->name('orders.pay');
});

Route::middleware(['auth', 'role:user'])->group(function () {
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
});

// RUTE ADMIN
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    Route::resource('/menus', AdminMenuController::class);
    Route::resource('/orders', AdminOrderController::class);
    Route::put('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.update_status');
    
    Route::get('/complaints', [AdminComplaintController::class, 'index'])->name('complaints.index');
    Route::put('/complaints/{complaint}/status', [AdminComplaintController::class, 'updateStatus'])->name('complaints.update_status');

    Route::get('/reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
    Route::post('/reviews/{review}/reply', [AdminReviewController::class, 'reply'])->name('reviews.reply');
    Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy'])->name('reviews.destroy');

    Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export', [AdminReportController::class, 'export'])->name('reports.export');
});

require __DIR__ . '/auth.php';