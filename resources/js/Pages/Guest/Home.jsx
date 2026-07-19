import React, { Suspense } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Leaf } from 'lucide-react';

const FeaturesSection = React.lazy(() => import('@/Components/FeaturesSection'));

export default function Home() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
    };

    return (
        <MainLayout>
            <Head title="Home" />
            
            {/* HERO SECTION */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col-reverse lg:flex-row items-center gap-12 overflow-hidden">
                <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-[#438240]/10 rounded-full blur-[80px] -z-10"></div>
                <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] bg-[#F4A236]/10 rounded-full blur-[80px] -z-10"></div>

                <motion.div initial="hidden" animate="show" variants={containerVariants} className="flex-1 text-center lg:text-left z-10">
                    <motion.div variants={itemVariants} className="inline-block bg-[#438240]/10 text-[#438240] px-4 py-2 rounded-full font-semibold text-sm mb-6 border border-[#438240]/20">
                        🌱 Makanan Sehat & Higienis
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <h1 className="text-5xl lg:text-7xl font-heading font-extrabold leading-tight text-[#223322] mb-6">
                            Lapar? <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#438240] to-[#80AA49]">
                                Nyam.Aw
                            </span> Solusinya!
                        </h1>
                    </motion.div>
                    <motion.p variants={itemVariants} className="text-lg text-[#597359] mb-8 max-w-xl mx-auto lg:mx-0">
                        Nikmati aneka sajian lezat bumbu rumahan tanpa perlu repot ke dapur. Pesan sekarang, siap dihidangkan hangat untukmu.
                    </motion.p>
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                        <Link href="/menu" className="bg-[#438240] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#366B33] hover:shadow-xl hover:shadow-[#438240]/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                            <ShoppingBag size={20} /> Pesan Sekarang
                        </Link>
                        
                    </motion.div>
                </motion.div>

                {/* Hero Image Group */}
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="flex-1 relative w-full flex justify-center lg:justify-end mt-12 lg:mt-0">
                    <div className="w-[90%] max-w-[400px] lg:max-w-[550px] aspect-[1402/1122] bg-gradient-to-br from-[#80AA49] to-[#438240] rounded-[3rem] shadow-2xl relative flex items-center justify-center">
                        <img src="/images/food-hero.png" alt="Nyam.Aw Best Seller" className="absolute w-[110%] lg:w-[115%] rounded-[2.5rem] drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                        <div className="absolute -top-4 lg:-top-6 -left-4 lg:-left-12 bg-[#FCF9F2] px-4 py-3 lg:px-6 lg:py-4 rounded-full shadow-xl flex items-center gap-3 animate-bounce border border-white">
                            <div className="bg-[#438240] p-2 lg:p-2.5 rounded-full text-white"><Heart size={18} className="lg:w-5 lg:h-5"/></div>
                            <span className="font-bold text-sm lg:text-base text-[#223322]">Fresh, Gurih, Bikin Nagih</span>
                        </div>
                        <div className="absolute -bottom-4 lg:-bottom-6 -right-4 lg:-right-8 bg-[#FCF9F2] px-4 py-3 lg:px-6 lg:py-4 rounded-full shadow-xl flex items-center gap-3 animate-bounce border border-white" style={{ animationDelay: '1s' }}>
                            <div className="bg-[#438240] p-2 lg:p-2.5 rounded-full text-white"><Leaf size={18} className="lg:w-5 lg:h-5"/></div>
                            <span className="font-bold text-sm lg:text-base text-[#223322]">Bahan Pilihan Berkualitas</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            <Suspense fallback={<div className="text-center py-20 text-[#438240] font-bold animate-pulse">Memuat Fitur Nyam.Aw...</div>}>
                <FeaturesSection />
            </Suspense>
            
        </MainLayout>
    );
}