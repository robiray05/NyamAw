import { motion } from 'framer-motion';
import { Zap, Star, ChefHat, SlidersHorizontal } from 'lucide-react';

export default function FeaturesSection() {
    return (
        <section className="bg-white py-20 rounded-[3rem] mt-10 shadow-sm border border-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-heading font-bold text-[#223322]">Kenapa Memilih Kami?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: <ChefHat />, title: "Fresh Cooked Daily", desc: "Setiap menu dimasak fresh dengan bahan pilihan berkualitas.", color: "text-[#438240]", bg: "bg-[#438240]/10" },
                        { icon: <Zap />, title: "Fast & Easy Order", desc: "Pesan makanan jadi lebih cepat, praktis, dan tanpa ribet.", color: "text-[#F4A236]", bg: "bg-[#F4A236]/10" },
                        { icon: <SlidersHorizontal />, title: "Custom Sesuai Selera", desc: "Atur topping, level pedas, dan tambahan favoritmu.", color: "text-[#80AA49]", bg: "bg-[#80AA49]/10" },
                        { icon: <Star />, title: "Rasa Favorit", desc: "Menu lezat dengan cita rasa yang bikin pengen order lagi.", color: "text-[#F4A236]", bg: "bg-[#F4A236]/20" },
                    ].map((feat, idx) => (
                        <motion.div whileHover={{ y: -5 }} key={idx} className="p-6 rounded-3xl bg-[#FCF9F2] border border-white shadow-sm hover:shadow-lg transition-all">
                            <div className={`${feat.bg} ${feat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}>
                                {feat.icon}
                            </div>
                            <h3 className="font-bold text-[#223322] text-lg mb-2">{feat.title}</h3>
                            <p className="text-[#597359] text-sm leading-relaxed">{feat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}