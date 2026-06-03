<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $guarded = ['id']; // atau $fillable yang kamu pakai

    // Relasi ke order items (mungkin sudah ada)
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // INI YANG BARU DITAMBAHKAN
    public function reviews()
    {
        return $this->hasMany(Review::class, 'menu_id');
    }
}