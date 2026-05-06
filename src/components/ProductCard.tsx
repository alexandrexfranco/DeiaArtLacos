import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product, useProducts } from '@/contexts/ProductContext';
import { Link } from 'react-router-dom';

export function ProductCard(product: Product) {
    const { addToCart } = useCart();
    const { favorites, toggleFavorite } = useProducts();
    const isFavorite = favorites.includes(product.id);

    return (
        <div className="group bg-white rounded-3xl p-4 shadow-soft hover:shadow-lg transition-all border border-pink-50 relative overflow-hidden">
            {/* Medals/Tags */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isNew && (
                    <span className="bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        Novo
                    </span>
                )}
                {product.isBestSeller && (
                    <span className="bg-gradient-to-r from-gold-400 to-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        Mais Vendido
                    </span>
                )}
            </div>

            {/* Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="flex flex-col items-center gap-1">
                        <button
                            onClick={() => toggleFavorite(product.id)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${isFavorite
                                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                                    : 'bg-white text-pink-400 hover:bg-pink-500 hover:text-white'
                                }`}
                        >
                            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                        <span className="text-xs font-bold text-white bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            {product.likes}
                        </span>
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-400 hover:bg-pink-500 hover:text-white shadow-md transition-all"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="space-y-2">
                <Link to={`/produto/${product.id}`}>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight hover:text-pink-500 transition-colors cursor-pointer">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                            {product.category}
                            {product.type && ` • ${product.type}`}
                        </span>
                        {product.size && (
                            <span className="text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                Tam: {product.size}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-pink-500">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </span>
                        <Link
                            to={`/produto/${product.id}`}
                            className="text-xs font-bold text-pink-400 hover:text-pink-600 transition-colors"
                        >
                            Ver mais
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
