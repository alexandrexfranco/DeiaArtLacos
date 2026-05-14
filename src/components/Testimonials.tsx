import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Testimonial {
    id: string | number;
    name: string;
    role: string;
    content: string;
    rating: number;
    image: string;
}

const fallbackTestimonials: Testimonial[] = [
    {
        id: 1,
        name: "Ana Julia",
        role: "Mãe da Sofia",
        content: "Amei o laço! Acabamento impecável e chegou super rápido. A Sofia não quer tirar mais da cabeça!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Fernanda Lima",
        role: "Mãe da Alice",
        content: "Produtos maravilhosos. Dá para sentir o carinho em cada detalhe. O atendimento também foi incrível.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Carla Dias",
        role: "Mãe da Beatriz",
        content: "Comprei para o batizado da minha filha e ficou perfeito. Muito delicado e confortável, não aperta a cabecinha.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1554151228-14d9def656ec?q=80&w=150&auto=format&fit=crop"
    }
];

export function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const { data, error } = await supabase
                    .from('testimonials')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data && data.length > 0) {
                    setTestimonials(data);
                } else {
                    setTestimonials(fallbackTestimonials);
                }
            } catch (error) {
                console.error('Error fetching testimonials:', error);
                setTestimonials(fallbackTestimonials);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    if (isLoading) return null;
    return (
        <section className="py-20 bg-gradient-to-b from-white to-pink-50 overflow-hidden relative">
            {/* Decoration */}
            <div className="absolute top-10 left-10 text-pink-100 animate-pulse">
                <Quote size={120} className="transform -scale-x-100 opacity-50" />
            </div>
            <div className="absolute bottom-10 right-10 text-pink-100 animate-pulse delay-700">
                <Quote size={120} className="opacity-50" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-pink-500 font-handwritten text-2xl font-bold">Depoimentos</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">Mamães que Amam</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-soft border border-pink-100 flex flex-col items-center text-center hover:shadow-lg transition-all hover:-translate-y-1"
                        >
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-100 mb-6 shadow-sm">
                                <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />
                                ))}
                            </div>

                            <p className="text-gray-600 mb-6 italic leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            <div className="mt-auto">
                                <h4 className="font-bold text-gray-800 text-lg">{testimonial.name}</h4>
                                <span className="text-pink-500 text-sm font-medium">{testimonial.role}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
