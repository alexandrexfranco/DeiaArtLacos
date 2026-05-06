import { motion } from 'framer-motion';
import { RefreshCw, ShieldCheck, Clock } from 'lucide-react';

export default function ExchangePolicy() {
    return (
        <div className="min-h-screen bg-cream font-sans pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">

                {/* Header */}
                <div className="mb-12">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-handwritten font-bold text-gray-800 mb-4">
                            Trocas e Devoluções
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Queremos que sua experiência com a Déia Art Laços seja mágica. Se precisar trocar, estamos aqui para ajudar!
                        </p>
                    </motion.div>
                </div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-pink-50 space-y-10"
                >
                    {/* Section 1 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">Direito de Arrependimento</h2>
                            <p className="text-gray-600 leading-relaxed">
                                De acordo com o Código de Defesa do Consumidor, você tem até <strong>7 (sete) dias corridos</strong> após o recebimento do produto para solicitar a devolução por arrependimento. O produto deve estar sem uso, em sua embalagem original e com todos os acessórios.
                            </p>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">Produtos com Defeito</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Garantimos a qualidade de nossas peças! Caso receba um produto com defeito de fabricação, você tem até <strong>30 (trinta) dias</strong> para entrar em contato. Faremos a troca por um produto igual ou, na falta deste, a devolução do valor ou um vale-compras.
                            </p>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
                            <RefreshCw size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">Como Solicitar</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Para iniciar um processo de troca ou devolução, entre em contato conosco através do email ou WhatsApp informando:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 bg-gray-50 p-4 rounded-xl">
                                <li>Número do Pedido</li>
                                <li>Nome Completo</li>
                                <li>Motivo da Troca/Devolução</li>
                                <li>Foto do produto (em caso de defeito)</li>
                            </ul>
                            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                <a
                                    href="mailto:contato@deiaartlacos.com.br"
                                    className="px-6 py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-colors text-center shadow-lg hover:shadow-pink-300"
                                >
                                    Enviar E-mail
                                </a>
                                <a
                                    href="#"
                                    className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors text-center shadow-lg hover:shadow-green-300"
                                >
                                    Falar no WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Important Note */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>
                        <strong>Importante:</strong> Não aceitamos devolução de produtos personalizados (ex: com nome da criança), exceto em caso de defeito de fabricação.
                    </p>
                </div>
            </div>
        </div>
    );
}
