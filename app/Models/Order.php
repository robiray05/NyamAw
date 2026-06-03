<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function complaint()
    {
        return $this->hasOne(Complaint::class);
    }

    // Menggunakan relasi langsung ke tabel reviews
    public function review()
    {
        return $this->hasOne(Review::class);
    }
}