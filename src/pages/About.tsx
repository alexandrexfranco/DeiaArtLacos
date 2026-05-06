import { motion } from 'framer-motion';
import { Heart, Star, Sparkles, User } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-cream font-sans pt-24 pb-12">
            {/* Hero Section */}
            <section className="container mx-auto px-6 mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-2 bg-pink-100 text-pink-500 rounded-full font-bold text-sm mb-6 uppercase tracking-wider">
                        Nossa História
                    </span>
                    <h1 className="text-4xl md:text-6xl font-handwritten font-bold text-gray-800 mb-6">
                        Transformando Fitas em <span className="text-pink-500">Sonhos</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        A Déia Art Laços nasceu do desejo de eternizar momentos especiais através de acessórios únicos, feitos com amor de mãe para mãe.
                    </p>
                </motion.div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-6 mb-24">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Decorative background blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-pink-200/30 rounded-full blur-3xl -z-10" />

                        <div className="relative rounded-4xl overflow-hidden shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-700">
                            <img
                                src="/assets/images/about/sobre.webp"
                                alt="Andréia - Artesã da Déia Art Laços"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg border border-pink-100 hidden md:block animate-bounce-slow">
                            <span className="text-4xl">✂️</span>
                            <p className="font-bold text-gray-800 text-sm mt-1">Feito à mão</p>
                        </div>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mb-4">
                                <User size={24} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Quem é a Déia?</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Olá! Sou a Andréia, mas pode me chamar de Déia. Sou mãe, artesã e apaixonada pelo universo infantil.
                                Tudo começou quando busquei laços que fossem confortáveis para minha própria filha e não encontrei opções que unissem beleza e conforto na medida certa.
                            </p>
                        </div>

                        <div>
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mb-4">
                                <Sparkles size={24} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">A Magia do Feito à Mão</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Cada peça que sai do meu ateliê é única. Seleciono pessoalmente as melhores fitas, os apliques mais delicados e testo cada acabamento para garantir que não machuque a cabecinha da sua princesa.
                                Não vendemos apenas acessórios, entregamos autoestima e carinho em forma de laço.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-white py-20 border-y border-pink-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-pink-500 font-handwritten text-2xl font-bold">Nossos Pilares</span>
                        <h2 className="text-4xl font-bold text-gray-800 mt-2">Por que escolher Déia Art Laços?</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Heart className="w-8 h-8 text-white" />,
                                title: "Amor em Cada Ponto",
                                description: "Produção 100% artesanal, feita com paciência, dedicação e muito amor envolvido."
                            },
                            {
                                icon: <Star className="w-8 h-8 text-white" />,
                                title: "Qualidade Premium",
                                description: "Materiais importados e de primeira linha. Durabilidade e beleza que impressionam."
                            },
                            {
                                icon: <Sparkles className="w-8 h-8 text-white" />,
                                title: "Conforto Garantido",
                                description: "Acabamentos pensados para não apertar, não marcar e garantir o sorriso da sua pequena."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="bg-pink-50 rounded-3xl p-8 hover:shadow-lg transition-all text-center group"
                            >
                                <div className="w-16 h-16 bg-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
