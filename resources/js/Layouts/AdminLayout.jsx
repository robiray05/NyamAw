import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Utensils, ShoppingBag, Star, AlertTriangle, FileText, LogOut, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }) {
    const { url, props } = usePage();
    const user = props.auth?.user;

    // 1. STATE UNTUK MOBILE MENU
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 2. TANGKAP VARIABEL YANG TEPAT DARI HANDLE INERTIA REQUEST
    const pendingOrdersCount = props.pending_orders_count || 0;
    const pendingComplaintsCount = props.pending_complaints_count || 0;

    const isActive = (path) => url.startsWith(path);

    // 3. MASUKKAN BADGE KE MASING-MASING MENU
    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Kelola Menu', href: '/admin/menus', icon: Utensils },
        { name: 'Pesanan', href: '/admin/orders', icon: ShoppingBag, badge: pendingOrdersCount },
        { name: 'Review', href: '/admin/reviews', icon: Star }, 
        { name: 'Komplain', href: '/admin/complaints', icon: AlertTriangle, badge: pendingComplaintsCount },
        { name: 'Laporan', href: '/admin/reports', icon: FileText },
    ];

    return (
        <div className="min-h-screen bg-[#FCF9F2] flex font-sans text-[#223322]">
            
            {/* OVERLAY HITAM UNTUK MOBILE (Klik di luar sidebar untuk menutup) */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* SIDEBAR (Responsive: Sembunyi di Mobile, Muncul saat diklik) */}
            <aside 
                className={`w-64 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transform transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0`}
            >
                {/* AREA LOGO NYAM.AW & TOMBOL CLOSE MOBILE */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-gray-50">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                        <img 
                            src="/images/logo-nyamaw.png" 
                            alt="Logo Nyam.Aw" 
                            className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => { 
                                e.target.src = 'https://ui-avatars.com/api/?name=Nyam+Aw&background=438240&color=fff&rounded=xl&bold=true'; 
                            }}
                        />
                        <span className="text-2xl font-extrabold text-[#223322] tracking-tight">Nyam.Aw</span>
                    </Link>
                    
                    {/* Tombol Tutup (Hanya di Mobile) */}
                    <button 
                        className="md:hidden p-2 text-gray-500 hover:text-red-500 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* LINK NAVIGASI */}
                <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)} // Tutup menu setelah klik di HP
                                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                                    active 
                                    ? 'bg-[#438240] text-white shadow-lg shadow-[#438240]/30 translate-x-1' 
                                    : 'text-[#597359] hover:bg-[#438240]/10 hover:text-[#438240] hover:translate-x-1'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={20} className={active ? "text-[#F4A236]" : "text-gray-400"} />
                                    {item.name}
                                </div>
                                
                                {/* MUNCULKAN BADGE JIKA ANGKA LEBIH DARI 0 */}
                                {item.badge > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse shadow-sm shadow-red-500/50">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* TOMBOL LOGOUT */}
                <div className="p-4 border-t border-gray-50">
                    <Link 
                        href="/logout" 
                        method="post" 
                        as="button"
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl transition-all font-bold text-sm text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut size={20} />
                        Logout
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen w-full transition-all duration-300">
                <header className="h-20 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
                    
                    <div className="flex items-center gap-4">
                        {/* TOMBOL HAMBURGER MOBILE */}
                        <button 
                            className="md:hidden p-2 -ml-2 text-[#223322] hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg md:text-xl font-bold text-[#223322] truncate">Admin Workspace</h2>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-white py-1.5 pl-1.5 pr-2 md:pr-4 rounded-full border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                            <div className="w-9 h-9 rounded-full bg-[#438240] text-white flex items-center justify-center font-bold text-sm">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-bold text-[#223322] leading-tight">{user?.name || 'Admin Nyam.Aw'}</p>
                                <p className="text-[10px] font-semibold text-[#F4A236] uppercase tracking-wider">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* BUNGKUS KONTEN DENGAN OVERFLOW UNTUK TABEL */}
                <div className="p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}