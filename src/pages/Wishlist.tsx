
import { motion } from 'framer-motion';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
    const { products, favorites, toggleFavorite } = useProducts();
    const { addToCart } = useCart();

    const wishlistItems = products.filter(product => favorites.includes(product.id));

    return (
        <div className="min-h-screen bg-cream pt-24 pb-12 font-sans">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex items-center gap-3 mb-8">
                    <span className="p-3 bg-pink-100 rounded-full text-pink-500">
                        <Heart size={24} fill="currentColor" />
                    </span>
                    <h1 className="text-3xl md:text-4xl font-handwritten font-bold text-gray-800">
                        Meus Favoritos
                    </h1>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-pink-50">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-6">
                            <Heart size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sua lista de desejos está vazia</h2>
                        <p className="text-gray-500 mb-8">Salve seus itens favoritos para não perder de vista!</p>
                        <Link
                            to="/loja"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-pink-500 text-white font-bold rounded-full hover:bg-pink-600 transition-all shadow-lg shadow-pink-200"
                        >
                            Ver Coleção <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlistItems.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white p-4 rounded-3xl shadow-sm hover:shadow-md transition-all border border-pink-50 group"
                            >
                                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <button
                                        onClick={() => toggleFavorite(product.id)}
                                        className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-pink-500 shadow-sm hover:bg-white transition-colors z-10"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>

                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-pink-500">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                    </span>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200 hover:bg-green-600 hover:scale-105 transition-all"
                                    >
                                        <ShoppingBag size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
