import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, CheckCircle, Clock, X, Receipt } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ManageOrders({ orders }) {
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleStatusChange = (orderId, field, value) => {
        router.put(route('admin.orders.update_status', orderId), {
            [field]: value,
            // Kita perlu mengirim kedua field karena validasi controller membutuhkan keduanya
            status: field === 'status' ? value : orders.find(o => o.id === orderId).status,
            payment_status: field === 'payment_status' ? value : orders.find(o => o.id === orderId).payment_status
        }, {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    title: 'Diperbarui!',
                    text: 'Status pesanan berhasil diubah.',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'menunggu_pembayaran': return 'bg-red-100 text-red-600';
            case 'diproses': return 'bg-[#FFB627]/20 text-[#FFB627]';
            case 'selesai': return 'bg-green-100 text-green-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Pesanan" />
            
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#1E1E1E] mb-1">Kelola Pesanan Masuk</h2>
                <p className="text-gray-500 text-sm">Pantau dan proses pesanan dari pelanggan.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                                <th className="p-4 font-semibold">ID Pesanan</th>
                                <th className="p-4 font-semibold">Pelanggan</th>
                                <th className="p-4 font-semibold">Total Harga</th>
                                <th className="p-4 font-semibold">Pembayaran (QRIS)</th>
                                <th className="p-4 font-semibold">Status Dapur</th>
                                <th className="p-4 font-semibold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-bold text-[#1E1E1E]">
                                        #{String(order.id).padStart(4, '0')}
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-[#1E1E1E]">{order.user.name}</p>
                                        <p className="text-xs text-gray-500">{order.user.email}</p>
                                    </td>
                                    <td className="p-4 font-bold text-[#FF6B35]">
                                        Rp {Number(order.total_price).toLocaleString('id-ID')}
                                    </td>
                                    <td className="p-4">
                                        <select 
                                            value={order.payment_status}
                                            onChange={(e) => handleStatusChange(order.id, 'payment_status', e.target.value)}
                                            className="text-xs font-bold rounded-lg px-2 py-1 border-gray-200 focus:ring-[#FF6B35]"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="success">Success</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <select 
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, 'status', e.target.value)}
                                            className={`text-xs font-bold rounded-lg px-2 py-1 outline-none border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#FF6B35] ${getStatusColor(order.status)}`}
                                        >
                                            {/* OPSI YANG SUDAH DIPANGKAS MENJADI 3 SAJA */}
                                            <option value="menunggu_pembayaran">Menunggu Pembayaran</option>
                                            <option value="diproses">Diproses</option>
                                            <option value="selesai">Selesai</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-[#1E1E1E] hover:text-white transition-colors"
                                            title="Lihat Detail Pesanan"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-500">Belum ada pesanan masuk.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Detail Pesanan (Sama seperti sebelumnya) */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#FF6B35]/10 p-2 rounded-xl text-[#FF6B35]">
                                    <Receipt size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-[#1E1E1E]">Detail Pesanan</h3>
                                    <p className="text-xs font-bold text-gray-500">#{String(selectedOrder.id).padStart(4, '0')}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full bg-white shadow-sm">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Informasi Pelanggan</h4>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <p className="font-bold text-[#1E1E1E]">{selectedOrder.user.name}</p>
                                    <p className="text-sm text-gray-500">{selectedOrder.user.email}</p>
                                    <p className="text-xs text-gray-400 mt-2">Dipesan pada: {new Date(selectedOrder.created_at).toLocaleString('id-ID')}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Daftar Menu</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0">
                                            <div>
                                                <p className="font-bold text-sm text-[#1E1E1E]">
                                                    {item.quantity}x {item.menu.name}
                                                </p>
                                                {item.custom_notes && (
                                                    <p className="text-xs text-[#FF6B35] mt-1 bg-[#FF6B35]/10 inline-block px-2 py-0.5 rounded-md">
                                                        Catatan: {item.custom_notes}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="font-bold text-sm text-[#1E1E1E]">
                                                Rp {Number(item.subtotal).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-gray-500">Total Pembayaran</span>
                            <span className="text-2xl font-bold text-[#FF6B35]">
                                Rp {Number(selectedOrder.total_price).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}