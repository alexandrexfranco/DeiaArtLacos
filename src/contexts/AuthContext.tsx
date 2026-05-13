import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface AppUser {
    uid: string;
    email: string;
    display_name: string;
    role: 'admin' | 'customer';
    phone?: string;
    address?: string;
    created_at?: string;
}

interface AuthContextType {
    user: AppUser | null;
    loading: boolean;
    isAdmin: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateUserProfile: (data: Partial<AppUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const OWNER_EMAIL = 'alexandrefranco.com@gmail.com';

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === OWNER_EMAIL;

    useEffect(() => {
        console.log('🌍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configurada ✅' : 'AUSENTE ❌');
        console.log('🔐 Auth: Inicializando monitoramento de sessão...');

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                try {
                    if (session?.user) {
                        const { data: profile, error } = await supabase
                            .from('users')
                            .select('*')
                            .eq('uid', session.user.id)
                            .single();

                        if (error && error.code !== 'PGRST116') throw error;

                        if (profile) {
                            setUser(profile as any);
                        } else {
                            const isOwner = session.user.email?.toLowerCase() === OWNER_EMAIL;
                            const newProfile = {
                                uid: session.user.id,
                                email: session.user.email || '',
                                display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                                role: isOwner ? 'admin' : 'customer' as const
                            };
                            
                            const { error: insertError } = await supabase.from('users').insert(newProfile);
                            if (insertError) throw insertError;
                            
                            setUser(newProfile as any);
                        }
                    } else {
                        setUser(null);
                    }
                } catch (err) {
                    console.error('Auth Initialization Error:', err);
                    if (session?.user?.email?.toLowerCase() === OWNER_EMAIL) {
                        setUser({
                            uid: session.user.id,
                            email: session.user.email || '',
                            display_name: session.user.user_metadata?.full_name || 'Admin',
                            role: 'admin'
                        } as any);
                    }
                } finally {
                    setLoading(false);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            toast.error(error.message);
            throw error;
        }
        toast.success('Bem-vindo(a) de volta!');
    };

    const signUp = async (email: string, password: string, name: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name }
            }
        });
        
        if (error) {
            toast.error(error.message);
            throw error;
        }
        toast.success(`Conta criada com sucesso!`);
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error('Erro ao sair.');
            throw error;
        }
        setUser(null);
        toast.success('Sessão encerrada.');
    };

    const updateUserProfile = async (data: Partial<AppUser>) => {
        if (!user) throw new Error('No user logged in');
        
        const updatedUser = { ...user, ...data };
        const { error } = await supabase
            .from('users')
            .update(data)
            .eq('uid', user.uid);
            
        if (error) {
            toast.error('Erro ao atualizar perfil.');
            throw error;
        }
        
        setUser(updatedUser as AppUser);
        toast.success('Perfil atualizado com sucesso!');
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signUp, signOut, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
