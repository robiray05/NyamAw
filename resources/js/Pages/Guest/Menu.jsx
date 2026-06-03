import MainLayout from '@/Layouts/MainLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MenuCard from '@/Components/MenuCard';
import { X, ShoppingCart, QrCode } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Menu({ menus }) {
    // Pengaman: Beri nilai default {} jika flash atau auth belum ada
    const { auth = {}, flash = {} } = usePage().props;
    const user = auth?.user; 

    const [cart, setCart] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [showCartModal, setShowCartModal] = useState(false);
    const [showQrisModal, setShowQrisModal] = useState(false);
    
    const [customOptions, setCustomOptions] = useState({ pedas: 0, tambahAyam: false, tambahTelur: false });
    const [qty, setQty] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // 🔥 JURUS AMPUH: Deteksi otomatis format data dari Laravel (Array biasa atau Pagination)
    const displayMenus = Array.isArray(menus) ? menus : (menus?.data || []);
    
    const cartTotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);

    useEffect(() => {
        if (flash?.success && flash?.qris_reference) {
            setShowCartModal(false);
            setCart([]);
            setShowQrisModal(true);
        }
    }, [flash]);

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

    const handleCheckout = () => {
        if (!user) {
            Swal.fire('Akses Ditolak', 'Silakan login terlebih dahulu menggunakan email institusi untuk memesan.', 'warning');
            return;
        }

        setIsProcessing(true);
        router.post('/checkout', {
            cart: cart,
            total_price: cartTotal
        }, {
            onFinish: () => setIsProcessing(false)
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

            {/* Modal Tambah ke Keranjang */}
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
                                    onClick={handleCheckout} 
                                    disabled={isProcessing}
                                    className="w-full bg-[#1E1E1E] text-white py-3.5 rounded-xl font-bold hover:bg-[#FF6B35] transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                                >
                                    {isProcessing ? 'Memproses...' : 'Checkout Sekarang'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Simulasi QRIS */}
            {showQrisModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-8 text-center relative">
                        <button onClick={() => setShowQrisModal(false)} className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                            <X size={20} />
                        </button>
                        <div className="w-16 h-16 bg-[#2EC4B6]/10 text-[#2EC4B6] rounded-full flex items-center justify-center mx-auto mb-4">
                            <QrCode size={32} />
                        </div>
                        <h3 className="text-2xl font-bold font-heading mb-2 text-[#1E1E1E]">Scan QRIS</h3>
                        <p className="text-gray-500 text-sm mb-6">Selesaikan pembayaran untuk pesanan <br/><span className="font-bold text-[#1E1E1E]">{flash?.qris_reference}</span></p>
                        
                        <div className="bg-gray-100 w-48 h-48 mx-auto rounded-xl flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
                            <span className="text-gray-400 font-bold text-sm">SIMULASI QR CODE</span>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <p className="text-xs text-gray-500 mb-1">Total Tagihan</p>
                            <p className="text-2xl font-bold text-[#FF6B35]">Rp {flash?.total_price?.toLocaleString('id-ID')}</p>
                        </div>
                        
                        <button 
                            onClick={() => {
                                setShowQrisModal(false);
                                Swal.fire('Terkonfirmasi', 'Admin akan memverifikasi pembayaran Anda.', 'success');
                            }} 
                            className="w-full bg-[#2EC4B6] text-white py-3.5 rounded-xl font-bold hover:bg-teal-500 transition-all shadow-lg shadow-teal-500/30"
                        >
                            Saya Sudah Bayar
                        </button>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}