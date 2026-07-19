import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, Check, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index({ complaints = [] }) {
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const openReplyModal = (comp) => {
        setSelectedComplaint(comp);
        setReplyText('');
    };

    const closeReplyModal = () => {
        setSelectedComplaint(null);
        setReplyText('');
    };

    const handleResolve = (e) => {
        e.preventDefault(); // 1. Mencegah layar reload paksa

        if (!replyText.trim()) return;

        setIsProcessing(true);
        router.put(`/admin/complaints/${selectedComplaint.id}/status`, {
            admin_reply: replyText,
            status: 'selesai' // 2. Pastikan mengirim status selesai
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                closeReplyModal();
                setIsProcessing(false);
                alert("Balasan terkirim! Komplain telah diselesaikan.");
            },
            onError: (errors) => {
                setIsProcessing(false);
                console.error("Error dari Laravel:", errors);
                alert("Gagal mengirim! Silakan cek tulisan merah di Console.");
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Kelola Komplain - Admin" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1E1E1E] mb-2">Panel Pengaduan & Komplain</h1>
                <p className="text-gray-500">Selesaikan keluhan dan berikan tanggapan kepada mahasiswa.</p>
            </div>

            {complaints.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-600">
                                    <th className="p-5">Mahasiswa</th>
                                    <th className="p-5">Menu Dipesan</th>
                                    <th className="p-5">Alasan Komplain</th>
                                    <th className="p-5">Status</th>
                                    <th className="p-5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm text-gray-800">
                                {complaints.map((comp) => (
                                    <tr key={comp.id} className="hover:bg-gray-50/50">
                                        <td className="p-5 font-bold">{comp.user?.name}</td>
                                        <td className="p-5 text-[#FF6B35] font-semibold">
                                            {comp.order?.items?.[0]?.menu?.name || 'Pesanan Nyam.Aw'}
                                        </td>
                                        <td className="p-5">
                                            <p className="text-gray-600 italic mb-1">"{comp.reason}"</p>
                                            {comp.admin_reply && (
                                                <div className="text-xs bg-green-50 text-green-700 p-2 rounded mt-2 border border-green-100">
                                                    <strong>Balasan:</strong> {comp.admin_reply}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${comp.status === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600 animate-pulse'}`}>
                                                {comp.status === 'selesai' ? 'Selesai' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            {comp.status === 'pending' && (
                                                <button
                                                    onClick={() => openReplyModal(comp)}
                                                    className="p-2 bg-[#FF6B35]/10 text-[#FF6B35] rounded-xl hover:bg-[#FF6B35]/20 transition-colors inline-flex items-center gap-1 font-bold text-xs"
                                                >
                                                    <MessageCircle size={14} /> Balas & Selesai
                                                </button>
                                            )}
                                            {comp.status === 'selesai' && <span className="text-gray-400 text-xs">Telah ditangani</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <AlertTriangle className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold mb-1">Aman Lancar Jaya!</h3>
                    <p className="text-gray-400">Belum ada komplain atau pengaduan masuk hari ini.</p>
                </div>
            )}

            {/* MODAL BALAS KOMPLAIN */}
            <AnimatePresence>
                {selectedComplaint && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1E1E1E]/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative"
                        >
                            <button onClick={closeReplyModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                                <X size={20} />
                            </button>
                            <h2 className="text-xl font-bold text-[#1E1E1E] mb-4">Balas Komplain</h2>
                            
                            <div className="bg-red-50 p-4 rounded-xl mb-4 border border-red-100">
                                <p className="text-xs font-bold text-red-500 mb-1">Keluhan {selectedComplaint.user?.name}:</p>
                                <p className="text-sm text-red-700 italic">"{selectedComplaint.reason}"</p>
                            </div>

                            <textarea
                                rows="4"
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none mb-4 resize-none"
                                placeholder="Ketik balasan admin di sini..."
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                            ></textarea>

                            <button
                                type="button"
                                onClick={handleResolve}
                                disabled={isProcessing || !replyText.trim()}
                                className="w-full bg-[#FF6B35] text-white py-3 rounded-xl font-bold hover:bg-[#e85b29] disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                <Check size={18} /> {isProcessing ? 'Memproses...' : 'Kirim Balasan & Tandai Selesai'}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}