import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export default function MenuCard({ menu, onAdd }) {
    if (!menu) return null;

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
        >
            <div className="relative">
                <img 
                    src={menu.image || 'https://via.placeholder.com/300'} 
                    alt={menu.name} 
                    className="w-full h-52 object-cover"
                />
                <div className="absolute top-3 right-3 bg-[#FFB627]/90 backdrop-blur-sm text-[#1E1E1E] font-heading font-semibold px-3 py-1 rounded-full text-xs">
                    Tersedia
                </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-heading font-bold text-lg text-[#1E1E1E] mb-1">{menu.name}</h3>
                <p className="font-body text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                    {menu.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                    <span className="font-heading font-bold text-[#FF6B35] text-xl">
                        Rp {Number(menu.price).toLocaleString('id-ID')}
                    </span>
                    <button 
                        onClick={() => onAdd(menu)}
                        className="bg-[#1E1E1E] hover:bg-[#FF6B35] text-white p-2.5 rounded-xl transition-colors duration-200"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}