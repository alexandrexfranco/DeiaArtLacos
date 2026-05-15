import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Package, Image as ImageIcon, LogOut, Home, Users, MessageSquare, Mail, Quote, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function AdminLayout() {
    const { signOut, user, isAdmin, loading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate('/login');
            } else if (!isAdmin) {
                navigate('/');
            }
        }
    }, [user, isAdmin, loading, navigate]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500"></div>
                    <p className="text-gray-400 text-sm animate-pulse">Verificando acesso...</p>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) return null;

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/produtos', icon: Package, label: 'Produtos' },
        { path: '/admin/banners', icon: ImageIcon, label: 'Banners' },
        { path: '/admin/avaliacoes', icon: MessageSquare, label: 'Avaliações' },
        { path: '/admin/depoimentos', icon: Quote, label: 'Depoimentos' },
        { path: '/admin/clientes', icon: Users, label: 'Clientes' },
        { path: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-4 z-50">
                <h1 className="text-xl font-handwritten font-bold text-pink-500">
                    Déia Art Laços
                    <span className="text-[10px] ml-2 font-sans text-gray-400 uppercase tracking-widest">Painel</span>
                </h1>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-gray-600 hover:text-pink-500 transition-colors"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/50 z-[55] transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:relative inset-y-0 left-0 w-64 bg-white shadow-md flex flex-col z-[60]
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-gray-100 lg:block hidden">
                    <h1 className="text-2xl font-handwritten font-bold text-pink-500">
                        Déia Art Laços
                        <span className="block text-xs font-sans text-gray-400 mt-1 uppercase tracking-widest">Painel Admin</span>
                    </h1>
                </div>

                {/* Mobile Sidebar Close Header */}
                <div className="lg:hidden p-4 border-b border-gray-100 flex items-center justify-between bg-pink-50/30">
                    <span className="text-sm font-bold text-pink-600 uppercase tracking-widest">Menu Admin</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-1 text-gray-400 hover:text-pink-500">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-pink-50 text-pink-500 font-bold'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-pink-500'
                                    }`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 space-y-2">
                    <Link 
                        to="/" 
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-pink-500 rounded-xl transition-all"
                    >
                        <Home size={20} />
                        Ver Loja
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium"
                    >
                        <LogOut size={20} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-8 mt-16 lg:mt-0">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
