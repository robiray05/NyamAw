<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('total_price', 10, 2);
            $table->string('whatsapp_number'); // <--- KOLOM SAKTI UNTUK NOTIFIKASI WA SUDAH SIAP
            $table->enum('status', ['menunggu_pembayaran', 'pembayaran_berhasil', 'diproses', 'sedang_dimasak', 'siap_diambil', 'selesai', 'dibatalkan'])->default('menunggu_pembayaran');
            $table->enum('payment_status', ['pending', 'success', 'failed'])->default('pending');
            $table->string('qris_reference')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};