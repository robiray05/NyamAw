import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChefHat, Heart, Sparkles, MapPin, UtensilsCrossed, Users } from 'lucide-react';

export default function About() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <MainLayout>
            <Head title="Tentang Kami - Nyam.Aw" />

            {/* HERO SECTION */}
            <section className="relative pt-20 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-[#438240]/5 rounded-[3rem] -z-10 mx-4 sm:mx-8 mt-10"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-[#223322] mb-6">
                            Cerita di Balik <span className="text-[#438240]">Nyam.</span><span className="text-[#F4A236]">Aw</span>
                        </h1>
                        <p className="text-lg text-[#597359] max-w-2xl mx-auto leading-relaxed">
                            Berawal dari sebuah ide sederhana: memastikan siapa saja bisa menikmati masakan rumahan yang hangat, lezat, dan kaya rempah tanpa harus repot ke dapur. Kami percaya bahwa makanan enak adalah hak segala perut!
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* MENGAPA NYAM.AW SECTION */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div 
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300"
                    >
                        <div className="w-16 h-16 mx-auto bg-[#F4A236]/10 text-[#F4A236] rounded-2xl flex items-center justify-center mb-6">
                            <ChefHat size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-[#223322] mb-3">Resep Rumahan</h3>
                        <p className="text-[#597359]">
                            Setiap porsi dimasak dengan bumbu rahasia otentik. Mengobati rasa rindu akan masakan ibu yang hangat dan penuh cinta di setiap suapannya.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: 0.2 }}
                        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300"
                    >
                        <div className="w-16 h-16 mx-auto bg-[#438240]/10 text-[#438240] rounded-2xl flex items-center justify-center mb-6">
                            <Heart size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-[#223322] mb-3">Harga Bersahabat</h3>
                        <p className="text-[#597359]">
                            Kualitas rasa bintang lima, tapi harga tetap merakyat. Makan enak dan mengenyangkan setiap hari tanpa perlu khawatir dompet jebol.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: 0.4 }}
                        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300"
                    >
                        <div className="w-16 h-16 mx-auto bg-[#2EC4B6]/10 text-[#2EC4B6] rounded-2xl flex items-center justify-center mb-6">
                            <Sparkles size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-[#223322] mb-3">Custom Suka-Suka</h3>
                        <p className="text-[#597359]">
                            Mau tambah ayam? Telur dadar? Atau pedas mampus level 5? Semua bisa diatur langsung saat kamu checkout pesanan.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* VISI & MISI / INFO LOKASI */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 mb-12">
                <div className="bg-[#223322] rounded-[3rem] p-10 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
                    {/* Hiasan background abstrak */}
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#438240] rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#F4A236] rounded-full blur-3xl opacity-30"></div>

                    <div className="flex-1 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                            Menghidangkan Kebahagiaan Lewat Sajian Berkualitas
                        </h2>
                        <p className="text-[#B4C4B4] mb-8 leading-relaxed text-lg">
                            Nyam.Aw dibangun bukan sekadar untuk berjualan, tapi untuk memastikan kamu selalu punya akses cepat ke makanan bergizi dan lezat di tengah kesibukanmu yang padat tanpa harus membuang waktu.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 text-white">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <MapPin className="text-[#F4A236]" size={24} />
                                <span className="font-medium">Batam</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <UtensilsCrossed className="text-[#438240]" size={24} />
                                <span className="font-medium">100% Halal & Bersih</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <Users className="text-[#2EC4B6]" size={24} />
                                <span className="font-medium">Porsi Mengenyangkan</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-1/3 flex justify-center relative z-10">
                        <Link 
                            href="/menu" 
                            className="bg-[#F4A236] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#e09331] transition-all hover:shadow-xl hover:shadow-[#F4A236]/30 hover:-translate-y-1 w-full text-center"
                        >
                            Coba Menu Sekarang
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}