import MainLayout from '@/Layouts/MainLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MenuCard from '@/Components/MenuCard';
import { X, ShoppingCart, Phone, ArrowRight, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Menu({ menus }) {
    const { auth = {}, flash = {} } = usePage().props;
    const user = auth?.user; 

    const [cart, setCart] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    
    // State Modal
    const [showCartModal, setShowCartModal] = useState(false);
    const [showWaModal, setShowWaModal] = useState(false);
    
    // State Form & Loading
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [customOptions, setCustomOptions] = useState({ pedas: 0, tambahAyam: false, tambahTelur: false });
    const [qty, setQty] = useState(1);

    const displayMenus = Array.isArray(menus) ? menus : (menus?.data || []);
    const cartTotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);

    const openModal = (menu) => {
        setSelectedMenu(menu);
        setQty(1);
        setCustomOptions({ pedas: 0, tambahAyam: false, tambahTelur: false });
    };

    const addToCart = () => {
        let extraPrice = 0;
        if (customOptions.tambahAyam) extraPrice += 5000;
        if (customOptions.tambahTelur) extraPrice += 3000;

        const itemTotal = (selectedMenu.price + extraPrice) * qty;

        setCart([...cart, { ...selectedMenu, qty, customOptions, itemTotal }]);
        setSelectedMenu(null);

        Swal.fire({
            title: 'Berhasil!',
            text: 'Makanan ditambahkan ke keranjang',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    };

    // 1. Fungsi saat tombol Checkout di keranjang diklik
    const handleCartCheckoutClick = () => {
        if (!user) {
            Swal.fire('Akses Ditolak', 'Silakan login terlebih dahulu menggunakan email institusi untuk memesan.', 'warning');
            return;
        }
        // Tutup keranjang, buka modal WA
        setShowCartModal(false);
        setShowWaModal(true);
    };

    // 2. Fungsi saat tombol "Bayar Sekarang" di Modal WA diklik
    const processPayment = (e) => {
        e.preventDefault();
        
        if (!whatsappNumber.startsWith('08') && !whatsappNumber.startsWith('62')) {
            Swal.fire('Format Salah', 'Nomor WhatsApp harus diawali dengan 08 atau 62', 'error');
            return;
        }

        setIsProcessing(true);

        // Merakit data keranjang agar sesuai dengan database Nyam.Aw
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

        // Tembak ke backend OrderController@store
        router.post(route('orders.store'), {
            whatsapp_number: whatsappNumber,
            total_price: cartTotal,
            items: formattedItems
        }, {
            onSuccess: () => {
                setIsProcessing(false);
                setShowWaModal(false);
                setCart([]); // Kosongkan keranjang jika sukses
            },
            onError: (errors) => {
                setIsProcessing(false);
                Swal.fire('Gagal', errors.whatsapp_number || 'Terjadi kesalahan pada sistem DOKU.', 'error');
            }
        });
    };

    return (
        <MainLayout>
            <Head title="Menu Makanan" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-heading font-bold text-[#1E1E1E]">Katalog Menu</h1>
                    <button 
                        onClick={() => setShowCartModal(true)}
                        className="bg-[#1E1E1E] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#FF6B35] transition-colors relative"
                    >
                        <ShoppingCart size={20} />
                        Keranjang
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayMenus.map(menu => (
                        <MenuCard key={menu.id} menu={menu} onAdd={() => openModal(menu)} />
                    ))}
                    {displayMenus.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            Belum ada menu yang tersedia.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Tambah ke Keranjang (Tetap Sama) */}
            {selectedMenu && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="relative h-48 bg-gray-200">
                            <img src={selectedMenu.image} alt={selectedMenu.name} className="w-full h-full object-cover" />
                            <button onClick={() => setSelectedMenu(null)} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-800 hover:bg-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-bold font-heading mb-1 text-[#1E1E1E]">{selectedMenu.name}</h3>
                            <p className="text-[#FF6B35] font-bold text-lg mb-4">Rp {selectedMenu.price.toLocaleString('id-ID')}</p>

                            <div className="space-y-4 mb-6 text-[#1E1E1E]">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Level Pedas (0-5)</label>
                                    <input type="range" min="0" max="5" value={customOptions.pedas} onChange={(e) => setCustomOptions({...customOptions, pedas: e.target.value})} className="w-full accent-[#FF6B35]" />
                                    <div className="text-center text-sm font-bold text-gray-600 mt-1">Level: {customOptions.pedas}</div>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <span className="text-sm font-medium">Tambah Ayam (+Rp 5.000)</span>
                                    <input type="checkbox" checked={customOptions.tambahAyam} onChange={(e) => setCustomOptions({...customOptions, tambahAyam: e.target.checked})} className="w-5 h-5 accent-[#FF6B35] rounded border-gray-300" />
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <span className="text-sm font-medium">Tambah Telur (+Rp 3.000)</span>
                                    <input type="checkbox" checked={customOptions.tambahTelur} onChange={(e) => setCustomOptions({...customOptions, tambahTelur: e.target.checked})} className="w-5 h-5 accent-[#FF6B35] rounded border-gray-300" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <span className="font-bold text-[#1E1E1E]">Jumlah:</span>
                                <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl px-2 py-1">
                                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-[#1E1E1E]">-</button>
                                    <span className="font-bold w-4 text-center text-[#1E1E1E]">{qty}</span>
                                    <button onClick={() => setQty(qty + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-[#1E1E1E]">+</button>
                                </div>
                            </div>

                            <button onClick={addToCart} className="w-full bg-[#FF6B35] text-white py-3.5 rounded-xl font-bold hover:bg-[#e85d2c] hover:-translate-y-0.5 transition-all shadow-lg shadow-[#FF6B35]/30">
                                Tambah ke Keranjang
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Keranjang Belanja */}
            {showCartModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
                        <button onClick={() => setShowCartModal(false)} className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                            <X size={20} />
                        </button>
                        <h3 className="text-2xl font-bold font-heading mb-6 text-[#1E1E1E]">Keranjang Belanja</h3>
                        
                        {cart.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">Keranjang masih kosong.</p>
                        ) : (
                            <>
                                <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-6 pr-2">
                                    {cart.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <div>
                                                <p className="font-bold text-sm">{item.name} (x{item.qty})</p>
                                                <p className="text-xs text-gray-500">Lv.{item.customOptions.pedas} {item.customOptions.tambahAyam ? '+Ayam' : ''} {item.customOptions.tambahTelur ? '+Telur' : ''}</p>
                                            </div>
                                            <p className="font-bold text-[#FF6B35] text-sm">Rp {item.itemTotal.toLocaleString('id-ID')}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-center">
                                    <span className="font-bold text-[#1E1E1E]">Total Pembayaran:</span>
                                    <span className="text-xl font-bold text-[#FF6B35]">Rp {cartTotal.toLocaleString('id-ID')}</span>
                                </div>
                                <button 
                                    onClick={handleCartCheckoutClick} 
                                    className="w-full bg-[#1E1E1E] text-white py-3.5 rounded-xl font-bold hover:bg-[#FF6B35] transition-all flex justify-center items-center gap-2 shadow-lg"
                                >
                                    Lanjutkan ke Pembayaran
                                    <ArrowRight size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL BARU: INPUT WHATSAPP SEBELUM QRIS */}
            {showWaModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                        
                        <button 
                            onClick={() => !isProcessing && setShowWaModal(false)} 
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full bg-gray-50"
                            disabled={isProcessing}
                        >
                            <X size={18} />
                        </button>

                        <div className="text-center mb-6 mt-2">
                            <div className="bg-green-100 text-green-600 p-3 rounded-2xl w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                <Phone size={24} />
                            </div>
                            <h3 className="font-bold text-xl text-[#1E1E1E]">Notifikasi WhatsApp</h3>
                            <p className="text-sm text-gray-500 mt-1 px-4">
                                Masukkan nomor WA aktifmu untuk menerima info live status & struk pesanan Nyam.Aw.
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
                                        className="w-full pl-14 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all disabled:opacity-60"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center border border-gray-100">
                                <span className="text-sm font-bold text-gray-500">Total Bayar</span>
                                <span className="text-xl font-black text-[#FF6B35]">
                                    Rp {cartTotal.toLocaleString('id-ID')}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-[#1E1E1E] text-white font-bold py-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
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