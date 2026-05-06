import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';

export function CartSidebar() {
    const {
        isCartOpen,
        setIsCartOpen,
        items,
        removeFromCart,
        updateQuantity,
        total,
        itemCount
    } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col font-sans border-l border-pink-100"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-pink-50 flex items-center justify-between bg-pink-50/50">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-pink-500" />
                                <h2 className="text-2xl font-handwritten font-bold text-gray-800">Seu Carrinho</h2>
                                <span className="bg-pink-100 text-pink-600 text-xs font-bold px-2 py-1 rounded-full">
                                    {itemCount} itens
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-red-500"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                                    <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center mb-4">
                                        <ShoppingBag size={48} className="text-pink-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-400">Seu carrinho está vazio</h3>
                                    <p className="text-gray-400 max-w-xs">Adicione laços da nossa coleção para vê-los aqui!</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="mt-4 px-6 py-2 bg-pink-100 text-pink-600 rounded-full font-bold hover:bg-pink-200 transition-colors"
                                    >
                                        Continuar Comprando
                                    </button>
                                </div>
                            ) : (
                                items.map(item => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="flex gap-4 bg-white p-4 rounded-2xl border border-pink-50 shadow-sm"
                                    >
                                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                                                <p className="text-pink-500 font-bold text-sm">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-pink-500"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-pink-500"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 bg-white border-t border-pink-50 space-y-4 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal</span>
                                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-gray-800">
                                        <span>Total</span>
                                        <span className="text-pink-500">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                                    </div>
                                </div>
                                <Link
                                    to="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full py-4 bg-pink-500 text-white font-bold rounded-2xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-200 hover:shadow-pink-300 flex items-center justify-center gap-2 transform active:scale-95"
                                >
                                    Finalizar Compra <ArrowRight size={20} />
                                </Link>
                                <p className="text-xs text-center text-gray-400 mt-2">
                                    Frete calculado na próxima etapa
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
