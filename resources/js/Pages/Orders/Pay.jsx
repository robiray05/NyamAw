import { Head, router } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect } from 'react';

export default function Pay({ order }) {
    
    // Trik sihir: Halaman mengecek status terbaru setiap 5 detik tanpa refresh kasar
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['order'] });
        }, 5000); 

        return () => clearInterval(interval);
    }, []);

    // Jika Webhook Pinggy tadi bekerja dan status berubah jadi success, lempar ke History!
    if (order.payment_status === 'success') {
        router.visit(route('orders.history')); // Pastikan rute history pesananmu benar namanya
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFBF7] p-4">
            <Head title="Bayar Pesanan - Nyam.Aw" />
            
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center border border-gray-100">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#1E1E1E]">Pembayaran QRIS</h2>
                    <p className="text-sm text-gray-500 mt-1">Selesaikan pesanan #{String(order.id).padStart(4, '0')}</p>
                </div>
                
                {/* Ini tempat QR Code nya di-render otomatis dari DOKU */}
                <div className="bg-white p-4 rounded-2xl flex justify-center mb-6 shadow-inner ring-1 ring-gray-100">
                    <QRCodeSVG 
                        value={order.qris_reference} 
                        size={220} 
                        level="H" 
                        includeMargin={true}
                    />
                </div>
                
                <div className="mb-6">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Total Tagihan</p>
                    <p className="text-3xl font-bold text-[#FF6B35]">
                        Rp {Number(order.total_price).toLocaleString('id-ID')}
                    </p>
                </div>

                <div className="bg-[#FFB627]/10 rounded-xl p-4 flex items-center justify-center gap-3">
                    <div className="w-3 h-3 bg-[#FFB627] rounded-full animate-ping"></div>
                    <p className="text-sm font-bold text-[#FFB627]">Menunggu pembayaran...</p>
                </div>
            </div>
        </div>
    );
}