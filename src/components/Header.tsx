import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout, isAdmin } = useAuth();
    const { setIsCartOpen, itemCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/90 backdrop-blur-md shadow-soft py-3'
                    : 'bg-transparent py-5'
                    }`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="text-2xl md:text-3xl font-handwritten font-bold text-pink-500 hover:scale-105 transition-transform">
                        Déia Art Laços
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
                        <Link to="/" className="hover:text-pink-500 transition-colors">Início</Link>
                        <Link to="/loja" className="hover:text-pink-500 transition-colors">Loja</Link>
                        <Link to="/sobre" className="hover:text-pink-500 transition-colors">Sobre</Link>
                        <Link to="/contato" className="hover:text-pink-500 transition-colors">Contato</Link>
                    </nav>

                    {/* Icons */}
                    <div className="hidden md:flex items-center gap-5">
                        <Link to="/favoritos" className="text-gray-600 hover:text-pink-500 hover:scale-110 transition-all">
                            <Heart className="w-6 h-6" />
                        </Link>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="text-gray-600 hover:text-pink-500 hover:scale-110 transition-all relative"
                        >
                            <ShoppingBag className="w-6 h-6" />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                        {user ? (
                            <div className="relative group">
                                <button className="text-gray-600 hover:text-pink-500 hover:scale-110 transition-all flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold border border-pink-200">
                                        {user.email?.[0].toUpperCase()}
                                    </div>
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-pink-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-bold text-gray-800 truncate">{user.displayName || 'Usuário'}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    {isAdmin && (
                                        <Link to="/admin" className="block px-4 py-2 text-sm text-pink-600 font-bold hover:bg-pink-50 hover:text-pink-700 bg-pink-50/50">
                                            Painel Admin
                                        </Link>
                                    )}
                                    <Link to="/perfil" className="block px-4 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-500">Meu Perfil</Link>
                                    <Link to="/pedidos" className="block px-4 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-500">Meus Pedidos</Link>
                                    <button
                                        onClick={async () => {
                                            await logout();
                                            navigate('/');
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                                    >
                                        Sair
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="text-gray-600 hover:text-pink-500 hover:scale-110 transition-all">
                                <User className="w-6 h-6" />
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-600"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-7 h-7" />
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-[60] bg-cream md:hidden flex flex-col items-center justify-center gap-8"
                    >
                        <button
                            className="absolute top-6 right-6 text-gray-500"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <nav className="flex flex-col items-center gap-6 text-xl font-medium text-gray-700">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Início</Link>
                            <Link to="/loja" onClick={() => setIsMobileMenuOpen(false)}>Loja</Link>
                            <Link to="/sobre" onClick={() => setIsMobileMenuOpen(false)}>Sobre</Link>
                            <Link to="/contato" onClick={() => setIsMobileMenuOpen(false)}>Contato</Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
