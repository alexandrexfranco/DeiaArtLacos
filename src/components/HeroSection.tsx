import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function HeroSection() {
    const [bannerUrl, setBannerUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const { data } = await supabase.from('settings').select('value').eq('key', 'heroBanner').maybeSingle();
                if (data?.value) {
                    setBannerUrl(data.value);
                }
            } catch (error) {
                console.error("Error loading banner:", error);
            }
        };
        fetchBanner();
    }, []);

    const isVideo = bannerUrl?.match(/\.(mp4|webm)$/i) || bannerUrl?.includes('uc?') || bannerUrl?.includes('export=');

    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Background Media */}
            <div className="absolute inset-0 z-0">
                {/* Overlay Escuro para contraste */}
                <div className="absolute inset-0 bg-black/40 z-10" />
                {bannerUrl ? (
                    isVideo ? (
                        <video
                            key={bannerUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src={bannerUrl.replace('export=download&', '')} type="video/mp4" />
                        </video>
                    ) : (
                        <img
                            src={bannerUrl}
                            alt="Hero Banner"
                            className="w-full h-full object-cover"
                        />
                    )
                ) : (
                    // Default Fallback
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover"
                        poster="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1964&auto=format&fit=crop"
                    >
                        <source src="/assets/videos/hero.mp4" type="video/mp4" />
                    </video>
                )}
            </div>

            {/* Content */}
            <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-pink-500 font-bold text-sm mb-6 shadow-sm border border-pink-100">
                        ✨ Feito à mão com amor
                    </span>

                    <h1 className="text-4xl md:text-7xl font-handwritten text-white drop-shadow-lg mb-6 leading-tight">
                        Realçando a beleza da <br />
                        <span className="text-pink-500 text-glow text-shadow-strong">sua princesa</span>
                    </h1>

                    <p className="text-base md:text-xl text-white/90 font-medium mb-10 max-w-2xl mx-auto drop-shadow-md px-2">
                        Laços artesanais exclusivos, criados para transformar momentos simples em memórias inesquecíveis.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/loja" className="px-8 py-4 bg-pink-500 text-white rounded-full font-bold text-lg hover:bg-pink-600 hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                            Ver Coleção <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a
                            href="https://api.whatsapp.com/send?phone=5527997948142&text=Ol%C3%A1!%20%E2%9C%A8%20Gostaria%20de%20fazer%20uma%20encomenda%20personalizada.%20%F0%9F%8E%80"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-white text-pink-600 rounded-full font-bold text-lg hover:bg-pink-50 transition-all shadow-lg"
                        >
                            Encomendar
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Floating Elements */}
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-1/4 left-10 md:left-20 w-16 h-16 bg-white/30 backdrop-blur-md rounded-full z-20"
            />
            <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-10 md:right-20 w-24 h-24 bg-pink-400/20 backdrop-blur-md rounded-full z-20"
            />
        </section>
    );
}
