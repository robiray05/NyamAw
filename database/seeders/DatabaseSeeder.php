<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Membuat akun admin
        User::create([
            'name' => 'Admin Nyam Aw',
            'email' => 'admin@mahasiswa.pcr.ac.id',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        // Data dummy menu makanan
        $menus = [
            [
                'name' => 'Ayam Geprek Nyam.Aw',
                'description' => 'Ayam krispi digeprek dengan sambal bawang super pedas khas rumahan.',
                'price' => 15000,
                'image' => 'https://images.unsplash.com/photo-1626082895617-2c6ae347aa8f?q=80&w=600&auto=format&fit=crop',
                'is_available' => true,
            ],
            [
                'name' => 'Nasi Goreng Spesial',
                'description' => 'Nasi goreng bumbu rempah dengan potongan ayam dan sayuran segar.',
                'price' => 18000,
                'image' => 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600&auto=format&fit=crop',
                'is_available' => true,
            ],
            [
                'name' => 'Mie Kuah Pedas Mampus',
                'description' => 'Mie kuah kaldu gurih dengan racikan cabe rawit merah.',
                'price' => 12000,
                'image' => 'https://images.unsplash.com/photo-1612929633738-8fe01f7280f2?q=80&w=600&auto=format&fit=crop',
                'is_available' => true,
            ],
            [
                'name' => 'Ayam Bakar Madu',
                'description' => 'Potongan ayam bakar bumbu madu manis gurih, lengkap dengan sambal terasi.',
                'price' => 20000,
                'image' => 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=600&auto=format&fit=crop',
                'is_available' => true,
            ]
        ];

        foreach ($menus as $menu) {
            Menu::create($menu);
        }
    }
}