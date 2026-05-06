import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { addOrder } from '@/lib/sheets';
import { ArrowRight, ShoppingBag, MapPin, User, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
    const { items, total, clearCart } = useCart();
    const { user, updateUserProfile } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cep: '',
        address: '',
        number: '',
        complement: '',
        city: '',
        state: '',
        paymentMethod: 'pix'
    });

    // Pre-fill from profile
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.displayName || prev.name,
                email: user.email || prev.email,
                phone: user.whatsapp || prev.phone,
                cep: user.cep || prev.cep,
                address: user.endereco || prev.address,
                number: user.numero || prev.number,
                complement: user.complemento || prev.complement,
                city: user.cidade || prev.city,
                state: user.estado || prev.state,
            }));
        }
    }, [user]);

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
        
        if (name === 'phone') {
            setFormData(prev => ({ ...prev, [name]: maskPhone(value) }));
        } else if (name === 'cep') {
            const cep = value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').substring(0, 9);
            setFormData(prev => ({ ...prev, [name]: cep }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleBlurCep = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                toast.error("CEP não encontrado.");
                return;
            }

            setFormData(prev => ({
                ...prev,
                address: data.logradouro,
                city: data.localidade,
                state: data.uf,
                // Keep existing numbers/complements if any, typically user fills these
            }));
            toast.success("Endereço preenchido!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao buscar CEP.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error("Seu carrinho está vazio!");
            return;
        }

        // Validate basic fields
        if (!formData.name || !formData.phone || !formData.address) {
            toast.error("Por favor, preencha os campos obrigatórios.");
            return;
        }

        // 1. Generate Order ID
        const orderId = Date.now().toString();
        const shortId = orderId.slice(-6);

        // 2. Construct WhatsApp Message
        const phoneNumber = "5527997948142";
        let message = `✨ *Novo Pedido - Déia Art Laços* 🎀\n`;
        message += `🆔 *ID:* #${shortId}\n\n`;
        message += `👤 *Cliente:* ${formData.name}\n`;
        message += `📱 *Telefone:* ${formData.phone}\n\n`;
        message += `🛒 *Itens do Pedido:*\n`;

        items.forEach(item => {
            message += `▫️ ${item.quantity}x ${item.name} (${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)})\n`;
        });

        message += `\n💰 *Total:* ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}\n\n`;
        message += `📍 *Endereço de Entrega:*\n`;
        message += `${formData.address}, ${formData.number}\n`;
        if (formData.complement) message += `${formData.complement}\n`;
        message += `${formData.city} - ${formData.state}\n`;
        message += `CEP: ${formData.cep}\n\n`;
        message += `💳 *Pagamento:* ${formData.paymentMethod === 'pix' ? 'PIX ✨' : 'Cartão de Crédito 💳'}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

        // 3. Create Order Object
        const newOrder = {
            id: orderId,
            date: new Date().toISOString(),
            items: items,
            total: total,
            status: 'Enviado para WhatsApp',
            paymentMethod: formData.paymentMethod
        };

        // 4. Save Order to Google Sheets (per-user)
        try {
            if (!user) {
                throw new Error("User not authenticated");
            }

            console.log("Tentando salvar pedido no Sheets...", newOrder);
            await addOrder({
                userId: user.uid,
                date: newOrder.date,
                items: newOrder.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image
                })),
                total: newOrder.total,
                status: newOrder.status,
                paymentMethod: newOrder.paymentMethod
            });
            console.log("Pedido salvo com sucesso no Google Sheets!");

            // 4.1 Update User Profile with these details for next time
            await updateUserProfile({
                displayName: formData.name,
                whatsapp: formData.phone,
                cep: formData.cep,
                endereco: formData.address,
                numero: formData.number,
                complemento: formData.complement,
                cidade: formData.city,
                estado: formData.state
            });
        } catch (error) {
            console.error("Erro ao salvar pedido ou atualizar perfil:", error);
            toast.error("Erro ao salvar histórico do pedido.");
        }

        // 5. Open WhatsApp
        window.open(whatsappUrl, '_blank');

        // 6. Feedback & Cleanup
        toast.success("Pedido gerado! Enviando para o WhatsApp...");

        // Short delay to ensure localStorage operations complete before any potential state flush
        setTimeout(() => {
            clearCart();
        }, 500);
    };

    return (
        <div className="min-h-screen bg-cream pt-24 pb-12 font-sans">
            <div className="container mx-auto px-6 max-w-6xl">
                <h1 className="text-4xl font-handwritten font-bold text-gray-800 mb-8 text-center md:text-left">
                    Finalizar Compra
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Form Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        {/* Personal Info */}
                        <section className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                                    <User size={18} />
                                </span>
                                Dados Pessoais
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            placeholder="(11) 99999-9999"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Address */}
                        <section className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                                    <MapPin size={18} />
                                </span>
                                Endereço de Entrega
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                                        <input
                                            type="text"
                                            name="cep"
                                            value={formData.cep}
                                            onChange={handleInputChange}
                                            onBlur={handleBlurCep}
                                            placeholder="00000-000"
                                            maxLength={9}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="col-span-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                        <input
                                            type="text"
                                            name="number"
                                            required
                                            value={formData.number}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                                        <input
                                            type="text"
                                            name="complement"
                                            value={formData.complement}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment */}
                        <section className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                                    <CreditCard size={18} />
                                </span>
                                Forma de Pagamento
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`border-2 rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${formData.paymentMethod === 'pix' ? 'border-pink-500 bg-pink-50' : 'border-gray-100 hover:border-pink-200'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="pix"
                                        checked={formData.paymentMethod === 'pix'}
                                        onChange={handleInputChange}
                                        className="text-pink-500 focus:ring-pink-500"
                                    />
                                    <span className="font-bold text-gray-700">PIX</span>
                                </label>
                                <label className={`border-2 rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-pink-500 bg-pink-50' : 'border-gray-100 hover:border-pink-200'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={formData.paymentMethod === 'card'}
                                        onChange={handleInputChange}
                                        className="text-pink-500 focus:ring-pink-500"
                                    />
                                    <span className="font-bold text-gray-700">Cartão de Crédito</span>
                                </label>
                            </div>
                        </section>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="bg-white rounded-3xl p-8 shadow-soft border border-pink-50 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <ShoppingBag size={20} className="text-pink-500" /> Resumo do Pedido
                            </h2>

                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-4 py-2 border-b border-gray-50 last:border-0">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-gray-500">Qtd: {item.quantity}</span>
                                                <span className="font-bold text-pink-500">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {items.length === 0 && (
                                    <p className="text-gray-500 text-center py-4">Carrinho vazio.</p>
                                )}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-dashed border-gray-200">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Frete</span>
                                    <span className="text-xs text-gray-400">(Calculado no WhatsApp)</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-100">
                                    <span>Total</span>
                                    <span className="text-pink-500">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={items.length === 0 || !formData.name || !formData.phone || !formData.address || !formData.number || !formData.city || !formData.state || formData.cep.replace(/\D/g, '').length !== 8}
                                className="w-full mt-8 py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-200 hover:shadow-green-300 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                            >
                                <span className="text-lg">Finalizar Pedido no WhatsApp</span>
                                <ArrowRight size={20} />
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
                                Ao clicar em finalizar, você será redirecionado para o WhatsApp com os detalhes do seu pedido para combinarmos a entrega e pagamento.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
