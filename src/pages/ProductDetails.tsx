import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { Heart, ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProductById, favorites, toggleFavorite } = useProducts();
    const { addToCart } = useCart();
    
    const product = getProductById(id || '');
    const isFavorite = id ? favorites.includes(id) : false;

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h2>
                <p className="text-gray-600 mb-8">O produto que você está procurando não existe ou foi removido.</p>
                <button 
                    onClick={() => navigate('/loja')}
                    className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-pink-600 transition-all"
                >
                    Voltar para a Loja
                </button>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product);
        toast.success(`${product.name} adicionado ao carrinho!`);
    };

    return (
        <div className="bg-cream min-h-screen pb-20 pt-24">
            <div className="container mx-auto px-6 py-8">
                {/* Breadcrumbs / Back */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Voltar</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Image Gallery */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="aspect-square rounded-4xl overflow-hidden bg-white shadow-soft border border-pink-50">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Product Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {product.category}
                                </span>
                                {product.isNew && (
                                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Novo
                                    </span>
                                )}
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill="currentColor" />
                                    ))}
                                </div>
                                <span className="text-gray-400 text-sm">(4.9 • {product.likes} curtidas)</span>
                            </div>

                            <p className="text-3xl font-bold text-pink-500">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                            </p>
                        </div>

                        <div className="space-y-6 py-8 border-y border-pink-100">
                            <div className="space-y-2">
                                <h3 className="font-bold text-gray-800">Descrição</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description || 'Este acessório é feito à mão com materiais de alta qualidade, pensado especialmente para proporcionar conforto e estilo para sua princesa.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white border border-pink-50">
                                    <span className="text-xs text-gray-400 uppercase font-bold">Tipo</span>
                                    <p className="font-bold text-gray-700">{product.type || 'N/A'}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white border border-pink-50">
                                    <span className="text-xs text-gray-400 uppercase font-bold">Tamanho</span>
                                    <p className="font-bold text-gray-700">{product.size || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 bg-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-pink-200 hover:bg-pink-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                            >
                                <ShoppingCart size={24} />
                                Adicionar ao Carrinho
                            </button>
                            
                            <button 
                                onClick={() => toggleFavorite(product.id)}
                                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center ${
                                    isFavorite 
                                    ? 'bg-pink-50 border-pink-500 text-pink-500' 
                                    : 'border-gray-200 text-gray-400 hover:border-pink-300 hover:text-pink-400'
                                }`}
                            >
                                <Heart size={28} fill={isFavorite ? "currentColor" : "none"} />
                            </button>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                                    <ShieldCheck size={18} />
                                </div>
                                <span>Compra Segura</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                    <Truck size={18} />
                                </div>
                                <span>Envio Rápido</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                                    <RotateCcw size={18} />
                                double check for inconsistencies </div>
                                <span>Troca Grátis</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
