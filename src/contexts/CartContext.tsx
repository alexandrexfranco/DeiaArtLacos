import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { Product } from './ProductContext';

export interface CartItem extends Product {
    quantity: number;
    selectedColors?: string[];
    cartId: string;
}

interface CartContextType {
    items: CartItem[];
    itemCount: number;
    total: number;
    addToCart: (product: Product, selectedColors?: string[]) => void;
    removeFromCart: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                return JSON.parse(savedCart);
            } catch (error) {
                console.error('Error parsing cart from localStorage', error);
                return [];
            }
        }
        return [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product, selectedColors?: string[]) => {
        const cartId = `${product.id}-${(selectedColors || []).sort().join('_')}`;
        setItems(prev => {
            const existing = prev.find(item => item.cartId === cartId);
            if (existing) {
                toast.success(`Mais um ${product.name} adicionado!`);
                return prev.map(item =>
                    item.cartId === cartId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            toast.success(`${product.name} adicionado ao carrinho!`);
            setIsCartOpen(true); // Auto open cart
            return [...prev, { ...product, quantity: 1, selectedColors, cartId }];
        });
    };

    const removeFromCart = (cartId: string) => {
        setItems(prev => prev.filter(item => item.cartId !== cartId));
        toast.info('Item removido.');
    };

    const updateQuantity = (cartId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(cartId);
            return;
        }
        setItems(prev => prev.map(item =>
            item.cartId === cartId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setItems([]);
        toast.info('Carrinho limpo.');
    };

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            items,
            itemCount,
            total,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}
