import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signIn, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // Where did the user come from? Default to /perfil
    const from = (location.state as any)?.from?.pathname || '/perfil';

    // Redirect to admin if role is detected
    // This effect runs when 'isAdmin' updates in AuthContext (after DB check)
    useEffect(() => {
        if (isAdmin) {
            navigate('/admin');
        }
    }, [isAdmin, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        console.log('🚀 Iniciando processo de login no formulário...');

        // Timeout de segurança de 15 segundos
        const timeout = setTimeout(() => {
            if (isLoading) {
                setIsLoading(false);
                console.warn('⚠️ O login demorou demais e foi cancelado automaticamente.');
                // Note: We don't toast here because the user might still be waiting
            }
        }, 15000);

        try {
            await signIn(email, password);
            console.log('🏁 Processo de login finalizado. Redirecionando...');
            navigate(from, { replace: true });
        } catch (error) {
            console.error('❌ Erro capturado no handleSubmit:', error);
            // toast.error já é disparado no AuthContext
        } finally {
            clearTimeout(timeout);
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
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500 shadow-inner">
                                <Heart className="w-8 h-8 fill-current" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2 font-handwritten text-4xl">Bem-vindo(a)</h2>
                            <p className="text-gray-500">Faça login para continuar sua jornada mágica</p>
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

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-semibold text-gray-700">Senha</label>
                                    <Link to="/esqueceu-senha" className="text-xs text-pink-500 hover:text-pink-600 font-medium">Esqueceu?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-pink-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? 'Entrando...' : (
                                    <>
                                        Entrar <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm">
                                Não tem uma conta?{' '}
                                <Link to="/cadastro" className="text-pink-500 font-bold hover:text-pink-600 hover:underline">
                                    Cadastre-se
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
