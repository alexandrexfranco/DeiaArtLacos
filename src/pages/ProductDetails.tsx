import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { Heart, ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, X, ChevronLeft, ChevronRight, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ProductReviews } from '@/components/ProductReviews';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProductById, favorites, toggleFavorite } = useProducts();
    const { addToCart } = useCart();
    
    const product = getProductById(id || '');
    const isFavorite = id ? favorites.includes(id) : false;

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const allImages = product ? [product.image, ...(product.images || [])].filter(Boolean) : [];
    const activeImage = allImages[activeImageIndex];

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setActiveImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

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
                        <div 
                            className="aspect-square rounded-4xl overflow-hidden bg-white shadow-soft border border-pink-50 cursor-pointer relative group"
                            onClick={() => setIsGalleryOpen(true)}
                        >
                            <img 
                                src={activeImage} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Hover overlay indicator */}
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <span className="bg-white/90 text-pink-500 px-4 py-2 rounded-full font-bold shadow-lg">
                                    Ampliar Foto
                                </span>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                                            activeImageIndex === idx ? 'border-pink-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
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
                        
                        {/* Share & Extra Info */}
                        <div className="flex flex-col gap-6 pt-4">
                            <div className="flex items-center gap-4 py-4 border-y border-pink-50">
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Compartilhar:</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            const url = window.location.href;
                                            const text = `Olha que lindo esse ${product.name} que encontrei na Déia Art Laços! 🎀`;
                                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`, '_blank');
                                        }}
                                        className="p-3 bg-[#25D366] text-white rounded-full hover:scale-110 transition-transform shadow-md"
                                        title="Compartilhar no WhatsApp"
                                    >
                                        <MessageCircle size={18} fill="currentColor" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            toast.success('Link copiado para a área de transferência!');
                                        }}
                                        className="p-3 bg-white text-pink-500 border border-pink-100 rounded-full hover:bg-pink-50 hover:scale-110 transition-transform shadow-sm"
                                        title="Copiar Link"
                                    >
                                        <LinkIcon size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                </div>
                                <span>Troca Grátis</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
                
                {/* Reviews Section */}
                <ProductReviews productId={product.id} />
            </div>

            {/* Fullscreen Gallery Modal */}
            <AnimatePresence>
                {isGalleryOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
                    >
                        <button 
                            onClick={() => setIsGalleryOpen(false)}
                            className="absolute top-6 right-6 text-white hover:text-pink-400 p-2 z-50 transition-colors"
                        >
                            <X size={32} />
                        </button>

                        {allImages.length > 1 && (
                            <button 
                                onClick={prevImage}
                                className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white hover:text-pink-400 p-4 z-50 transition-colors"
                            >
                                <ChevronLeft size={48} />
                            </button>
                        )}

                        <div className="w-full max-w-5xl max-h-[85vh] p-4 flex items-center justify-center relative" onClick={(e) => e.stopPropagation()}>
                            <img 
                                key={activeImageIndex}
                                src={activeImage} 
                                alt={product.name} 
                                className="max-w-full max-h-[85vh] object-contain select-none"
                            />
                        </div>

                        {allImages.length > 1 && (
                            <button 
                                onClick={nextImage}
                                className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white hover:text-pink-400 p-4 z-50 transition-colors"
                            >
                                <ChevronRight size={48} />
                            </button>
                        )}
                        
                        {/* Dots */}
                        {allImages.length > 1 && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                                {allImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`w-3 h-3 rounded-full transition-all ${
                                            activeImageIndex === idx ? 'bg-pink-500 scale-125' : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
