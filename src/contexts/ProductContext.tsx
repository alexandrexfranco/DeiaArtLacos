import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getProducts, getFavorites, addFavorite, removeFavorite, addProduct } from '@/lib/sheets';
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

    // Favorites State — from Google Sheets per user
    const [favorites, setFavorites] = useState<string[]>([]);

    // Load products from Google Sheets
    const refreshProducts = async () => {
        setIsLoading(true);
        try {
            const sheetProducts = await getProducts();
            const mapped: Product[] = sheetProducts.map(p => ({ ...p }));
            setProducts(mapped);
            // Save to localStorage as backup
            localStorage.setItem('products_backup', JSON.stringify(mapped));
            console.log('✅ Products loaded from Google Sheets');
        } catch (error) {
            console.error('❌ Google Sheets connection failed:', error);
            toast.warning('Modo Offline: Usando dados locais');

            // Load from localStorage as fallback
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

    // Fetch user favorites from Google Sheets
    useEffect(() => {
        if (!user) {
            setFavorites([]);
            return;
        }

        const fetchFavorites = async () => {
            try {
                const favIds = await getFavorites(user.uid);
                setFavorites(favIds);
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
                await removeFavorite(user.uid, id);
                setFavorites(prev => prev.filter(favId => favId !== id));
            } else {
                await addFavorite(user.uid, id);
                setFavorites(prev => [...prev, id]);
            }

            // Optimistically update the product like count (local state only)
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
