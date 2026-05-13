import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageCircle, Copy, Trash2, Search, Download, Package } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Subscriber {
    id: string;
    email?: string;
    phone: string;
    name: string;
    created_at: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
}

export default function NewsletterManager() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isSharing, setIsSharing] = useState(false);

    useEffect(() => {
        fetchSubscribers();
        fetchProducts();
    }, []);

    async function fetchSubscribers() {
        try {
            const { data, error } = await supabase
                .from('newsletter')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubscribers(data || []);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            toast.error('Erro ao carregar inscritos.');
        } finally {
            setLoading(false);
        }
    }

    async function fetchProducts() {
        try {
            const { data, error } = await supabase.from('products').select('id, name, price, images');
            if (!error) setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    async function deleteSubscriber(id: string) {
        if (!confirm('Tem certeza que deseja remover este contato?')) return;

        try {
            const { error } = await supabase
                .from('newsletter')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setSubscribers(subscribers.filter(s => s.id !== id));
            toast.success('Contato removido com sucesso.');
        } catch (error) {
            console.error('Error deleting subscriber:', error);
            toast.error('Erro ao remover contato.');
        }
    }

    function copyAllPhones() {
        const phones = subscribers.map(s => s.phone).join(', ');
        navigator.clipboard.writeText(phones);
        toast.success('Todos os números foram copiados para a área de transferência!');
    }

    function sendWhatsApp(subscriber: Subscriber) {
        if (!selectedProduct) {
            toast.error('Selecione um produto primeiro para enviar!');
            setIsSharing(true);
            return;
        }

        const message = `Olá ${subscriber.name || 'Princesa'}! ✨\n\nOlha que novidade linda acabou de chegar na Déia Art Laços: *${selectedProduct.name}*! 🎀\n\n💰 Valor: R$ ${selectedProduct.price.toFixed(2)}\n\n🔗 Veja mais fotos e detalhes aqui:\n${window.location.origin}/produto/${selectedProduct.id}\n\n📸 Aproveite para nos seguir no Instagram e acompanhar todas as nossas artes:\nhttps://www.instagram.com/deiaartlacos\n\nGostaria de reservar este para você? 😊`;
        
        const cleanPhone = subscriber.phone.replace(/\D/g, '');
        const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    const filteredSubscribers = subscribers.filter(s => 
        (s.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Marketing WhatsApp</h1>
                    <p className="text-gray-500">Gerencie seus contatos e envie novidades diretamente.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsSharing(!isSharing)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-sm ${isSharing ? 'bg-pink-600 text-white' : 'bg-white text-pink-500 border border-pink-100 hover:bg-pink-50'}`}
                    >
                        <Package size={18} />
                        {selectedProduct ? 'Trocar Produto' : 'Selecionar Produto'}
                    </button>
                    <button 
                        onClick={copyAllPhones}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                    >
                        <Copy size={18} />
                        Copiar Números
                    </button>
                </div>
            </div>

            {/* Product Selector Panel */}
            <AnimatePresence>
                {isSharing && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white p-6 rounded-xl border border-pink-100 shadow-sm space-y-4">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                <Package className="text-pink-500" size={20} />
                                Selecione o Produto para Divulgar
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {products.map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setIsSharing(false);
                                            toast.success(`Produto "${product.name}" selecionado!`);
                                        }}
                                        className={`p-2 rounded-lg border transition-all text-left group ${selectedProduct?.id === product.id ? 'border-pink-500 bg-pink-50' : 'border-gray-100 hover:border-pink-200'}`}
                                    >
                                        <div className="aspect-square rounded-md overflow-hidden mb-2 bg-gray-50">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Package size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs font-medium text-gray-700 truncate">{product.name}</p>
                                        <p className="text-xs text-pink-500 font-bold">R$ {product.price.toFixed(2)}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {selectedProduct && !isSharing && (
                <div className="bg-pink-50 border border-pink-200 p-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-white shadow-sm">
                            <img src={selectedProduct.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-pink-600">Produto Selecionado:</p>
                            <p className="text-gray-700 font-medium">{selectedProduct.name}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setSelectedProduct(null)}
                        className="text-gray-400 hover:text-pink-500 transition-colors"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                    <Search className="text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Pesquisar por nome ou telefone..."
                        className="bg-transparent border-none focus:ring-0 text-sm w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs uppercase text-gray-400 font-bold border-b border-gray-50">
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">WhatsApp</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-6 py-4">
                                            <div className="h-4 bg-gray-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredSubscribers.length > 0 ? (
                                filteredSubscribers.map((subscriber) => (
                                    <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 font-bold text-xs">
                                                    {subscriber.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <span className="text-gray-700 font-medium">{subscriber.name || 'Sem nome'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-600 font-mono text-sm">{subscriber.phone}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400">
                                            {new Date(subscriber.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => sendWhatsApp(subscriber)}
                                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                title="Enviar Novidade"
                                            >
                                                <MessageCircle size={18} />
                                            </button>
                                            <button 
                                                onClick={() => deleteSubscriber(subscriber.id)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <MessageCircle size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>Nenhum inscrito encontrado.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-50 text-xs text-gray-400 flex justify-between items-center">
                    <span>Total: {filteredSubscribers.length} contatos</span>
                    <div className="flex items-center gap-1 text-green-600 font-bold">
                        <Download size={14} />
                        <span>Dica: Use o botão verde para abrir o WhatsApp da cliente com a mensagem pronta.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
