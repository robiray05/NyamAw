import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        email: '',
        message: ''
    });

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const submitMessage = (e) => {
        e.preventDefault();
        // Karena ini UI front-end, kita buat simulasi alert sukses
        alert("Terima kasih! Pesan kamu sudah terkirim ke tim Nyam.Aw.");
        reset();
    };

    return (
        <MainLayout>
            <Head title="Hubungi Kami - Nyam.Aw" />

            {/* HERO SECTION */}
            <section className="relative pt-20 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-[#438240]/5 rounded-[3rem] -z-10 mx-4 sm:mx-8 mt-10"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-[#223322] mb-6">
                            Ada Pertanyaan buat <span className="text-[#F4A236]">Nyam.Aw?</span>
                        </h1>
                        <p className="text-lg text-[#597359] max-w-2xl mx-auto leading-relaxed">
                            Jangan ragu buat ngobrol sama kami! Mulai dari pertanyaan soal menu, komplain pesanan, atau ajakan kolaborasi event kampus, kami siap sedia membalas pesanamu.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* CONTACT INFO & FORM SECTION */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 mb-20">
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12 lg:gap-20">
                    
                    {/* Bagian Kiri: Informasi Kontak */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
                        className="w-full md:w-5/12 flex flex-col justify-center"
                    >
                        <h2 className="text-3xl font-heading font-bold text-[#223322] mb-8">
                            Mari Terhubung!
                        </h2>
                        
                        <div className="space-y-8">
                            <div className="flex items-start gap-5 group">
                                <div className="w-14 h-14 bg-[#438240]/10 text-[#438240] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <MapPin size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#223322] text-lg mb-1">Lokasi Kami</h4>
                                    <p className="text-[#597359] leading-relaxed">
                                        Batam
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 group">
                                <div className="w-14 h-14 bg-[#F4A236]/10 text-[#F4A236] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Phone size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#223322] text-lg mb-1">WhatsApp / Telepon</h4>
                                    <p className="text-[#597359]">+62 853-5572-3330</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 group">
                                <div className="w-14 h-14 bg-[#2EC4B6]/10 text-[#2EC4B6] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Mail size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#223322] text-lg mb-1">Email Layanan</h4>
                                    <p className="text-[#597359]">nyamaw@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bagian Kanan: Form Kontak */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
                        className="w-full md:w-7/12 bg-[#FCF9F2] p-8 md:p-10 rounded-[2rem] border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <MessageSquare className="text-[#438240]" size={24} />
                            <h3 className="text-2xl font-bold text-[#223322]">Kirim Pesan</h3>
                        </div>

                        <form onSubmit={submitMessage} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-[#223322] mb-2">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-white border-none rounded-xl p-4 text-[#223322] focus:ring-2 focus:ring-[#438240] transition-all shadow-sm"
                                    placeholder="Contoh: Aurora Ardhana"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#223322] mb-2">Alamat Email</label>
                                <input 
                                    type="email" 
                                    required
                                    className="w-full bg-white border-none rounded-xl p-4 text-[#223322] focus:ring-2 focus:ring-[#438240] transition-all shadow-sm"
                                    placeholder="Contoh : nyamaw@google.com"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#223322] mb-2">Isi Pesan</label>
                                <textarea 
                                    rows="5" 
                                    required
                                    className="w-full bg-white border-none rounded-xl p-4 text-[#223322] focus:ring-2 focus:ring-[#438240] transition-all shadow-sm resize-none"
                                    placeholder="Tulis pertanyaan, saran, atau komplain kamu di sini..."
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-[#438240] text-white py-4 rounded-xl font-bold hover:bg-[#366B33] transition-colors shadow-lg shadow-[#438240]/20 flex items-center justify-center gap-2"
                            >
                                <Send size={20} />
                                Kirim Pesan Sekarang
                            </button>
                        </form>
                    </motion.div>

                </div>
            </section>
        </MainLayout>
    );
}