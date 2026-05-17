import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, Heart, Camera, Edit2, Save, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

interface Order {
    id: string;
    date: string;
    items: OrderItem[];
    total: number;
    status: string;
    paymentMethod: string;
}
import { toast } from 'sonner';

export default function Profile() {
    const { user, logout, loading, updateUserProfile } = useAuth();
    const { favorites, products } = useProducts();
    const navigate = useNavigate();
    const [newName, setNewName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [editData, setEditData] = useState({
        whatsapp: '',
        cep: '',
        endereco: '',
        numero: '',
        bairro: '',
        complemento: 'Casa',
        cidade: '',
        estado: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'address' | 'favorites'>('overview');
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!user) {
            setOrders([]);
            return;
        }

        const fetchOrders = async () => {
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.uid)
                    .order('date', { ascending: false })
                    .limit(3);
                
                if (error) throw error;
                
                setOrders(data.map(order => ({
                    ...order,
                    items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
                })) as Order[]);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setOrders([]);
            }
        };

        fetchOrders();
    }, [user]);

    useEffect(() => {
        if (!loading && !user) {
            setIsInitialized(false);
            navigate('/login');
            return;
        }
        if (user && !isInitialized) {
            setNewName(user.displayName || '');
            setEditData({
                whatsapp: user.whatsapp || '',
                cep: user.cep || '',
                endereco: user.endereco || '',
                numero: user.numero || '',
                bairro: user.bairro || '',
                complemento: user.complemento || 'Casa',
                cidade: user.cidade || '',
                estado: user.estado || ''
            });
            setIsInitialized(true);
        }
    }, [user, loading, navigate, isInitialized]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-cream">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-24 h-24 bg-pink-100 rounded-full"></div>
                    <div className="h-4 w-48 bg-pink-100 rounded"></div>
                    <div className="h-2 w-32 bg-pink-50 rounded"></div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleUpdateName = async () => {
        if (!newName.trim()) return;
        try {
            await updateUserProfile({ displayName: newName });
            toast.success('Nome atualizado!');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar nome.');
        }
    };

    const handleUpdateInfo = async () => {
        try {
            await updateUserProfile(editData);
            toast.success('Informações atualizadas!');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar informações.');
        }
    };

    const maskPhone = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers
                .replace(/^(\d{2})(\d)/g, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .substring(0, 15);
        }
        return value.substring(0, 15);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'whatsapp') {
            setEditData(prev => ({ ...prev, [name]: maskPhone(value) }));
        } else if (name === 'cep') {
            const cep = value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').substring(0, 9);
            setEditData(prev => ({ ...prev, [name]: cep }));
        } else {
            setEditData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleBlurCep = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (data.erro) return;

            setEditData(prev => ({
                ...prev,
                endereco: data.logradouro || prev.endereco,
                bairro: data.bairro || prev.bairro,
                cidade: data.localidade || prev.cidade,
                estado: data.uf || prev.estado,
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Verificar tamanho do arquivo (limite de 15MB)
        if (file.size > 15 * 1024 * 1024) {
            toast.error('A imagem é muito grande! Por favor, escolha uma foto de até 15MB.');
            return;
        }

        console.log('Iniciando upload da foto:', file.name, file.size, 'bytes');
        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.uid}-${Math.random()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            const url = data.publicUrl;
            console.log('Upload concluído, URL:', url);
            await updateUserProfile({ photoURL: url });
            toast.success('Foto de perfil atualizada!');
        } catch (error: any) {
            console.error('Erro detalhado no upload:', error);
            toast.error('Erro ao atualizar foto. Verifique o console para mais detalhes.');
        } finally {
            setIsUploading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Visão Geral', icon: User },
        { id: 'orders', label: 'Meus Pedidos', icon: Package },
        { id: 'address', label: 'Dados de Entrega', icon: Edit2 },
        { id: 'favorites', label: 'Favoritos', icon: Heart },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-cream font-sans">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="md:w-64 flex-shrink-0">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl shadow-sm border border-pink-50 overflow-hidden sticky top-28"
                        >
                            {/* User Header in Sidebar */}
                            <div className="p-6 text-center border-b border-pink-50 bg-gradient-to-br from-pink-50/50 to-white">
                                <div className="relative w-20 h-20 mx-auto mb-3">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="w-full h-full rounded-full bg-white p-1 shadow-sm overflow-hidden relative group cursor-pointer"
                                    >
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="Perfil" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-pink-100 flex items-center justify-center text-2xl font-bold text-pink-500">
                                                {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="text-white w-5 h-5" />
                                        </div>
                                    </button>
                                </div>
                                <h2 className="font-bold text-gray-800 line-clamp-1">{user.displayName || 'Cliente'}</h2>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>

                            {/* Tab Links */}
                            <nav className="p-4 space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                                                activeTab === tab.id 
                                                ? 'bg-pink-500 text-white shadow-md shadow-pink-100' 
                                                : 'text-gray-500 hover:bg-pink-50 hover:text-pink-500'
                                            }`}
                                        >
                                            <Icon size={18} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                                
                                <div className="pt-4 mt-4 border-t border-pink-50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-50 transition-all"
                                    >
                                        <LogOut size={18} />
                                        Sair da Conta
                                    </button>
                                </div>
                            </nav>
                        </motion.div>
                    </div>

                    {/* Main Dashboard Content */}
                    <div className="flex-grow">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <header className="mb-8">
                                        <h1 className="text-3xl font-handwritten font-bold text-gray-800">Olá, {user.displayName?.split(' ')[0] || 'Cliente'}! 🎀</h1>
                                        <p className="text-gray-500">Bem-vinda ao seu painel encantado.</p>
                                    </header>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-500">
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Pedidos</p>
                                                <p className="text-xl font-bold text-gray-800">{orders.length}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-500">
                                                <Heart size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Favoritos</p>
                                                <p className="text-xl font-bold text-gray-800">{favorites.length}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Orders Preview */}
                                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-pink-50">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-gray-800">Pedidos Recentes</h3>
                                            <button 
                                                onClick={() => setActiveTab('orders')}
                                                className="text-pink-500 text-sm font-bold hover:underline"
                                            >
                                                Ver Todos
                                            </button>
                                        </div>
                                        
                                        {orders.length === 0 ? (
                                            <div className="text-center py-6 text-gray-400 italic">
                                                Nenhum pedido realizado ainda.
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {orders.slice(0, 2).map((order) => (
                                                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-pink-500 shadow-sm">
                                                                <Package size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-800 text-sm">Pedido #{order.id.slice(-6)}</p>
                                                                <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString('pt-BR')}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-pink-500 text-sm">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}</p>
                                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-600 rounded-full">{order.status}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ORDERS TAB */}
                            {activeTab === 'orders' && (
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-pink-50 min-h-[500px]">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-8">Histórico de Pedidos</h2>
                                    
                                    {orders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Package size={48} className="mx-auto text-gray-200 mb-4" />
                                            <p className="text-gray-500">Você ainda não fez nenhum pedido.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div key={order.id} className="border border-pink-100 rounded-2xl p-4 hover:shadow-md transition-all">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-600 rounded-full border border-green-200">
                                                                {order.status}
                                                            </span>
                                                            <p className="text-xs text-gray-400 mt-2">ID: #{order.id.slice(-6)} • {new Date(order.date).toLocaleDateString('pt-BR')}</p>
                                                        </div>
                                                        <span className="text-lg font-bold text-gray-800">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl">
                                                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-700 line-clamp-1">{item.name}</p>
                                                                    <p className="text-xs text-gray-400">{item.quantity}x • {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ADDRESS TAB */}
                            {activeTab === 'address' && (
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-pink-50">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-8">Dados de Entrega e Contato</h2>
                                    
                                    <div className="space-y-6">
                                        {/* Name Edit */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome de Exibição</label>
                                            <div className="flex gap-2">
                                                <input
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    className="flex-grow px-4 py-3 rounded-xl border border-pink-50 focus:ring-2 focus:ring-pink-300 outline-none transition-all"
                                                />
                                                <button 
                                                    onClick={handleUpdateName}
                                                    className="px-6 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-all shadow-sm"
                                                >
                                                    Salvar
                                                </button>
                                            </div>
                                        </div>

                                        <div className="h-px bg-pink-50 my-6"></div>

                                        {/* Delivery Info */}
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">WhatsApp</label>
                                                    <input
                                                        type="text"
                                                        name="whatsapp"
                                                        value={editData.whatsapp}
                                                        onChange={handleInputChange}
                                                        placeholder="(00) 00000-0000"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-300 outline-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">CEP</label>
                                                    <input
                                                        type="text"
                                                        name="cep"
                                                        value={editData.cep}
                                                        onChange={handleInputChange}
                                                        onBlur={handleBlurCep}
                                                        placeholder="00000-000"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-300 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Endereço</label>
                                                <div className="grid grid-cols-4 gap-4">
                                                    <input
                                                        type="text"
                                                        name="endereco"
                                                        value={editData.endereco}
                                                        onChange={handleInputChange}
                                                        placeholder="Rua, Avenida..."
                                                        className="col-span-3 px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-300 outline-none transition-all"
                                                    />
                                                    <input
                                                        type="text"
                                                        name="numero"
                                                        value={editData.numero}
                                                        onChange={handleInputChange}
                                                        placeholder="Nº"
                                                        className="col-span-1 px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-300 outline-none transition-all text-center"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bairro</label>
                                                    <input
                                                        type="text"
                                                        name="bairro"
                                                        value={editData.bairro}
                                                        onChange={handleInputChange}
                                                        placeholder="Bairro"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-300 outline-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Complemento</label>
                                                    <select
                                                        name="complemento"
                                                        value={editData.complemento || 'Casa'}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-300 outline-none transition-all bg-white"
                                                    >
                                                        <option value="Casa">Casa</option>
                                                        <option value="Apartamento">Apartamento</option>
                                                        <option value="Loja">Loja</option>
                                                        <option value="Sala">Sala</option>
                                                        <option value="Sobrado">Sobrado</option>
                                                        <option value="Sítio">Sítio</option>
                                                        <option value="Chácara">Chácara</option>
                                                        <option value="S/N">Sem complemento</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cidade/UF</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        name="cidade"
                                                        value={editData.cidade}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-300 outline-none transition-all"
                                                    />
                                                    <input
                                                        type="text"
                                                        name="estado"
                                                        value={editData.estado}
                                                        onChange={handleInputChange}
                                                        maxLength={2}
                                                        className="w-16 px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-300 outline-none transition-all text-center uppercase"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleUpdateInfo}
                                                className="w-full mt-6 py-4 bg-pink-500 text-white font-bold rounded-2xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-100 flex items-center justify-center gap-2"
                                            >
                                                <Save size={18} />
                                                Salvar Dados de Entrega
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* FAVORITES TAB */}
                            {activeTab === 'favorites' && (
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-pink-50 min-h-[500px]">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-8">Meus Favoritos ❤️</h2>
                                    
                                    {favorites.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Heart size={48} className="mx-auto text-pink-100 mb-4" />
                                            <p className="text-gray-500 text-lg mb-6">Sua lista de desejos está vazia.</p>
                                            <button 
                                                onClick={() => navigate('/')}
                                                className="px-8 py-3 bg-pink-500 text-white font-bold rounded-2xl hover:bg-pink-600 transition-all shadow-md"
                                            >
                                                Explorar Produtos
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {products.filter(p => favorites.includes(p.id)).map((product) => (
                                                <div 
                                                    key={product.id} 
                                                    className="group bg-gray-50 rounded-3xl overflow-hidden border border-pink-50 hover:shadow-xl hover:shadow-pink-100/50 transition-all cursor-pointer"
                                                    onClick={() => navigate(`/produto/${product.id}`)}
                                                >
                                                    <div className="aspect-square relative overflow-hidden">
                                                        <img 
                                                            src={product.image} 
                                                            alt={product.name} 
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                        <div className="absolute top-3 right-3">
                                                            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-pink-500 shadow-sm">
                                                                <Heart size={16} fill="currentColor" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <p className="text-gray-800 font-bold text-sm mb-1 line-clamp-1">{product.name}</p>
                                                        <p className="text-pink-500 font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
