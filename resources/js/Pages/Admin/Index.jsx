import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingBag, Plus, X, Flame, Egg, Drumstick } from 'lucide-react';

export default function Index({ menus = [] }) {
    const [selectedMenu, setSelectedMenu] = useState(null);

    // Form state untuk simulasi Custom Order (seperti di OrderController kamu)
    const { data, setData, post, processing, reset } = useForm({
        cart: [], // Format cart sesuai yang dibutuhkan controller
        total_price: 0
    });

    // State lokal untuk modal custom pesanan
    const [qty, setQty] = useState(1);
    const [customOptions, setCustomOptions] = useState({
        tambahAyam: false,
        tambahTelur: false,
        pedas: 0
    });

    const openOrderModal = (menu) => {
        setSelectedMenu(menu);
        setQty(1);
        setCustomOptions({ tambahAyam: false, tambahTelur: false, pedas: 0 });
    };

    const closeOrderModal = () => {
        setSelectedMenu(null);
    };

    // Fungsi untuk memformat angka ke Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    return (
        <MainLayout>
            <Head title="Menu Makanan" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-block bg-[#438240]/10 text-[#438240] px-4 py-2 rounded-full font-semibold text-sm mb-4 border border-[#438240]/20"
                    >
                        🍽️ Menu Nyam.Aw Hari Ini
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-heading font-extrabold text-[#223322] mb-4"
                    >
                        Pilih Makanan Favoritmu!
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className="text-[#597359] max-w-xl mx-auto"
                    >
                        Semua menu dimasak fresh. Jangan lupa custom tambahan topping sesuai seleramu sebelum checkout.
                    </motion.p>
                </div>

                {/* Grid Menu */}
                {menus.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {menus.map((item, index) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: index * 0.1 }}
                                key={item.id} 
                                className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-[#438240]/10 hover:-translate-y-1 transition-all flex flex-col group"
                            >
                                {/* Foto Makanan */}
                                <div className="w-full h-48 bg-[#FCF9F2] rounded-3xl overflow-hidden mb-5 relative">
                                    <img 
                                        src={item.image || '/images/food-hero.png'} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                        onError={(e) => { e.target.src = '/images/food-hero.png'; }}
                                    />
                                    {/* Label Rekomendasi jika rating tinggi */}
                                    {item.avg_rating >= 4.5 && (
                                        <div className="absolute top-3 left-3 bg-[#F4A236] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                            🌟 Rekomendasi
                                        </div>
                                    )}
                                </div>

                                {/* Info Makanan */}
                                <div className="flex-1 px-2">
                                    <h3 className="text-xl font-bold text-[#223322] mb-1 line-clamp-1">{item.name}</h3>
                                    
                                    {/* SECTION RATING BINTANG */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex items-center text-[#F4A236]">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    size={16} 
                                                    fill={i < Math.round(item.avg_rating || 0) ? "currentColor" : "none"} 
                                                    className={i < Math.round(item.avg_rating || 0) ? "text-[#F4A236]" : "text-gray-200"}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold text-[#597359]">
                                            {item.avg_rating > 0 ? `${item.avg_rating} (${item.total_reviews} ulasan)` : 'Baru'}
                                        </span>
                                    </div>

                                    <p className="text-sm text-[#597359] line-clamp-2 mb-4">{item.description || 'Menu lezat masakan rumahan ala Nyam.Aw.'}</p>
                                </div>

                                {/* Harga & Tombol Beli */}
                                <div className="flex items-center justify-between px-2 pt-4 border-t border-gray-50 mt-auto">
                                    <span className="text-xl font-extrabold text-[#438240]">
                                        {formatRupiah(item.price)}
                                    </span>
                                    <button 
                                        onClick={() => openOrderModal(item)}
                                        className="bg-[#223322] text-white p-3 rounded-full hover:bg-[#438240] transition-colors shadow-md"
                                        title="Tambah ke Pesanan"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-50">
                        <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-[#223322] mb-2">Menu Belum Tersedia</h3>
                        <p className="text-[#597359]">Admin belum menambahkan menu makanan ke sistem.</p>
                    </div>
                )}
            </div>

            {/* MODAL CUSTOM PESANAN (Menyesuaikan dengan OrderController) */}
            <AnimatePresence>
                {selectedMenu && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#223322]/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className="bg-white w-full max-w-lg rounded-[2rem] p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
                        >
                            <button onClick={closeOrderModal} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-full p-2">
                                <X size={20} />
                            </button>
                            
                            <div className="flex gap-4 items-center mb-6">
                                <img src={selectedMenu.image || '/images/food-hero.png'} alt={selectedMenu.name} className="w-24 h-24 rounded-2xl object-cover" />
                                <div>
                                    <h2 className="text-2xl font-bold text-[#223322]">{selectedMenu.name}</h2>
                                    <p className="text-[#438240] font-extrabold text-lg">{formatRupiah(selectedMenu.price)}</p>
                                </div>
                            </div>

                            <hr className="border-gray-100 mb-6" />

                            <h3 className="font-bold text-[#223322] mb-4">Custom Pesanan Kamu:</h3>
                            
                            {/* Opsi Tambahan */}
                            <div className="space-y-4 mb-8">
                                <label className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-[#FCF9F2] cursor-pointer hover:border-[#438240] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Drumstick className="text-[#F4A236]" size={20} />
                                        <span className="font-medium text-[#223322]">Tambah Ayam (+ Rp 8.000)</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 text-[#438240] rounded border-gray-300 focus:ring-[#438240]"
                                        checked={customOptions.tambahAyam}
                                        onChange={(e) => setCustomOptions({...customOptions, tambahAyam: e.target.checked})}
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-[#FCF9F2] cursor-pointer hover:border-[#438240] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Egg className="text-[#F4A236]" size={20} />
                                        <span className="font-medium text-[#223322]">Tambah Telur (+ Rp 4.000)</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 text-[#438240] rounded border-gray-300 focus:ring-[#438240]"
                                        checked={customOptions.tambahTelur}
                                        onChange={(e) => setCustomOptions({...customOptions, tambahTelur: e.target.checked})}
                                    />
                                </label>

                                <div className="p-4 rounded-2xl border border-gray-100 bg-[#FCF9F2]">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Flame className={customOptions.pedas > 0 ? "text-red-500" : "text-gray-400"} size={20} />
                                        <span className="font-medium text-[#223322]">Level Pedas</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" max="5" 
                                        className="w-full accent-red-500"
                                        value={customOptions.pedas}
                                        onChange={(e) => setCustomOptions({...customOptions, pedas: parseInt(e.target.value)})}
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-2 font-bold">
                                        <span>Original</span>
                                        <span>Lv 1</span>
                                        <span>Lv 2</span>
                                        <span>Lv 3</span>
                                        <span>Lv 4</span>
                                        <span className="text-red-500">Mampus</span>
                                    </div>
                                </div>
                            </div>

                            {/* Qty & Add to Cart Action */}
                            <div className="flex items-center justify-between mt-auto pt-4">
                                <div className="flex items-center bg-gray-100 rounded-full p-1">
                                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-full bg-white text-[#223322] shadow font-bold hover:bg-gray-50">-</button>
                                    <span className="w-12 text-center font-bold text-[#223322]">{qty}</span>
                                    <button onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-full bg-white text-[#223322] shadow font-bold hover:bg-gray-50">+</button>
                                </div>
                                <button 
                                    onClick={() => {
                                        // Disini kamu bisa masukan logika simpan ke state global (Cart) atau langsung tembak ke checkout.
                                        alert('Ditambahkan ke keranjang (Integrasi Cart)!');
                                        closeOrderModal();
                                    }}
                                    className="bg-[#438240] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#366B33] transition-colors shadow-lg shadow-[#438240]/30"
                                >
                                    Tambah - {formatRupiah((selectedMenu.price + (customOptions.tambahAyam ? 8000 : 0) + (customOptions.tambahTelur ? 4000 : 0)) * qty)}
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </MainLayout>
    );
}