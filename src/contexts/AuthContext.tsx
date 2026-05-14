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
        console.log('🔐 Auth: Inicializando monitoramento...');

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log(`⚡ Auth Event: ${event}`);
                
                try {
                    if (session?.user) {
                        console.log('👤 Usuário autenticado, buscando perfil...');
                        
                        const { data: profile, error } = await supabase
                            .from('users')
                            .select('*')
                            .eq('uid', session.user.id)
                            .maybeSingle();

                        if (error) {
                            console.warn('⚠️ Erro ao buscar perfil (banco):', error.message);
                        }

                        if (profile) {
                            console.log('✅ Perfil carregado do banco');
                            setUser(profile as any);
                        } else {
                            console.log('🆕 Perfil não encontrado, usando dados da sessão...');
                            const isOwner = session.user.email?.toLowerCase() === OWNER_EMAIL;
                            const fallbackProfile = {
                                uid: session.user.id,
                                email: session.user.email || '',
                                display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                                role: isOwner ? 'admin' : 'customer'
                            };
                            setUser(fallbackProfile as any);

                            // Tenta criar o perfil em background, mas não trava o login
                            supabase.from('users').insert(fallbackProfile).then(({ error: insErr }) => {
                                if (insErr) console.warn('Poderia ignorar: Erro ao criar perfil no banco', insErr);
                            });
                        }
                    } else {
                        console.log('📴 Nenhuma sessão ativa');
                        setUser(null);
                    }
                } catch (err) {
                    console.error('❌ Erro crítico no onAuthStateChange:', err);
                } finally {
                    setLoading(false);
                    console.log('⌛ Carregamento de Auth finalizado');
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        console.log(`🔐 Tentando login para: ${email}...`);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                console.error('❌ Erro no signInWithPassword:', error.message);
                toast.error(error.message);
                throw error;
            }
            console.log('✅ Auth: Login bem-sucedido via Supabase');
            toast.success('Bem-vindo(a) de volta!');
        } catch (err: any) {
            console.error('❌ Falha na autenticação:', err);
            throw err;
        }
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
