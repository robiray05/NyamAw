import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { FileSpreadsheet, TrendingUp, ShoppingBag, Download, DollarSign, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ManageReports({ orders = [], totalRevenue = 0, totalOrders = 0, totalCost = 0, netProfit = 0 }) {
    
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    return (
        <AdminLayout>
            <Head title="Laporan Penjualan - Admin" />

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E1E1E] mb-2 flex items-center gap-3">
                        <FileSpreadsheet className="text-[#438240]" size={32} />
                        Laporan Penjualan
                    </h1>
                    <p className="text-gray-500">Pantau performa pendapatan Nyam.Aw dan unduh rekap datanya.</p>
                </div>

                <a 
                    href="/admin/reports/export" 
                    className="bg-[#438240] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#366B33] transition-colors shadow-lg shadow-[#438240]/30 flex items-center justify-center gap-2"
                >
                    <Download size={20} />
                    Export ke Excel (.xlsx)
                </a>
            </div>

            {/* KARTU RINGKASAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-emerald-500 text-white p-3 rounded-2xl">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-sm font-bold text-emerald-800">Total Pendapatan</h3>
                    </div>
                    <p className="text-2xl font-extrabold text-[#223322]">{formatRupiah(totalRevenue)}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-red-50 rounded-3xl p-6 border border-red-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-red-500 text-white p-3 rounded-2xl">
                            <Wallet size={24} />
                        </div>
                        <h3 className="text-sm font-bold text-red-800">Total Modal (HPP)</h3>
                    </div>
                    <p className="text-2xl font-extrabold text-red-600">{formatRupiah(totalCost)}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#1E1E1E] rounded-3xl p-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-white/10 text-white p-3 rounded-2xl">
                            <DollarSign size={24} />
                        </div>
                        <h3 className="text-sm font-medium text-gray-400">Keuntungan Bersih</h3>
                    </div>
                    <p className="text-2xl font-extrabold text-white">{formatRupiah(netProfit)}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-[#F4A236]/10 text-[#F4A236] p-3 rounded-2xl">
                            <ShoppingBag size={24} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-500">Total Transaksi</h3>
                    </div>
                    <p className="text-2xl font-extrabold text-[#223322]">{totalOrders} <span className="text-sm font-medium text-gray-400">Pesanan</span></p>
                </motion.div>
            </div>

            {/* TABEL PREVIEW LAPORAN */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-[#FCF9F2]">
                    <h3 className="font-bold text-[#223322] text-lg">Rincian Data Pesanan</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-sm font-bold text-gray-500">
                                <th className="p-5">ID & Waktu</th>
                                <th className="p-5">Pelanggan</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-right">Pendapatan</th>
                                <th className="p-5 text-right">Modal</th>
                                <th className="p-5 text-right">Profit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                            {orders.length > 0 ? orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50">
                                    <td className="p-5">
                                        <p className="font-bold text-[#438240]">#{String(order.id).padStart(4, '0')}</p>
                                        <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                                    </td>
                                    <td className="p-5 font-medium">{order.user?.name || 'Pelanggan'}</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                            order.status?.toLowerCase() === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {order.status || 'Diproses'}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right font-bold text-[#223322]">
                                        {formatRupiah(order.total_price)}
                                    </td>
                                    <td className="p-5 text-right font-bold text-red-500">
                                        {formatRupiah(order.total_modal || 0)}
                                    </td>
                                    <td className="p-5 text-right font-extrabold text-[#F4A236]">
                                        {formatRupiah(order.net_profit || 0)}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-gray-400">Belum ada data pesanan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}