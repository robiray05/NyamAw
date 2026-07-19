import { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, ClipboardList } from "lucide-react";

export default function MainLayout({ children }) {
    const { auth = {} } = usePage().props;
    const user = auth?.user;

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [desktopUserMenuOpen, setDesktopUserMenuOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDesktopUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getFirstName = (fullName) => {
        return fullName ? fullName.split(" ")[0] : "";
    };

    return (
        <div className="min-h-screen bg-[#FCF9F2] font-body text-[#223322] flex flex-col">
            <header
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                    scrolled
                        ? "bg-white/80 backdrop-blur-lg shadow-sm py-3"
                        : "bg-transparent py-5"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3 group">
                        <img
                            src="/images/logo-nyamaw.png"
                            alt="Logo Nyam.Aw"
                            className="h-10 w-auto group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                        />
                        <span className="font-heading font-extrabold text-2xl tracking-tight text-[#438240]">
                            Nyam.<span className="text-[#F4A236]">Aw</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 font-medium">
                        <Link
                            href="/"
                            className="hover:text-[#438240] transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/menu"
                            className="hover:text-[#438240] transition-colors"
                        >
                            Menu
                        </Link>
                        <Link
                            href="/about"
                            className="hover:text-[#438240] transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="hover:text-[#438240] transition-colors"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Auth Buttons Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-500">
                                    Hai,{" "}
                                    <span className="text-[#223322] font-bold">
                                        {getFirstName(user.name)}
                                    </span>
                                </span>

                                {/* Tombol Admin Dashboard (Hanya muncul jika role admin) */}
                                {user.role === "admin" && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="bg-[#438240] text-white px-5 py-2.5 rounded-full font-medium shadow-lg shadow-[#438240]/30 hover:bg-[#366B33] hover:-translate-y-0.5 transition-all"
                                    >
                                        Dashboard Admin
                                    </Link>
                                )}

                                {/* Dropdown Menu User (Burger Icon DaisyUI) */}
                                <div className="relative" ref={dropdownRef}>
                                    <label className="btn btn-circle swap swap-rotate bg-[#438240] text-white border-0 hover:bg-[#366B33]">
                                        <input
                                            type="checkbox"
                                            checked={desktopUserMenuOpen}
                                            onChange={() =>
                                                setDesktopUserMenuOpen(
                                                    !desktopUserMenuOpen,
                                                )
                                            }
                                        />

                                        <Menu size={20} className="swap-off" />

                                        <X size={20} className="swap-on" />
                                    </label>

                                    <AnimatePresence>
                                        {desktopUserMenuOpen && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    y: 15,
                                                    scale: 0.95,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: 15,
                                                    scale: 0.95,
                                                }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden z-50 flex flex-col py-2"
                                            >
                                                <Link
                                                    href="/riwayat-pesanan"
                                                    onClick={() =>
                                                        setDesktopUserMenuOpen(
                                                            false,
                                                        )
                                                    }
                                                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-[#223322] hover:bg-[#FCF9F2] hover:text-[#438240] transition-colors"
                                                >
                                                    <ClipboardList size={18} />{" "}
                                                    Riwayat Pesanan
                                                </Link>

                                                <div className="h-[1px] bg-gray-50 my-1 mx-3"></div>

                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    onClick={() =>
                                                        setDesktopUserMenuOpen(
                                                            false,
                                                        )
                                                    }
                                                    className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                                                >
                                                    <LogOut size={18} /> Keluar
                                                    Akun
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-[#438240] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-[#438240]/30 hover:bg-[#366B33] hover:-translate-y-0.5 transition-all"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-[#223322]"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-[70px] left-0 w-full bg-white shadow-xl z-40 md:hidden flex flex-col p-6 gap-4 rounded-b-3xl border-t border-gray-100"
                    >
                        <Link
                            href="/"
                            className="text-lg font-medium text-[#223322]"
                        >
                            Home
                        </Link>
                        <Link
                            href="/menu"
                            className="text-lg font-medium text-[#223322]"
                        >
                            Menu
                        </Link>
                        <hr className="border-gray-100" />

                        {user ? (
                            <div className="flex flex-col gap-3">
                                <span className="text-center text-sm text-gray-500 mb-2">
                                    Masuk sebagai{" "}
                                    <span className="font-bold text-[#223322]">
                                        {user.name}
                                    </span>
                                </span>

                                <Link
                                    href="/riwayat-pesanan"
                                    className="border border-[#438240] text-[#438240] text-center py-3 rounded-2xl font-medium flex justify-center items-center gap-2"
                                >
                                    <ClipboardList size={18} /> Riwayat Pesanan
                                </Link>

                                {/* Tombol Admin Dashboard di Mobile */}
                                {user.role === "admin" && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="bg-[#438240] text-white text-center py-3 rounded-2xl font-medium"
                                    >
                                        Dashboard Admin
                                    </Link>
                                )}

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="bg-red-50 text-red-500 text-center py-3 rounded-2xl font-medium flex items-center justify-center gap-2 mt-2"
                                >
                                    <LogOut size={18} /> Keluar Akun
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-[#438240] text-white text-center py-3 rounded-2xl font-bold mt-2 hover:bg-[#366B33] transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="flex-1 pt-24 pb-12">{children}</main>

            <footer className="bg-[#223322] text-[#FCF9F2] py-12 rounded-t-[3rem] mt-auto">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <img
                        src="/images/logo-nyamaw.png"
                        alt="Logo"
                        className="h-14 mx-auto mb-4 brightness-0 invert opacity-90"
                    />
                    <p className="text-[#8DA38D] mb-6 text-sm">
                        Pesan makanan rumahan tanpa ribet.
                    </p>
                    <div className="flex justify-center gap-6 text-sm font-medium mb-8 text-[#B4C4B4]">
                        <Link
                            href="/menu"
                            className="hover:text-white transition-colors"
                        >
                            Menu
                        </Link>
                        <Link
                            href="/faq"
                            className="hover:text-white transition-colors"
                        >
                            FAQ
                        </Link>
                        <Link
                            href="/terms"
                            className="hover:text-white transition-colors"
                        >
                            Syarat & Ketentuan
                        </Link>
                    </div>
                    <p className="text-[#597359] text-xs">
                        &copy; 2026 Nyam.Aw. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
