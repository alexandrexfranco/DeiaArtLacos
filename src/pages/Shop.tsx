import { useState, useMemo } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { ProductCard } from '@/components/ProductCard';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Shop() {
    const { products, categories } = useProducts();
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

    const filteredProducts = useMemo(() => {
        let items = products;

        // Filter by Category
        if (selectedCategory !== 'Todos') {
            items = items.filter(p => p.category === selectedCategory);
        }

        // Filter by Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            items = items.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // Sort
        if (sortBy === 'price-asc') {
            items = [...items].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            items = [...items].sort((a, b) => b.price - a.price);
        }

        return items;
    }, [products, selectedCategory, searchQuery, sortBy]);

    return (
        <div className="min-h-screen bg-cream pt-24 pb-12 font-sans">
            <div className="container mx-auto px-6">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-handwritten text-pink-500">
                        Nossa Loja
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore nossa coleção completa de laços feitos à mão com muito amor e carinho para sua princesa.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50 mb-10">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">

                        {/* Categories */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-bold text-sm border ${selectedCategory === category
                                            ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                                            : 'bg-white text-gray-600 border-pink-100 hover:border-pink-300'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Search & Sort */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar laços..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50"
                                />
                            </div>

                            <div className="relative">
                                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="pl-9 pr-8 py-2 w-full rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50 appearance-none text-gray-600 cursor-pointer"
                                >
                                    <option value="default">Relevância</option>
                                    <option value="price-asc">Menor Preço</option>
                                    <option value="price-desc">Maior Preço</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter className="w-10 h-10 text-pink-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Nenhum laço encontrado</h3>
                        <p className="text-gray-500">Tente mudar os filtros ou sua busca.</p>
                        <button
                            onClick={() => {
                                setSelectedCategory('Todos');
                                setSearchQuery('');
                            }}
                            className="mt-4 text-pink-500 font-bold hover:underline"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
