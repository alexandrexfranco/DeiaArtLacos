import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, Heart } from 'lucide-react';

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
                            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-400 hover:bg-pink-500 hover:text-white transition-all shadow-sm">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-400 hover:bg-pink-500 hover:text-white transition-all shadow-sm">
                                <Facebook className="w-5 h-5" />
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
                                <Phone className="w-5 h-5 text-pink-400" />
                                <span>(11) 99999-9999</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-pink-400" />
                                <span>contato@deiaartlacos.com.br</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pink-400" /> Novidades
                        </h4>
                        <p className="text-gray-600 mb-4 text-sm">
                            Receba ofertas exclusivas e descontos especiais!
                        </p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Seu melhor e-mail"
                                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                            />
                            <button className="w-full bg-pink-400 text-white font-bold py-3 rounded-xl hover:bg-pink-500 transition-colors">
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
