import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { sheetLogin, sheetRegister, sheetUpdateUser } from '@/lib/sheets';
import { toast } from 'sonner';

// Custom user interface to replace Firebase User
export interface AppUser {
    uid: string;
    email: string;
    displayName: string;
    role: 'admin' | 'customer';
    photoURL?: string;
    whatsapp?: string;
    cep?: string;
    cidade?: string;
    endereco?: string;
    numero?: string;
    complemento?: string;
    estado?: string;
}

interface AuthContextType {
    user: AppUser | null;
    isAdmin: boolean;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    updateUserProfile: (data: Partial<AppUser>) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

const STORAGE_KEY = 'deia_art_lacos_user';
const OWNER_EMAIL = 'alexandrefranco.com@gmail.com';

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Load user from localStorage on mount
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser) as AppUser;
                setUser(parsedUser);
                setIsAdmin(parsedUser.role === 'admin');
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setLoading(false);
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const sheetUser = await sheetLogin(email, password);
            if (sheetUser) {
                const isOwner = sheetUser.email.toLowerCase() === OWNER_EMAIL;
                const appUser: AppUser = {
                    uid: sheetUser.uid,
                    email: sheetUser.email,
                    displayName: sheetUser.displayName,
                    role: isOwner ? 'admin' : sheetUser.role,
                    whatsapp: sheetUser.whatsapp,
                    cep: sheetUser.cep,
                    cidade: sheetUser.cidade,
                    endereco: sheetUser.endereco,
                    numero: sheetUser.numero,
                    complemento: sheetUser.complemento,
                    estado: sheetUser.estado,
                    photoURL: sheetUser.photoURL
                };
                setUser(appUser);
                setIsAdmin(appUser.role === 'admin');
                localStorage.setItem(STORAGE_KEY, JSON.stringify(appUser));
                toast.success('Bem-vindo(a) de volta!');
            } else {
                toast.error('E-mail ou senha incorretos.');
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Erro ao fazer login.');
            throw error;
        }
    };

    const signUp = async (email: string, password: string, name: string) => {
        try {
            const isOwner = email.toLowerCase() === OWNER_EMAIL;
            const sheetUser = await sheetRegister({
                email,
                password,
                displayName: name,
                role: isOwner ? 'admin' : 'customer'
            });

            const appUser: AppUser = {
                uid: sheetUser.uid,
                email: sheetUser.email,
                displayName: sheetUser.displayName,
                role: sheetUser.role,
                whatsapp: sheetUser.whatsapp,
                cep: sheetUser.cep,
                cidade: sheetUser.cidade,
                endereco: sheetUser.endereco,
                numero: sheetUser.numero,
                complemento: sheetUser.complemento,
                estado: sheetUser.estado,
                photoURL: sheetUser.photoURL
            };

            setUser(appUser);
            setIsAdmin(appUser.role === 'admin');
            localStorage.setItem(STORAGE_KEY, JSON.stringify(appUser));
            toast.success(`Conta criada com sucesso! Bem-vindo(a), ${name}`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Erro ao criar conta.');
            throw error;
        }
    };

    const updateUserProfile = async (data: Partial<AppUser>) => {
        if (!user) throw new Error('No user logged in');
        try {
            const updatedUser = { ...user, ...data };
            
            // Persist to Google Sheets
            await sheetUpdateUser(user.uid, data);
            
            setUser(updatedUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
            toast.success('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar perfil.');
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem(STORAGE_KEY);
        toast.success('Você saiu da sua conta.');
    };

    const value = {
        user,
        isAdmin,
        loading,
        signIn,
        signUp,
        updateUserProfile,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
