import { useState, useEffect } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Package, Heart, DollarSign, TrendingUp, Database, RefreshCw, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function Dashboard() {
    const { products, isLoading, refreshProducts } = useProducts();
    const [isSeeding, setIsSeeding] = useState(false);
    const [pendingReviews, setPendingReviews] = useState(0);

    useEffect(() => {
        fetchPendingReviews();
    }, []);

    const fetchPendingReviews = async () => {
        try {
            const { count, error } = await supabase
                .from('reviews')
                .select('*', { count: 'exact', head: true })
                .eq('is_approved', false);

            if (error) throw error;
            setPendingReviews(count || 0);
        } catch (error) {
            console.error('Error fetching pending reviews:', error);
        }
    };

    const seedDatabase = async () => {
        if (!confirm('Isso vai adicionar produtos de exemplo ao Google Sheets. Continuar?')) return;

        setIsSeeding(true);
        try {
            const sampleProducts = [
                {
                    name: 'Laço Bailarina',
                    description: 'Laço clássico em fita de gorgurão, perfeito para aulas de ballet e ocasiões especiais.',
                    price: 29.90,
                    category: 'Crianças',
                    size: 'M',
                    type: 'Laço',
                    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2670&auto=format&fit=crop',
                    likes: 124,
                    isNew: false,
                    isBestSeller: true
                },
                {
                    name: 'Tiara Coroa de Flores',
                    description: 'Tiara delicada com mini flores em tons pastéis, ideal para festas e ensaios fotográficos.',
                    price: 59.90,
                    category: 'Adultos',
                    size: 'G',
                    type: 'Tiara',
                    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2670&auto=format&fit=crop',
                    likes: 203,
                    isNew: true,
                    isBestSeller: true
                },
                {
                    name: 'Kit Escolar Rosa',
                    description: 'Conjunto com 3 laços em tons de rosa, perfeito para o dia a dia escolar.',
                    price: 39.90,
                    category: 'Crianças',
                    size: 'P',
                    type: 'Kit',
                    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2787&auto=format&fit=crop',
                    likes: 87,
                    isNew: false,
                    isBestSeller: false
                },
                {
                    name: 'Laço Bailarina Premium',
                    description: 'Versão premium do laço bailarina com acabamento em cetim e strass.',
                    price: 45.00,
                    category: 'Crianças',
                    size: 'G',
                    type: 'Laço',
                    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2670&auto=format&fit=crop',
                    likes: 156,
                    isNew: true,
                    isBestSeller: false
                },
                {
                    name: 'Faixinha RN Flor',
                    description: 'Faixinha delicada para recém-nascidos com mini flor de tecido.',
                    price: 19.90,
                    category: 'Bebês',
                    size: 'Mini',
                    type: 'Faixa',
                    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2680&auto=format&fit=crop',
                    likes: 245,
                    isNew: false,
                    isBestSeller: true
                }
            ];

            const { error } = await supabase.from('products').insert(sampleProducts);
            if (error) throw error;

            toast.success('Produtos de exemplo adicionados ao Supabase!');
            await refreshProducts();
        } catch (error) {
            console.error('Erro ao popular banco:', error);
            toast.error(`Erro: ${error}`);
        } finally {
            setIsSeeding(false);
        }
    };

    const stats = [
        {
            label: 'Total de Produtos',
            value: products.length,
            icon: Package,
            color: 'bg-blue-500'
        },
        {
            label: 'Produtos em Destaque',
            value: products.filter(p => p.isBestSeller).length,
            icon: TrendingUp,
            color: 'bg-green-500'
        },
        {
            label: 'Total de Curtidas',
            value: products.reduce((acc, curr) => acc + curr.likes, 0),
            icon: Heart,
            color: 'bg-pink-500'
        },
        {
            label: 'Valor do Estoque (Est.)',
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                products.reduce((acc, curr) => acc + curr.price, 0)
            ),
            icon: DollarSign,
            color: 'bg-purple-500'
        },
        {
            label: 'Avaliações Pendentes',
            value: pendingReviews,
            icon: MessageSquare,
            color: pendingReviews > 0 ? 'bg-amber-500' : 'bg-gray-400',
            isAlert: pendingReviews > 0
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">Visão Geral</h2>

                <div className="flex gap-3">
                    {/* Refresh button */}
                    <button
                        onClick={() => {
                            refreshProducts();
                            fetchPendingReviews();
                        }}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
                        title="Recarregar dados do Supabase"
                    >
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                        Atualizar
                    </button>

                    {/* Seed button — only shown when no products */}
                    {products.length === 0 && !isLoading && (
                        <button
                            onClick={seedDatabase}
                            disabled={isSeeding}
                            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-200 disabled:opacity-50"
                        >
                            {isSeeding ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Adicionando...
                                </>
                            ) : (
                                <>
                                    <Database size={20} />
                                    Popular com Exemplos
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shadow-gray-200`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Google Sheets badge */}
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 w-fit">
                <span>📊</span>
                <span>Banco de dados: <strong>Supabase</strong> — dados em tempo real</span>
            </div>

            {/* Recent Products Table Preview */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Produtos Recentes</h3>
                </div>
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500 mx-auto mb-3"></div>
                        <p className="text-gray-400">Carregando do Supabase...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4">Produto</th>
                                    <th className="px-6 py-4">Categoria</th>
                                    <th className="px-6 py-4">Preço</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.slice(0, 5).map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-medium text-gray-700">{product.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-700">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {product.isNew && <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-bold">Novo</span>}
                                                {product.isBestSeller && <span className="px-2 py-1 bg-amber-100 text-amber-600 text-xs rounded-full font-bold">Destaque</span>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                            Nenhum produto. Clique em "Popular com Exemplos" para começar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
