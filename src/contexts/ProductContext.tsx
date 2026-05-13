import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    size?: string;
    type?: string;
    image: string;
    images?: string[];
    likes: number;
    isNew?: boolean;
    isBestSeller?: boolean;
}

interface ProductContextType {
    products: Product[];
    categories: string[];
    getProductById: (id: string) => Product | undefined;
    favorites: string[];
    toggleFavorite: (id: string) => void;
    isLoading: boolean;
    refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | null>(null);

export function useProducts() {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
}

export function ProductProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    const [favorites, setFavorites] = useState<string[]>([]);

    const refreshProducts = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.from('products').select('*');
            if (error) throw error;
            
            const mapped: Product[] = data || [];
            setProducts(mapped);
            localStorage.setItem('products_backup', JSON.stringify(mapped));
            console.log('✅ Products loaded from Supabase');
        } catch (error) {
            console.error('❌ Supabase connection failed:', error);
            toast.warning('Modo Offline: Usando dados locais');

            const cached = localStorage.getItem('products_backup');
            if (cached) {
                try {
                    setProducts(JSON.parse(cached));
                    console.log('📦 Products loaded from localStorage backup');
                } catch (e) {
                    console.error('Failed to parse localStorage backup:', e);
                    setProducts([]);
                }
            } else {
                setProducts([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshProducts();
    }, []);

    useEffect(() => {
        if (!user) {
            setFavorites([]);
            return;
        }

        const fetchFavorites = async () => {
            try {
                const { data, error } = await supabase
                    .from('favorites')
                    .select('product_id')
                    .eq('user_id', user.uid);
                
                if (error) throw error;
                setFavorites(data.map(f => f.product_id));
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setFavorites([]);
            }
        };

        fetchFavorites();
    }, [user]);

    const fixedCategories = ['Todos', 'Bebês', 'Crianças', 'Adultos'];
    const dynamicCategories = [...new Set(products.map(p => p.category))].filter(c => !fixedCategories.includes(c));
    const categories = [...fixedCategories, ...dynamicCategories];

    const getProductById = (id: string) => products.find(p => p.id === id);

    const toggleFavorite = async (id: string) => {
        if (!user) {
            toast.error('Faça login para adicionar favoritos');
            return;
        }

        const isLiked = favorites.includes(id);

        try {
            if (isLiked) {
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .match({ user_id: user.uid, product_id: id });
                if (error) throw error;
                setFavorites(prev => prev.filter(favId => favId !== id));
            } else {
                const { error } = await supabase
                    .from('favorites')
                    .insert({ user_id: user.uid, product_id: id });
                if (error) throw error;
                setFavorites(prev => [...prev, id]);
            }

            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === id ? { ...p, likes: p.likes + (isLiked ? -1 : 1) } : p
                )
            );
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Erro ao atualizar favoritos');
        }
    };

    return (
        <ProductContext.Provider value={{ products, categories, getProductById, favorites, toggleFavorite, isLoading, refreshProducts }}>
            {children}
        </ProductContext.Provider>
    );
}
