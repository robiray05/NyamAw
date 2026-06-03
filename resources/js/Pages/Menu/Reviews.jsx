import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { Star, StarHalf, ArrowLeft, MessageSquareOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Reviews({ menu }) {
    const totalReviews = menu.reviews?.length || 0;
    const avgRating = totalReviews > 0 
        ? menu.reviews.reduce((sum, review) => sum + Number(review.rating), 0) / totalReviews 
        : 0;

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`full-${i}`} size={16} fill="currentColor" className="text-[#F4A236]" />);
        }
        
        if (hasHalfStar) {
            stars.push(
                <div key="half" className="relative w-4 h-4 inline-block flex-shrink-0">
                    <Star size={16} className="text-gray-200 absolute top-0 left-0" />
                    <StarHalf size={16} fill="currentColor" className="text-[#F4A236] absolute top-0 left-0" />
                </div>
            );
        }
        
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-200" />);
        }
        
        return stars;
    };

    return (
        <MainLayout>
            <Head title={`Ulasan ${menu.name} - Nyam.Aw`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/menu" className="inline-flex items-center gap-2 text-[#597359] hover:text-[#438240] font-bold mb-6 transition-colors">
                    <ArrowLeft size={20} /> Kembali ke Menu
                </Link>

                <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 mb-10">
                    <img src={menu.image || '/images/food-hero.png'} alt={menu.name} className="w-32 h-32 rounded-2xl object-cover" />
                    <div>
                        <h1 className="text-3xl font-bold text-[#223322] mb-2">{menu.name}</h1>
                        <p className="text-[#438240] font-extrabold text-xl mb-3">Rp {Number(menu.price).toLocaleString('id-ID')}</p>
                        
                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-[#F4A236] gap-0.5">
                                {renderStars(avgRating)}
                            </div>
                            <span className="text-sm font-bold text-[#597359]">
                                {avgRating > 0 ? `${avgRating.toFixed(1)} ` : ''}({totalReviews} Ulasan)
                            </span>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-[#223322] mb-6">Semua Ulasan Pelanggan</h3>

                {menu.reviews && menu.reviews.length > 0 ? (
                    <div className="space-y-4">
                        {menu.reviews.map((review, index) => (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} key={review.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-[#223322]">{review.user?.name || 'Pelanggan'}</h4>
                                        <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    <div className="flex items-center text-[#F4A236] gap-0.5">
                                        {renderStars(Number(review.rating || 0))}
                                    </div>
                                </div>
                                
                                <p className="text-[#597359] bg-[#FCF9F2] p-4 rounded-2xl text-sm italic mb-2">"{review.comment}"</p>

                                {/* AREA TAMPILAN BALASAN PENJUAL */}
                                {review.admin_reply && (
                                    <div className="bg-[#438240]/10 border border-[#438240]/20 p-4 rounded-2xl ml-4 sm:ml-8 relative mt-4 shadow-sm">
                                        <div className="absolute -top-2 left-6 w-4 h-4 bg-[#FCF9F2] border-t border-l border-[#438240]/20 transform rotate-45 md:bg-[#FCF9F2]"></div>
                                        <p className="text-xs font-bold text-[#438240] mb-1.5 relative z-10 flex items-center gap-1.5">
                                            <span className="w-4 h-4 bg-[#438240] text-white rounded-full inline-flex items-center justify-center text-[10px]">✓</span> 
                                            Penjual Nyam.Aw
                                        </p>
                                        <p className="text-sm text-[#223322] relative z-10 leading-relaxed font-medium">
                                            {review.admin_reply}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-50">
                        <MessageSquareOff className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-[#223322]">Belum Ada Ulasan</h3>
                        <p className="text-gray-500 text-sm">Jadilah yang pertama mencoba dan memberikan ulasan!</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}