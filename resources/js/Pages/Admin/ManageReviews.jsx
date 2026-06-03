import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Star, Trash2, MessageSquare, Reply, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

export default function ManageReviews({ reviews = [] }) {
    const [selectedReview, setSelectedReview] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Ulasan?',
            text: "Ulasan ini akan dihapus permanen.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/reviews/${id}`, {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire('Dihapus!', 'Ulasan berhasil dihapus.', 'success')
                });
            }
        });
    };

    const openReplyModal = (review) => {
        setSelectedReview(review);
        setReplyText(review.admin_reply || '');
    };

    const closeReplyModal = () => {
        setSelectedReview(null);
        setReplyText('');
    };

    const handleSendReply = () => {
        if (!replyText.trim()) return;
        setIsProcessing(true);
        
        // MENGGUNAKAN router.post AGAR LEBIH AMAN DARI ERROR 404
        router.post(`/admin/reviews/${selectedReview.id}/reply`, {
            admin_reply: replyText
        }, {
            onSuccess: () => {
                closeReplyModal();
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Balasan ulasan terkirim.',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            },
            onError: (errors) => {
                console.error("Error server:", errors);
                Swal.fire('Gagal', 'Terjadi kesalahan saat membalas. Cek console.', 'error');
            },
            onFinish: () => {
                // Baris ini MENJAMIN tombol kembali normal (tidak nyangkut "Menyimpan...")
                setIsProcessing(false);
            }
        });
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5 items-center">
                <Star size={14} className="text-[#F4A236] fill-[#F4A236]" />
                <span className="font-bold text-[#223322] ml-1">{rating}</span>
            </div>
        );
    };

    return (
        <AdminLayout>
            <Head title="Kelola Ulasan - Admin" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1E1E1E] mb-2">Kelola Ulasan Menu</h1>
                <p className="text-gray-500">Pantau dan balas feedback pelanggan (seperti fitur Shopee).</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-600">
                                <th className="p-5">Pelanggan</th>
                                <th className="p-5">Menu Diulas</th>
                                <th className="p-5">Rating & Komentar</th>
                                <th className="p-5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm text-gray-800">
                            {reviews.length > 0 ? reviews.map((review) => (
                                <tr key={review.id} className="hover:bg-gray-50/50">
                                    <td className="p-5 align-top">
                                        <p className="font-bold text-[#1E1E1E]">{review.user?.name || 'User Terhapus'}</p>
                                        <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('id-ID')}</p>
                                    </td>
                                    <td className="p-5 font-bold text-[#438240] align-top">{review.menu?.name || 'Menu Terhapus'}</td>
                                    <td className="p-5">
                                        <div className="mb-2">{renderStars(review.rating)}</div>
                                        <p className="italic text-gray-600 mb-2">"{review.comment}"</p>
                                        
                                        {review.admin_reply && (
                                            <div className="bg-green-50 border border-green-100 p-3 rounded-xl mt-2">
                                                <p className="text-xs font-bold text-green-700 mb-1">Balasan Anda:</p>
                                                <p className="text-sm text-green-800">"{review.admin_reply}"</p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-5 text-center align-top">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => openReplyModal(review)}
                                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1 font-bold text-xs"
                                            >
                                                <Reply size={16} /> {review.admin_reply ? 'Edit Balasan' : 'Balas'}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(review.id)}
                                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-16 text-gray-500">
                                        <MessageSquare className="mx-auto text-gray-300 mb-3" size={32} />
                                        Belum ada ulasan yang masuk.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL BALAS ULASAN */}
            <AnimatePresence>
                {selectedReview && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1E1E1E]/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative"
                        >
                            <button onClick={closeReplyModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                                <X size={20} />
                            </button>
                            <h2 className="text-xl font-bold text-[#1E1E1E] mb-4 flex items-center gap-2">
                                <Reply className="text-blue-500" /> Balas Ulasan
                            </h2>
                            
                            <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                                <div className="flex justify-between mb-1">
                                    <p className="text-xs font-bold text-gray-500">{selectedReview.user?.name}</p>
                                    <span className="text-xs font-bold text-[#F4A236]">⭐ {selectedReview.rating}/5</span>
                                </div>
                                <p className="text-sm text-gray-700 italic">"{selectedReview.comment}"</p>
                            </div>

                            <textarea
                                rows="4"
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 resize-none"
                                placeholder="Ketik balasan untuk pelanggan ini..."
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                            ></textarea>

                            <button
                                onClick={handleSendReply}
                                disabled={isProcessing || !replyText.trim()}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-colors"
                            >
                                <Check size={18} /> {isProcessing ? 'Menyimpan...' : 'Kirim Balasan'}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}