import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Clock, CheckCircle, ChefHat, Star, X, ShoppingBag, Receipt, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function History({ orders = [] }) {
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [viewOrder, setViewOrder] = useState(null); 
    const [hoveredStar, setHoveredStar] = useState(0);
    
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    const [complaintReason, setComplaintReason] = useState('');
    const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        menu_id: '',
        order_id: '',
        rating: 0,
        comment: '',
    });

    const openReviewModal = (menu, orderId) => {
        if (!menu) return;
        setSelectedMenu(menu);
        setData({
            menu_id: menu.id,
            order_id: orderId,
            rating: 0,
            comment: ''
        });
    };

    const closeReviewModal = () => {
        setSelectedMenu(null);
        reset();
        setHoveredStar(0);
    };

    const submitReview = (e) => {
        e.preventDefault();
        post('/reviews', {
            preserveScroll: true,
            onSuccess: () => closeReviewModal(),
        });
    };

    const handleSendComplaint = (e, orderId) => {
        e.preventDefault();
        e.stopPropagation();

        if (!complaintReason.trim()) return;
        
        setIsSubmittingComplaint(true);
        router.post('/complaints', {
            order_id: orderId,
            reason: complaintReason
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setComplaintReason('');
                setShowComplaintForm(false);
                setViewOrder(null);
                setIsSubmittingComplaint(false);
                alert("Komplain kamu berhasil terkirim! Admin akan segera memeriksa pesananmu.");
            },
            onError: (errors) => {
                setIsSubmittingComplaint(false);
                console.error("Error dari Laravel:", errors);
                alert("Gagal mengirim! Sepertinya route atau controller backend belum siap. Cek console untuk detailnya.");
            }
        });
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'selesai': return <CheckCircle className="text-[#438240]" size={20} />;
            case 'dimasak': return <ChefHat className="text-[#F4A236]" size={20} />;
            default: return <Clock className="text-gray-400" size={20} />;
        }
    };

    return (
        <MainLayout>
            <Head title="Riwayat Pesanan" />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <h1 className="text-3xl font-heading font-extrabold text-[#223322]">Riwayat Pesanan</h1>
                    <p className="text-[#597359]">Pantau status makananmu. Klik pada kotak pesanan untuk melihat rincian nota & ajukan komplain.</p>
                </div>

                {orders && orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const firstItemMenu = order.items?.[0]?.menu;
                            const currentMenu = firstItemMenu || order.menu;
                            
                            const orderTitle = currentMenu?.name 
                                ? (order.items?.length > 1 ? `${currentMenu.name} (+${order.items.length - 1} lainnya)` : currentMenu.name)
                                : 'Pesanan Diproses';
                            
                            return (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    key={order.id} 
                                    onClick={() => {
                                        setViewOrder(order);
                                        setShowComplaintForm(false);
                                    }}
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 cursor-pointer hover:border-[#438240] hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-center gap-6 w-full">
                                        <div className="w-20 h-20 bg-[#FCF9F2] rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <img 
                                                src={currentMenu?.image || '/images/food-hero.png'} 
                                                alt={orderTitle} 
                                                className="w-full h-full object-cover" 
                                                onError={(e) => { e.target.src = '/images/food-hero.png'; }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg text-[#223322]">
                                                    {orderTitle}
                                                </h3>
                                                {order.complaint && (
                                                    <span className="text-xs bg-red-50 text-red-500 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <AlertTriangle size={12} /> Dikomplain
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-[#597359] mb-2">
                                                {order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(order.status)}
                                                <span className="text-sm font-semibold capitalize text-[#223322]">
                                                    {order.status ? order.status.replace('_', ' ') : 'Menunggu'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto text-right flex flex-col items-end gap-3">
                                        <span className="font-extrabold text-xl text-[#438240]">
                                            Rp {order.total_price ? Number(order.total_price).toLocaleString('id-ID') : '0'}
                                        </span>
                                        
                                        {order.status?.toLowerCase() === 'selesai' && currentMenu && !order.review && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    openReviewModal(currentMenu, order.id);
                                                }}
                                                className="bg-[#F4A236] hover:bg-[#e09331] text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors w-full md:w-auto shadow-sm"
                                            >
                                                ⭐ Beri Ulasan
                                            </button>
                                        )}

                                        {order.status?.toLowerCase() === 'selesai' && order.review && (
                                            <div className="flex items-center gap-1 text-[#F4A236]">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={16} fill={i < order.review.rating ? "currentColor" : "none"} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-50">
                        <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-[#223322] mb-2">Belum ada pesanan</h3>
                        <Link href="/menu" className="mt-4 inline-block bg-[#438240] text-white px-6 py-2 rounded-full text-sm font-bold">Pesan Sekarang</Link>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {viewOrder && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#223322]/40 backdrop-blur-sm" onClick={() => setViewOrder(null)}>
                        <motion.div 
                            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()} 
                            className="bg-white w-full max-w-lg rounded-[2rem] p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col overflow-y-auto"
                        >
                            <button onClick={() => setViewOrder(null)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-full p-2 z-10">
                                <X size={20} />
                            </button>
                            
                            <h2 className="text-2xl font-bold text-[#223322] mb-1 flex items-center gap-2">
                                <Receipt size={24} className="text-[#438240]" /> Detail Rincian Nota
                            </h2>
                            <p className="text-[#597359] text-sm mb-6 pb-4 border-b border-gray-100">
                                {new Date(viewOrder.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>

                            <div className="space-y-4 mb-4">
                                {viewOrder.items && viewOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 border border-gray-100 rounded-2xl bg-[#FCF9F2] shadow-sm">
                                        <div className="w-16 h-16 bg-white rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center">
                                            <img 
                                                src={item.menu?.image || '/images/food-hero.png'} 
                                                alt={item.menu?.name} 
                                                className="w-full h-full object-cover" 
                                                onError={(e) => { e.target.src = '/images/food-hero.png'; }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[#223322] mb-1">
                                                {item.menu?.name || 'Menu Tidak Ditemukan'} <span className="text-sm font-normal text-gray-500">x{item.quantity}</span>
                                            </h4>
                                            
                                            {item.custom_notes && (
                                                <p className="text-xs text-[#597359] mb-2 font-medium bg-white px-2 py-1 rounded inline-block">
                                                    {item.custom_notes}
                                                </p>
                                            )}
                                            
                                            <p className="font-extrabold text-[#438240]">Rp {Number(item.subtotal).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-sm space-y-2 py-3 border-t border-b border-gray-50 mb-4">
                                <div className="flex justify-between"><span className="text-gray-500">Status Pembayaran:</span><span className={`font-bold capitalize ${viewOrder.payment_status === 'paid' || viewOrder.payment_status === 'success' ? 'text-[#438240]' : 'text-[#F4A236]'}`}>{viewOrder.payment_status || 'Pending'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Status Dapur:</span><span className="font-bold text-[#223322] capitalize">{viewOrder.status?.replace('_', ' ')}</span></div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-4">
                                {viewOrder.complaint ? (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                                        <h5 className="font-bold text-red-700 text-sm mb-1 flex items-center gap-1.5">
                                            <AlertTriangle size={16} /> Riwayat Komplain Kamu:
                                        </h5>
                                        <p className="text-sm text-red-600 italic">"{viewOrder.complaint.reason}"</p>
                                        
                                        {viewOrder.complaint.admin_reply && (
                                            <div className="mt-3 bg-white p-3 rounded-xl border border-green-200 shadow-sm">
                                                <h6 className="text-xs font-bold text-green-700 mb-1">Balasan Admin:</h6>
                                                <p className="text-sm text-gray-800">"{viewOrder.complaint.admin_reply}"</p>
                                            </div>
                                        )}
                                        <span className={`text-[11px] font-bold mt-3 inline-block px-2 py-0.5 rounded-full ${viewOrder.complaint.status === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            Status: {viewOrder.complaint.status === 'selesai' ? 'Selesai Ditangani' : 'Menunggu Respon Admin'}
                                        </span>
                                    </div>
                                ) : (
                                    viewOrder.status?.toLowerCase() === 'selesai' && (
                                        <div>
                                            <button onClick={() => setShowComplaintForm(!showComplaintForm)} className="w-full flex items-center justify-between text-sm font-bold text-red-600 hover:text-red-700 transition-colors focus:outline-none">
                                                <span className="flex items-center gap-2"><AlertTriangle size={18} /> Masalah makanan? Ajukan Komplain</span>
                                                {showComplaintForm ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                            {showComplaintForm && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-gray-200/60">
                                                    <textarea rows="3" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none mb-3" placeholder="Ketik keluhanmu (misal: porsi sedikit, dingin)..." value={complaintReason} onChange={e => setComplaintReason(e.target.value)}></textarea>
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => handleSendComplaint(e, viewOrder.id)} 
                                                        disabled={isSubmittingComplaint || !complaintReason.trim()} 
                                                        className="w-full bg-red-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-red-600 disabled:opacity-50 transition-colors shadow-sm"
                                                    >
                                                        {isSubmittingComplaint ? 'Mengirim...' : 'Kirim Komplain'}
                                                    </button>
                                                </motion.div>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="text-right pt-2 border-t border-dashed border-gray-100">
                                <span className="text-sm text-gray-500 block mb-1">Total Pembayaran</span>
                                <span className="font-extrabold text-2xl text-[#438240]">
                                    Rp {Number(viewOrder.total_price).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedMenu && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#223322]/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative"
                        >
                            <button onClick={closeReviewModal} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors">
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold text-[#223322] mb-2">Beri Ulasan</h2>
                            <p className="text-sm text-[#597359] mb-6 pb-4 border-b border-gray-100">
                                Berikan ulasan untuk <strong>{selectedMenu.name}</strong>
                            </p>
                            <form onSubmit={submitReview}>
                                <div className="flex justify-center gap-2 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button" key={star}
                                            onClick={() => setData('rating', star)}
                                            onMouseEnter={() => setHoveredStar(star)}
                                            onMouseLeave={() => setHoveredStar(0)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star size={40} className={star <= (hoveredStar || data.rating) ? "text-[#F4A236] fill-[#F4A236]" : "text-gray-200"} />
                                        </button>
                                    ))}
                                </div>
                                <div className="mb-6">
                                    <textarea rows="4" className="w-full bg-[#FCF9F2] border-none rounded-2xl p-4 text-[#223322] focus:ring-2 focus:ring-[#438240] transition-all resize-none" placeholder="Tulis pendapatmu mengenai makanan ini..." value={data.comment} onChange={e => setData('comment', e.target.value)}></textarea>
                                </div>
                                <button type="submit" disabled={processing || data.rating === 0} className="w-full bg-[#438240] text-white py-4 rounded-full font-bold hover:bg-[#366B33] transition-colors shadow-lg">Kirim Ulasan</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </MainLayout>
    );
}   