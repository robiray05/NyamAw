import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { DollarSign, ShoppingBag, Clock, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ todayRevenue, todayOrders, pendingOrders, netProfit, weeklySales, recentOrders }) {
    
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    return (
        <AdminLayout>
            <Head title="Dashboard - Admin" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#1E1E1E] mb-2">Overview Kinerja</h1>
                <p className="text-gray-500">Pantau aktivitas pesanan dan pendapatan Nyam.Aw hari ini.</p>
            </div>

            {/* 4 KARTU STATISTIK ATAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-emerald-50 text-emerald-500 p-3 rounded-2xl">
                            <DollarSign size={24} />
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp size={12} /> Hari ini
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Pendapatan Hari Ini</p>
                    <h3 className="text-2xl font-extrabold text-[#223322]">{formatRupiah(todayRevenue)}</h3>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-orange-50 text-orange-500 p-3 rounded-2xl">
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Pesanan</p>
                    <h3 className="text-2xl font-extrabold text-[#223322]">{todayOrders} Pesanan</h3>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-yellow-50 text-yellow-500 p-3 rounded-2xl">
                            <Clock size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Menunggu Diproses</p>
                    <h3 className="text-2xl font-extrabold text-[#223322]">{pendingOrders} Antrean</h3>
                </div>

                <div className="bg-[#1E1E1E] rounded-3xl p-6 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-white/10 text-white p-3 rounded-2xl">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Keuntungan Bersih (Est.)</p>
                    <h3 className="text-2xl font-extrabold text-white">{formatRupiah(netProfit)}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* GRAFIK MINGGUAN */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-[#223322] mb-6">Grafik Penjualan Mingguan</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklySales}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#9CA3AF', fontSize: 12}}
                                    tickFormatter={(value) => `Rp${value / 1000}k`}
                                    dx={-10}
                                />
                                <Tooltip 
                                    formatter={(value) => formatRupiah(value)}
                                    contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="total" 
                                    stroke="#F4A236" 
                                    strokeWidth={4} 
                                    dot={{fill: '#F4A236', strokeWidth: 4, r: 4, stroke: '#fff'}}
                                    activeDot={{r: 8}}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* LIST PESANAN TERBARU */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-[#223322]">Pesanan Terbaru</h3>
                        <Link href="/admin/orders" className="text-sm font-bold text-[#F4A236] hover:text-[#e09331]">Lihat Semua</Link>
                    </div>

                    <div className="space-y-4">
                        {recentOrders.length > 0 ? recentOrders.map((order) => (
                            <div key={order.id} className="border border-gray-50 bg-gray-50/50 p-4 rounded-2xl flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-extrabold text-[#223322]">#{String(order.id).padStart(4, '0')}</span>
                                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${
                                        order.status === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                        {order.status || 'Baru'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-700">{order.user?.name || 'Pelanggan'}</p>
                                    <p className="text-xs text-gray-500">{order.menu?.name || 'Menu Nyam.Aw'}</p>
                                </div>
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                                    <span className="text-xs text-gray-400">Total</span>
                                    <span className="font-bold text-[#F4A236] text-sm">{formatRupiah(order.total_price)}</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-400 py-10 text-sm">Belum ada pesanan masuk.</p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}