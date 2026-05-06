import { HeroSection } from '@/components/HeroSection';
import { ProductCard } from '@/components/ProductCard';
import { Testimonials } from '@/components/Testimonials';

import { useProducts } from '@/contexts/ProductContext';

export default function Home() {
    const { products, isLoading } = useProducts();
    
    // Pegar os produtos marcados como Best Seller (Mais Vendidos)
    const featuredProducts = products.filter(p => p.isBestSeller).slice(0, 8);

    return (
        <div className="bg-cream min-h-screen font-sans">
            <HeroSection />

            {/* Featured Section */}
            <section className="py-20 px-6 container mx-auto">
                <div className="text-center mb-16">
                    <span className="text-pink-500 font-handwritten text-2xl font-bold">Destaques</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">Mais Amados do Mês</h2>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                )}
            </section>

            <Testimonials />

            {/* Video/About Section Placeholder */}
            <section className="py-20 bg-pink-50 relative overflow-hidden">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="rounded-4xl overflow-hidden shadow-soft h-[500px]">
                        <img src="/assets/images/about/sobre-home.webp" alt="Sobre a Déia Laços" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-4xl font-handwritten text-pink-500 font-bold">Por que escolher Déia Laços?</h3>
                        <h2 className="text-3xl font-bold text-gray-800">Conforto e Estilo em Cada Detalhe</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Nossa missão é criar acessórios que não só embelezam, mas que sejam confortáveis para o dia todo.
                            Utilizamos materiais hipoalergênicos e acabamentos suaves que não machucam.
                        </p>
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100">
                                <span className="text-3xl">🌿</span>
                                <h4 className="font-bold mt-2">Materiais Naturais</h4>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100">
                                <span className="text-3xl">💝</span>
                                <h4 className="font-bold mt-2">Feito à mão</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
