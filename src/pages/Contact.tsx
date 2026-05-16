import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Construct WhatsApp message
        const message = `✨ *Nova Mensagem do Site* 💌\n\n` +
            `👤 *Nome:* ${formData.name}\n` +
            `📧 *Email:* ${formData.email}\n` +
            `📝 *Assunto:* ${formData.subject}\n\n` +
            `💬 *Mensagem:*\n${formData.message}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=5527997948142&text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        toast.success('Redirecionando para o WhatsApp...');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-cream pt-24 pb-12 font-sans">
            <div className="container mx-auto px-6 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1 bg-pink-100 text-pink-500 rounded-full text-sm font-bold mb-4">
                        Fale Conosco
                    </span>
                    <h1 className="text-4xl md:text-5xl font-handwritten font-bold text-gray-800 mb-6">
                        Vamos conversar?
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Adoramos ouvir nossas clientes! Seja para tirar dúvidas, fazer um orçamento personalizado ou apenas mandar um oi.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="bg-white p-8 rounded-3xl shadow-soft border border-pink-50 hover:shadow-lg transition-all group">
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mb-4 group-hover:scale-110 transition-transform">
                                <MessageCircle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">WhatsApp</h3>
                            <p className="text-gray-500 mb-4">Atendimento rápido e personalizado.</p>
                            <a href="https://wa.me/5527997948142" target="_blank" rel="noopener noreferrer" className="text-pink-500 font-bold hover:text-pink-600 flex items-center gap-2">
                                Chamar no Zap <Send size={16} />
                            </a>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-soft border border-pink-50 hover:shadow-lg transition-all group">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
                                <Instagram size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Instagram</h3>
                            <p className="text-gray-500 mb-4">Siga nosso dia a dia e novidades.</p>
                            <a href="https://www.instagram.com/deiaartlacos" target="_blank" rel="noopener noreferrer" className="text-purple-500 font-bold hover:text-purple-600 flex items-center gap-2">
                                @deiaartlacos <Send size={16} />
                            </a>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-soft border border-pink-50 hover:shadow-lg transition-all group">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                                <Mail size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Email</h3>
                            <p className="text-gray-500 mb-4">Para parcerias e orçamentos detalhados.</p>
                            <a href="mailto:deiaartlacos@gmail.com" className="text-blue-500 font-bold hover:text-blue-600 flex items-center gap-2">
                                deiaartlacos@gmail.com <Send size={16} />
                            </a>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-soft border border-pink-50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 blur-3xl pointer-events-none"></div>

                            <h2 className="text-2xl font-bold text-gray-800 mb-8 relative z-10">Envie uma mensagem</h2>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600 ml-1">Seu Nome</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-pink-200 focus:outline-none transition-all placeholder-gray-300 font-medium"
                                            placeholder="Maria Silva"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600 ml-1">Seu Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-pink-200 focus:outline-none transition-all placeholder-gray-300 font-medium"
                                            placeholder="maria@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600 ml-1">Assunto</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-pink-200 focus:outline-none transition-all placeholder-gray-300 font-medium"
                                        placeholder="Orçamento para aniversário"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600 ml-1">Sua Mensagem</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-pink-200 focus:outline-none transition-all placeholder-gray-300 font-medium resize-none"
                                        placeholder="Olá! Gostaria de saber mais sobre..."
                                    ></textarea>
                                </div>
                                
                                <label className="flex items-center gap-3 cursor-pointer group py-2">
                                    <input 
                                        type="checkbox" 
                                        required 
                                        className="w-5 h-5 rounded border-gray-200 text-pink-500 focus:ring-pink-400 focus:ring-offset-0 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-500 font-medium">
                                        Li e concordo com a <a href="/privacidade" target="_blank" className="text-pink-500 hover:underline">Política de Privacidade</a>.
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-pink-500 text-white font-bold rounded-2xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-200 hover:shadow-pink-300 flex items-center justify-center gap-2 transform active:scale-95"
                                >
                                    Enviar Mensagem via WhatsApp <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
