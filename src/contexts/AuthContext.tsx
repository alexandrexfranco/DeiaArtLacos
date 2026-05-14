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
                
                if (!session?.user) {
                    console.log('📴 Nenhuma sessão ativa');
                    setUser(null);
                    setLoading(false);
                    return;
                }

                // ESTRATÉGIA DE EMERGÊNCIA: Se for o dono, já define como admin antes de ir no banco
                const isOwner = session.user.email?.toLowerCase() === OWNER_EMAIL;
                if (isOwner) {
                    console.log('👑 Admin detectado (Dono), liberando acesso imediato...');
                    setUser({
                        uid: session.user.id,
                        email: session.user.email || '',
                        display_name: session.user.user_metadata?.full_name || 'Admin',
                        role: 'admin'
                    } as any);
                    setLoading(false);
                }

                try {
                    console.log('👤 Buscando perfil no banco (em background)...');
                    
                    // Timeout de 5 segundos para a busca no banco
                    const profilePromise = supabase
                        .from('users')
                        .select('*')
                        .eq('uid', session.user.id)
                        .maybeSingle();

                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('DB Timeout')), 5000)
                    );

                    const { data: profile, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

                    if (error) {
                        console.warn('⚠️ Erro/Timeout ao buscar perfil no banco:', error.message);
                    } else if (profile) {
                        console.log('✅ Perfil atualizado do banco');
                        setUser(profile as any);
                    }
                } catch (err) {
                    console.warn('ℹ️ Usando dados da sessão (Banco de dados inacessível)');
                } finally {
                    setLoading(false);
                    console.log('⌛ Processo de Auth concluído');
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        console.log(`🔐 Tentando login para: ${email}...`);
        
        // Teste de conectividade rápido
        try {
            const resp = await fetch(import.meta.env.VITE_SUPABASE_URL, { method: 'HEAD', mode: 'no-cors' });
            console.log('🌐 Conexão com Supabase: OK');
        } catch (e) {
            console.warn('🌐 Conexão com Supabase: FALHOU ou Bloqueada');
        }

        const authPromise = supabase.auth.signInWithPassword({ email, password });
        
        // Timeout de 10 segundos para a promessa do Supabase
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout: O Supabase não respondeu a tempo.')), 10000)
        );

        try {
            const { data, error } = await Promise.race([authPromise, timeoutPromise]) as any;
            
            if (error) {
                console.error('❌ Erro no signInWithPassword:', error.message);
                toast.error(error.message);
                throw error;
            }

            console.log('✅ Auth: Login bem-sucedido via Supabase', data?.user?.id);
            toast.success('Bem-vindo(a) de volta!');
        } catch (err: any) {
            console.error('❌ Falha na autenticação:', err.message || err);
            toast.error(err.message || 'Erro ao conectar com o servidor.');
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
