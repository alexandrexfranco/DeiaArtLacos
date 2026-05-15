import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Heart, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { resetPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        try {
            await resetPassword(email);
            setEmail('');
        } catch (error) {
            console.error('Erro ao resetar senha:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 flex items-center justify-center relative overflow-hidden bg-pink-50">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-pink-200/30 rounded-full blur-3xl animate-float" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-gold-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-pink-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
            </div>

            <div className="container mx-auto px-4 relative z-10 font-sans">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md mx-auto"
                >
                    <div className="glass-card rounded-3xl p-8 md:p-10 border border-white/60">
                        <div className="mb-6">
                            <Link to="/login" className="inline-flex items-center text-sm text-pink-500 hover:text-pink-600 font-medium transition-colors group">
                                <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                                Voltar para o Login
                            </Link>
                        </div>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500 shadow-inner">
                                <Heart className="w-8 h-8 fill-current" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2 font-handwritten text-4xl">Esqueci a Senha</h2>
                            <p className="text-gray-500">Insira seu e-mail para receber um link de recuperação</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-pink-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? 'Enviando...' : (
                                    <>
                                        Enviar Link <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
