import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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

export default function MyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const { user } = useAuth();

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
                    .order('date', { ascending: false });
                
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

    return (
        <div className="min-h-screen bg-cream pt-24 pb-12 font-sans">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="flex items-center gap-3 mb-8">
                    <span className="p-3 bg-pink-100 rounded-full text-pink-500">
                        <Package size={24} />
                    </span>
                    <h1 className="text-3xl md:text-4xl font-handwritten font-bold text-gray-800">
                        Meus Pedidos
                    </h1>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-pink-50">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-6">
                            <ShoppingBag size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Você ainda não tem pedidos</h2>
                        <p className="text-gray-500 mb-8">Que tal escolher algo especial para sua princesa?</p>
                        <Link
                            to="/loja"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-pink-500 text-white font-bold rounded-full hover:bg-pink-600 transition-all shadow-lg shadow-pink-200"
                        >
                            Ver Coleção <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Order Header */}
                                <div className="bg-pink-50/50 p-4 flex flex-wrap justify-between items-center gap-4 border-b border-pink-50">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar size={16} />
                                            <span className="text-sm font-medium">{new Date(order.date).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        <div className="text-xs font-bold px-3 py-1 bg-green-100 text-green-600 rounded-full border border-green-200">
                                            {order.status}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-500 block">Total do Pedido</span>
                                        <span className="font-bold text-gray-800">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-4 space-y-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                                                <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                                            </div>
                                            <div className="text-sm font-medium text-pink-500">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="p-4 pt-0 flex justify-between items-center text-xs text-gray-400">
                                    <span>Pagamento: {order.paymentMethod === 'pix' ? 'PIX' : 'Cartão'}</span>
                                    <span>ID: #{order.id.slice(-6)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
