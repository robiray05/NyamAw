import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-[#FCF9F2] font-body flex text-[#223322]">
            {/* LEFT SIDE: Branding (Warna Nyam Green) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#80AA49] to-[#438240] overflow-hidden items-center justify-center p-12">
                {/* Hiasan Blobs */}
                <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-white/20 rounded-full blur-[60px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#F4A236]/40 rounded-full blur-[60px]"></div>

                <motion.div 
                    initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
                    className="relative z-10 text-white max-w-md"
                >
                    {/* Menggunakan Logo Nyam Aw Putih */}
                    <Link href="/">
                        <img 
                            src="/images/logo-nyamaw.png" 
                            alt="Logo Nyam.Aw" 
                            className="h-20 w-auto mb-8 brightness-0 invert drop-shadow-md hover:scale-105 transition-transform"
                        />
                    </Link>
                    <h1 className="text-5xl font-heading font-extrabold leading-tight mb-4 text-white">
                        Pesan makanan kampus lebih mudah.
                    </h1>
                    <p className="text-lg text-white/90">
                        Gabung sekarang dan nikmati sistem pemesanan modern dengan bahan masakan yang selalu fresh.
                    </p>
                </motion.div>
            </div>

            {/* RIGHT SIDE: Auth Form Container */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
                {/* Hiasan Blob Hijau Tipis */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#438240]/10 rounded-full blur-[80px] lg:hidden -z-10"></div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-gray-200/50"
                >
                    <div className="mb-8 text-center lg:text-left">
                        {/* Munculkan logo di versi mobile saja */}
                        <div className="lg:hidden flex justify-center mb-6">
                            <img src="/images/logo-nyamaw.png" alt="Logo" className="h-16" />
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-[#223322] mb-2">{title}</h2>
                        <p className="text-[#597359] text-sm">{subtitle || 'Selamat datang kembali di Nyam.Aw'}</p>
                    </div>

                    {children}
                    
                </motion.div>
            </div>
        </div>
    );
}