import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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

const OWNER_EMAIL = 'alexandrefranco.com@gmail.com';

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === OWNER_EMAIL;

    useEffect(() => {
        console.log('🌍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configurada ✅' : 'AUSENTE ❌');
        console.log('🔐 Auth: Inicializando monitoramento de sessão...');

        // Initialize Supabase Auth Session
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                console.log('🔐 Auth: Evento recebido:', _event);
                
                try {
                    if (session?.user) {
                        console.log('🔐 Auth: Usuário logado encontrado:', session.user.email);
                        
                        // Timeout de 5 segundos para a consulta ao banco
                        const fetchProfileData = async () => {
                            return await supabase
                                .from('users')
                                .select('*')
                                .eq('uid', session.user.id)
                                .single();
                        };

                        console.log('🔐 Auth: Buscando perfil no banco...');
                        const { data: profile, error } = await fetchProfileData();

                        if (error && error.code !== 'PGRST116') {
                            console.error('❌ Auth: Erro ao buscar perfil:', error);
                        }

                        if (profile) {
                            console.log('🔐 Auth: Perfil carregado com sucesso');
                            setUser(profile as any);
                        } else {
                            console.log('🔐 Auth: Perfil não encontrado, criando um novo...');
                            const isOwner = session.user.email?.toLowerCase() === OWNER_EMAIL;
                            const newProfile = {
                                uid: session.user.id,
                                email: session.user.email || '',
                                display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                                role: isOwner ? 'admin' : 'customer'
                            };
                            await supabase.from('users').insert(newProfile);
                            setUser(newProfile as any);
                        }
                    } else {
                        console.log('🔐 Auth: Nenhum usuário logado');
                        setUser(null);
                    }
                } catch (err) {
                    console.error('❌ Auth: Erro ou Timeout na inicialização:', err);
                    // Se for o dono, força admin e define usuário básico como fallback
                    if (session?.user?.email?.toLowerCase() === OWNER_EMAIL) {
                        console.log('🔐 Auth: Modo recuperação: Forçando Admin por e-mail');
                        setUser({
                            uid: session.user.id,
                            email: session.user.email || '',
                            display_name: session.user.user_metadata?.full_name || 'Admin',
                            role: 'admin'
                        } as any);
                    }
                } finally {
                    console.log('🔐 Auth: Finalizando estado de carregamento');
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

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Você saiu da sua conta.');
        }
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
            {children}
        </AuthContext.Provider>
    );
}
