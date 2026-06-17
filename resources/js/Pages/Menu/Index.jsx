import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, StarHalf, ShoppingBag, Plus, X, Flame, Egg, Drumstick, ShoppingCart, Trash2, Phone, ArrowRight, Loader2 } from 'lucide-react';

export default function Index({ menus = [] }) {
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cart, setCart] = useState([]);
    
    // State Baru untuk Modal WA & Loading
    const [showWaModal, setShowWaModal] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const [qty, setQty] = useState(1);
    const [customOptions, setCustomOptions] = useState({
        tambahAyam: false,
        tambahTelur: false,
        pedas: 0
    });

    const maxRating = menus.length > 0 
        ? Math.max(...menus.map(item => Number(item.avg_rating || 0))) 
        : 0;

    const openOrderModal = (menu) => {
        setSelectedMenu(menu);
        setQty(1);
        setCustomOptions({ tambahAyam: false, tambahTelur: false, pedas: 0 });
    };

    const closeOrderModal = () => {
        setSelectedMenu(null);
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const calculateItemTotal = (menuPrice) => {
        let addon = 0;
        if (customOptions.tambahAyam) addon += 8000;
        if (customOptions.tambahTelur) addon += 4000;
        return (Number(menuPrice) + addon) * qty;
    };

    const addToCart = () => {
        const basePrice = Number(selectedMenu.price);
        let addon = 0;
        if (customOptions.tambahAyam) addon += 8000;
        if (customOptions.tambahTelur) addon += 4000;

        const newItem = {
            id: selectedMenu.id,
            name: selectedMenu.name,
            image: selectedMenu.image,
            price: basePrice,
            qty: qty,
            customOptions: { ...customOptions },
            itemTotal: (basePrice + addon) * qty
        };
        
        setCart([...cart, newItem]);
        closeOrderModal();
    };

    const removeFromCart = (indexToRemove) => {
        setCart(cart.filter((_, index) => index !== indexToRemove));
        if (cart.length === 1) setIsCartOpen(false);
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);

    // FUNGSI 1: Buka Modal WA saat Klik Checkout di Keranjang
    const handleCartCheckoutClick = () => {
        if (cart.length === 0) return;
        setIsCartOpen(false); // Tutup sidebar cart
        setShowWaModal(true); // Buka modal WA
    };

    // FUNGSI 2: Kirim data asli ke Laravel (Database Nyam.Aw)
    const processPayment = (e) => {
        e.preventDefault();
        
        if (!whatsappNumber.startsWith('08') && !whatsappNumber.startsWith('62')) {
            alert('Format Salah: Nomor WhatsApp harus diawali dengan 08 atau 62');
            return;
        }

        setIsProcessing(true);

        // Ubah format keranjang menjadi format yang dikenali database
        const formattedItems = cart.map(item => {
            let notes = `Lv.${item.customOptions.pedas}`;
            if (item.customOptions.tambahAyam) notes += ', +Ayam';
            if (item.customOptions.tambahTelur) notes += ', +Telur';
            
            return {
                menu_id: item.id,
                quantity: item.qty,
                subtotal: item.itemTotal,
                custom_notes: notes
            };
        });

        // TEMBAK JALUR ANTI-BENTROK YANG SUDAH KITA BUAT
        router.post('/checkout/proses-nyamaw', {
            whatsapp_number: whatsappNumber,
            total_price: cartTotal,
            items: formattedItems
        }, {
            onSuccess: () => {
                setIsProcessing(false);
                setShowWaModal(false);
                setCart([]); // Kosongkan keranjang
            },
            onError: (errors) => {
                setIsProcessing(false);
                alert(errors.whatsapp_number || "Gagal membuat pesanan QRIS, coba muat ulang halaman.");
            }
        });
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`full-${i}`} size={16} fill="currentColor" className="text-[#F4A236]" />);
        }
        if (hasHalfStar) {
            stars.push(
                <div key="half" className="relative w-4 h-4 inline-block">
                    <Star size={16} className="text-gray-200 absolute top-0 left-0" />
                    <StarHalf size={16} fill="currentColor" className="text-[#F4A236] absolute top-0 left-0" />
                </div>
            );
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-200" />);
        }
        return stars;
    };

    return (
        <MainLayout>
            <Head title="Menu Makanan" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
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

                {menus.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {menus.map((item, index) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                                key={item.id} 
                                className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-[#438240]/10 transition-all flex flex-col group"
                            >
                                <div className="w-full h-48 bg-[#FCF9F2] rounded-3xl overflow-hidden mb-5 relative">
                                    <img 
                                        src={item.image || '/images/food-hero.png'} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                        onError={(e) => { e.target.src = '/images/food-hero.png'; }}
                                    />
                                    
                                    {Number(item.avg_rating) === maxRating && maxRating >= 4 && (
                                        <div className="absolute top-3 left-3 bg-[#F4A236] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                            🌟 Rekomendasi
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 px-2">
                                    <h3 className="text-xl font-bold text-[#223322] mb-1 line-clamp-1">{item.name}</h3>
                                    
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center text-[#F4A236] gap-0.5">
                                                {renderStars(Number(item.avg_rating || 0))}
                                            </div>
                                            <span className="text-xs font-bold text-[#597359]">
                                                {item.avg_rating > 0 ? `${Number(item.avg_rating).toFixed(1)} (${item.total_reviews})` : 'Baru'}
                                            </span>
                                        </div>
                                        
                                        {item.total_reviews > 0 && (
                                            <Link 
                                                href={`/menu/${item.id}/reviews`}
                                                className="text-[10px] font-bold text-[#438240] bg-[#438240]/10 px-2.5 py-1 rounded-md hover:bg-[#438240] hover:text-white transition-all cursor-pointer"
                                            >
                                                Lihat Ulasan
                                            </Link>
                                        )}
                                    </div>

                                    <p className="text-sm text-[#597359] line-clamp-2 mb-4">{item.description || 'Menu lezat masakan rumahan ala Nyam.Aw.'}</p>
                                </div>

                                <div className="flex items-center justify-between px-2 pt-4 border-t border-gray-50 mt-auto">
                                    <span className="text-xl font-extrabold text-[#438240]">
                                        {formatRupiah(item.price)}
                                    </span>
                                    <button 
                                        onClick={() => openOrderModal(item)}
                                        className="bg-[#223322] text-white p-3 rounded-full hover:bg-[#438240] transition-colors shadow-md"
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
                    </div>
                )}
            </div>

            {/* MODAL CUSTOM PESANAN */}
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

                            <div className="flex items-center justify-between mt-auto pt-4">
                                <div className="flex items-center bg-gray-100 rounded-full p-1">
                                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-full bg-white text-[#223322] shadow font-bold hover:bg-gray-50">-</button>
                                    <span className="w-12 text-center font-bold text-[#223322]">{qty}</span>
                                    <button onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-full bg-white text-[#223322] shadow font-bold hover:bg-gray-50">+</button>
                                </div>
                                <button 
                                    onClick={addToCart}
                                    className="bg-[#438240] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#366B33] transition-colors shadow-lg shadow-[#438240]/30"
                                >
                                    Tambah - {formatRupiah(calculateItemTotal(selectedMenu.price))}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* FLOATING CART BUTTON */}
            <AnimatePresence>
                {cart.length > 0 && !isCartOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsCartOpen(true)}
                        className="fixed bottom-8 right-8 z-40 bg-[#F4A236] text-white p-4 rounded-full shadow-2xl hover:bg-[#e09331] transition-all flex items-center gap-3"
                    >
                        <div className="relative">
                            <ShoppingCart size={28} />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#F4A236]">
                                {cart.length}
                            </span>
                        </div>
                        <span className="font-extrabold pr-2 hidden sm:block">Checkout</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* SIDEBAR CART */}
            <AnimatePresence>
                {isCartOpen && (
                    <div className="fixed inset-0 z-[70] flex justify-end bg-[#223322]/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FCF9F2]">
                                <h2 className="text-xl font-bold text-[#223322] flex items-center gap-2">
                                    <ShoppingCart size={24} className="text-[#438240]" /> Keranjang Belanja
                                </h2>
                                <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {cart.map((item, index) => (
                                    <div key={index} className="flex gap-4 p-4 border border-gray-100 rounded-2xl bg-white shadow-sm">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[#223322] mb-1">{item.name} <span className="text-sm font-normal text-gray-500">x{item.qty}</span></h4>
                                            
                                            <div className="text-xs text-[#597359] mb-2 space-y-0.5">
                                                {item.customOptions.tambahAyam && <p>+ Tambah Ayam</p>}
                                                {item.customOptions.tambahTelur && <p>+ Tambah Telur</p>}
                                                {item.customOptions.pedas > 0 && <p>+ Pedas Lv {item.customOptions.pedas}</p>}
                                            </div>
                                            
                                            <p className="font-extrabold text-[#438240]">{formatRupiah(item.itemTotal)}</p>
                                        </div>
                                        <button onClick={() => removeFromCart(index)} className="text-gray-300 hover:text-red-500 transition-colors self-start">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[#597359] font-medium">Total Pembayaran:</span>
                                    <span className="text-2xl font-extrabold text-[#223322]">{formatRupiah(cartTotal)}</span>
                                </div>
                                <button 
                                    onClick={handleCartCheckoutClick} // <-- DIGANTI MEMANGGIL MODAL WA
                                    className="w-full bg-[#438240] text-white py-4 rounded-full font-bold hover:bg-[#366B33] transition-all shadow-lg flex justify-center items-center gap-2"
                                >
                                    Lanjutkan ke Pembayaran <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL INPUT WHATSAPP SAKTI */}
            {showWaModal && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                        
                        <button 
                            onClick={() => !isProcessing && setShowWaModal(false)} 
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full bg-gray-50"
                            disabled={isProcessing}
                        >
                            <X size={18} />
                        </button>

                        <div className="text-center mb-6 mt-2">
                            <div className="bg-[#438240]/10 text-[#438240] p-3 rounded-2xl w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                <Phone size={24} />
                            </div>
                            <h3 className="font-bold text-xl text-[#223322]">Notifikasi WhatsApp</h3>
                            <p className="text-sm text-gray-500 mt-1 px-4">
                                Masukkan nomor WA aktifmu untuk menerima info live status pesanan Nyam.Aw.
                            </p>
                        </div>

                        <form onSubmit={processPayment} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nomor WhatsApp</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 font-bold text-sm">+62</span>
                                    <input 
                                        type="tel" 
                                        required
                                        disabled={isProcessing}
                                        placeholder="8123456789"
                                        value={whatsappNumber.replace(/^(62|0)/, '')} 
                                        onChange={(e) => setWhatsappNumber('0' + e.target.value.replace(/\D/g, ''))}
                                        className="w-full pl-14 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-[#438240] focus:border-transparent outline-none transition-all disabled:opacity-60"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center border border-gray-100">
                                <span className="text-sm font-bold text-gray-500">Total Bayar</span>
                                <span className="text-xl font-black text-[#438240]">
                                    {formatRupiah(cartTotal)}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-[#223322] text-white font-bold py-4 rounded-full hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Membuat QRIS...
                                    </>
                                ) : (
                                    <>
                                        Bayar Sekarang
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </MainLayout>
    );
}