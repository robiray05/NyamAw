import React from 'react';
import { Head } from '@inertiajs/react';

export default function Login() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCF9F2] px-4 font-body text-[#223322]">
            <Head title="Masuk - Nyam.Aw" />

            <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-[#438240]/10 border border-[#438240]/10 text-center relative overflow-hidden">
                
                {/* Dekorasi Latar Belakang (Dibuat lebih menonjol dengan warna Nyam.Aw) */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-[#438240]/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-40 h-40 rounded-full bg-[#F4A236]/15 blur-3xl"></div>

                <div className="relative z-10">
                    {/* Tombol kembali ke Beranda (Diperbarui dengan warna hijau Nyam.Aw) */}
                    <a 
                        href="/" 
                        className="absolute -top-2 -left-2 p-2.5 text-[#438240] hover:text-[#F4A236] bg-[#FCF9F2] hover:bg-[#F4A236]/10 rounded-full transition-all duration-300"
                        title="Kembali ke Beranda"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </a>

                    <img 
                        src="/images/logo-nyamaw.png" 
                        alt="Logo Nyam.Aw" 
                        className="w-24 h-24 mx-auto object-contain mb-6 mt-4 drop-shadow-md"
                        onError={(e) => { 
                            e.target.src = 'https://ui-avatars.com/api/?name=Nyam+Aw&background=438240&color=fff&rounded=xl&bold=true'; 
                        }}
                    />
                    
                    <h1 className="text-3xl font-extrabold text-[#223322] mb-3 tracking-tight">Selamat Datang!</h1>
                    <p className="text-[#597359] text-sm mb-10 leading-relaxed px-2">
                        Masuk menggunakan akun Google kamu untuk mulai memesan kuliner andalan Nyam.Aw dengan cepat dan mudah.
                    </p>

                    {/* Tombol Google (Border dan Hover disesuaikan dengan tema) */}
                    <a 
                        href="/auth/google"
                        className="w-full flex items-center justify-center gap-4 border-2 border-[#438240]/20 py-3.5 px-6 rounded-2xl font-bold text-sm text-[#223322] bg-white hover:bg-[#FCF9F2] hover:border-[#438240] hover:text-[#438240] transition-all duration-300 shadow-sm hover:shadow-md group"
                    >
                        <img 
                            src="https://www.svgrepo.com/show/475656/google-color.svg" 
                            alt="Google Icon" 
                            className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                        />
                        Lanjutkan dengan Google
                    </a>

                    {/* Footer Text (Warna diselaraskan agar tidak pucat) */}
                    <div className="mt-8 text-xs text-[#8DA38D] font-medium leading-relaxed">
                        Dengan masuk, kamu menyetujui<br/>
                        <span className="text-[#438240] hover:text-[#F4A236] hover:underline cursor-pointer transition-colors">Ketentuan Layanan</span> & <span className="text-[#438240] hover:text-[#F4A236] hover:underline cursor-pointer transition-colors">Kebijakan Privasi</span> Nyam.Aw.
                    </div>
                </div>
            </div>
        </div>
    );
}