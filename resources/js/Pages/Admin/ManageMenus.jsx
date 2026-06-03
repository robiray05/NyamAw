import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

export default function ManageMenus({ menus = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMenuId, setCurrentMenuId] = useState(null);

    const { data, setData, post, processing, reset, clearErrors } = useForm({
        name: '',
        description: '',
        price: '',
        modal_price: '',
        image: null,
    });

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentMenuId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (menu) => {
        setIsEditing(true);
        setCurrentMenuId(menu.id);
        setData({
            name: menu.name,
            description: menu.description || '',
            price: menu.price,
            modal_price: menu.modal_price || '',
            image: null,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            router.post(`/admin/menus/${currentMenuId}`, {
                _method: 'put',
                name: data.name,
                description: data.description,
                price: data.price,
                modal_price: data.modal_price,
                image: data.image,
            }, {
                onSuccess: () => {
                    closeModal();
                    Swal.fire('Berhasil!', 'Menu diperbarui.', 'success');
                }
            });
        } else {
            post('/admin/menus', {
                onSuccess: () => {
                    closeModal();
                    Swal.fire('Berhasil!', 'Menu ditambahkan.', 'success');
                }
            });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Menu?',
            text: "Data tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/menus/${id}`, {
                    onSuccess: () => Swal.fire('Dihapus!', 'Menu berhasil dihapus.', 'success')
                });
            }
        });
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
    };

    return (
        <AdminLayout>
            <Head title="Kelola Menu - Admin" />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E1E1E] mb-2">Kelola Menu</h1>
                    <p className="text-gray-500">Atur daftar menu, harga jual, dan harga modal Nyam.Aw.</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="bg-[#438240] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#366B33] transition-colors shadow-lg shadow-[#438240]/30 flex items-center gap-2"
                >
                    <Plus size={20} /> Tambah Menu
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-600">
                                <th className="p-5">Menu</th>
                                <th className="p-5">Harga Jual</th>
                                <th className="p-5">Harga Modal</th>
                                <th className="p-5">Estimasi Untung</th>
                                <th className="p-5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm text-gray-800">
                            {menus.length > 0 ? menus.map((menu) => (
                                <tr key={menu.id} className="hover:bg-gray-50/50">
                                    <td className="p-5 flex items-center gap-4">
                                        <img src={menu.image || '/images/food-hero.png'} alt={menu.name} className="w-12 h-12 rounded-lg object-cover" />
                                        <div>
                                            <p className="font-bold text-[#1E1E1E]">{menu.name}</p>
                                            <p className="text-xs text-gray-400 line-clamp-1 w-48">{menu.description}</p>
                                        </div>
                                    </td>
                                    <td className="p-5 font-extrabold text-[#438240]">{formatRupiah(menu.price)}</td>
                                    <td className="p-5 font-bold text-red-500">{formatRupiah(menu.modal_price)}</td>
                                    <td className="p-5 font-bold text-[#F4A236]">{formatRupiah(menu.price - menu.modal_price)}</td>
                                    <td className="p-5">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => openEditModal(menu)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(menu.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-400">Belum ada menu yang ditambahkan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1E1E1E]/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
                        >
                            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                                <X size={20} />
                            </button>
                            <h2 className="text-xl font-bold text-[#1E1E1E] mb-6">
                                {isEditing ? 'Edit Menu' : 'Tambah Menu Baru'}
                            </h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-[#223322] mb-2">Nama Menu</label>
                                    <input 
                                        type="text"
                                        className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#438240] focus:outline-none"
                                        required
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-[#223322] mb-2">Deskripsi</label>
                                    <textarea 
                                        rows="3"
                                        className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#438240] focus:outline-none resize-none"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[#223322] mb-2">Harga Jual (Rp)</label>
                                        <input 
                                            type="number"
                                            className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#438240] focus:outline-none"
                                            required
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#223322] mb-2">Harga Modal (Rp)</label>
                                        <input 
                                            type="number"
                                            className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#438240] focus:outline-none"
                                            required
                                            value={data.modal_price}
                                            onChange={e => setData('modal_price', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-[#223322] mb-2">Foto Menu</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                                        <input 
                                            type="file"
                                            accept="image/*"
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#438240]/10 file:text-[#438240] hover:file:bg-[#438240]/20"
                                            onChange={e => setData('image', e.target.files[0])}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#438240] text-white py-3 rounded-xl font-bold hover:bg-[#366B33] disabled:opacity-50 transition-colors"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Menu'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}