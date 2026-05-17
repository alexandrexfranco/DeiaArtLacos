import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("As senhas não coincidem!"); // Better to use a toast here
            return;
        }

        setIsLoading(true);
        try {
            await signUp(email, password, name);
            navigate('/perfil');
        } catch (error) {
            // Error handling is done in AuthContext
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 flex items-center justify-center relative overflow-hidden bg-pink-50">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-pink-200/30 rounded-full blur-3xl animate-float" />
                <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-gold-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
            </div>

            <div className="container mx-auto px-4 relative z-10 font-sans">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md mx-auto"
                >
                    <div className="glass-card rounded-3xl p-8 md:p-10 border border-white/60">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500 shadow-inner">
                                <Sparkles className="w-8 h-8 fill-current" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2 font-handwritten text-4xl">Crie sua Conta</h2>
                            <p className="text-gray-500">Junte-se ao nosso mundo encantado</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-pink-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="Seu nome"
                                    />
                                </div>
                            </div>

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
                                <label className="text-sm font-semibold text-gray-700 ml-1">Senha</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/50 border border-pink-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-pink-50"
                                        tabIndex={-1}
                                        aria-label={showPassword ? "Esconder senha" : "Ver senha"}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Confirmar Senha</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/50 border border-pink-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-pink-50"
                                        tabIndex={-1}
                                        aria-label={showConfirmPassword ? "Esconder confirmação de senha" : "Ver confirmação de senha"}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            
                            <label className="flex items-start gap-3 cursor-pointer group mt-4">
                                <div className="mt-0.5 relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        required 
                                        className="w-5 h-5 rounded border-pink-200 text-pink-500 focus:ring-pink-400 focus:ring-offset-0 cursor-pointer"
                                    />
                                </div>
                                <span className="text-xs text-gray-500 leading-relaxed">
                                    Li e concordo com a <Link to="/privacidade" className="text-pink-500 font-semibold hover:underline">Política de Privacidade</Link> da Déia Art Laços.
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                            >
                                {isLoading ? 'Criando conta...' : (
                                    <>
                                        Criar Conta <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm">
                                Já tem uma conta?{' '}
                                <Link to="/login" className="text-pink-500 font-bold hover:text-pink-600 hover:underline">
                                    Faça Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
