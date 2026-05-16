import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function Footer() {
    return (
        <footer className="bg-pink-50 pt-16 pb-8 border-t border-pink-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-3xl font-handwritten text-pink-500 font-bold">Déia Art Laços</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Transformando fitas em sonhos. Laços feitos à mão com muito amor e carinho para sua princesa.
                        </p>
                        <div className="flex gap-4">
                            <a 
                                href="https://www.instagram.com/deiaartlacos" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-400 hover:bg-pink-500 hover:text-white transition-all shadow-sm"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pink-400" /> Institucional
                        </h4>
                        <ul className="space-y-3 text-gray-600">
                            <li><Link to="/sobre" className="hover:text-pink-500 transition-colors">Quem Somos</Link></li>
                            <li><Link to="/politica-troca" className="hover:text-pink-500 transition-colors">Trocas e Devoluções</Link></li>
                            <li><Link to="/privacidade" className="hover:text-pink-500 transition-colors">Política de Privacidade</Link></li>
                            <li><Link to="/politica-cookies" className="hover:text-pink-500 transition-colors">Política de Cookies</Link></li>
                            <li><Link to="/faq" className="hover:text-pink-500 transition-colors">Dúvidas Frequentes</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pink-400" /> Contato
                        </h4>
                        <ul className="space-y-4 text-gray-600">
                            <li className="flex items-center gap-3">
                                <MessageCircle className="w-5 h-5 text-pink-400" />
                                <a 
                                    href="https://wa.me/5527997948142" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-pink-500 transition-colors"
                                >
                                    (27) 99794-8142
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pink-400" /> Novidades
                        </h4>
                        <p className="text-gray-600 mb-4 text-sm">
                            Receba novidades e ofertas exclusivas no seu WhatsApp!
                        </p>
                        <form 
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                                const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
                                
                                if (!phone) return;

                                try {
                                    const { error } = await supabase.from('newsletter').insert({ name, phone });
                                    if (error) {
                                        if (error.code === '23505') {
                                            toast.error('Este número já está cadastrado!');
                                        } else {
                                            throw error;
                                        }
                                    } else {
                                        toast.success('Inscrição realizada com sucesso! 🎀');
                                        form.reset();
                                    }
                                } catch (error) {
                                    console.error('Error joining newsletter:', error);
                                    toast.error('Erro ao realizar inscrição. Tente novamente.');
                                }
                            }}
                            className="space-y-3"
                        >
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Seu nome"
                                className="w-full px-4 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                            />
                            <input
                                type="tel"
                                name="phone"
                                required
                                placeholder="(00) 00000-0000"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 11) {
                                        let formatted = value;
                                        if (value.length > 2) formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                                        if (value.length > 7) formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                                        e.target.value = formatted;
                                    }
                                }}
                                className="w-full px-4 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                            />
                            
                            <label className="flex items-start gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    required 
                                    className="mt-1 w-4 h-4 rounded border-pink-300 text-pink-500 focus:ring-pink-500"
                                />
                                <span className="text-[11px] text-gray-500 leading-tight">
                                    Li e concordo com a <Link to="/privacidade" className="text-pink-500 hover:underline">Política de Privacidade</Link>.
                                </span>
                            </label>

                            <button 
                                type="submit"
                                className="w-full bg-pink-400 text-white font-bold py-3 rounded-xl hover:bg-pink-500 transition-colors shadow-sm"
                            >
                                Quero receber!
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-pink-200 pt-8 text-center text-gray-500 text-sm flex flex-col md:flex-row items-center justify-center gap-2">
                    <span>© 2026 Déia Art Laços. Todos os direitos reservados.</span>
                    <span className="hidden md:inline">•</span>
                    <span className="flex items-center gap-1">
                        Feito com <Heart className="w-3 h-3 text-red-500 fill-current" /> por Você
                    </span>
                </div>
            </div>
        </footer>
    );
}
