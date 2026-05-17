import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface AppUser {
    uid: string;
    email: string;
    display_name: string;
    displayName?: string; // Campo de compatibilidade com partes legadas do frontend
    role: 'admin' | 'customer';
    phone?: string;
    address?: string;
    whatsapp?: string;
    cep?: string;
    endereco?: string;
    numero?: string;
    bairro?: string;
    complemento?: string;
    cidade?: string;
    estado?: string;
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
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const OWNER_EMAIL = 'alexandrefranco.com@gmail.com';

/** Translates Supabase auth error messages to friendly Portuguese */
function translateAuthError(message: string): string {
    if (!message) return 'Erro inesperado. Tente novamente.';
    const m = message.toLowerCase();
    if (m.includes('user already registered') || m.includes('already registered'))
        return 'Este e-mail já está cadastrado. Faça login ou recupere sua senha.';
    if (m.includes('invalid login credentials') || m.includes('invalid credentials'))
        return 'E-mail ou senha incorretos.';
    if (m.includes('email not confirmed'))
        return 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.';
    if (m.includes('password should be') || m.includes('weak password'))
        return 'A senha deve ter no mínimo 6 caracteres.';
    if (m.includes('rate limit') || m.includes('too many requests') || m.includes('429'))
        return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
    if (m.includes('500') || m.includes('internal server') || m.includes('unexpected_failure'))
        return 'Serviço temporáriamente indisponível. Tente novamente em instantes.';
    if (m.includes('network') || m.includes('failed to fetch') || m.includes('connection'))
        return 'Problema de conexão. Verifique sua internet e tente novamente.';
    return message;
}

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

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`⚡ Auth Event: ${event}`);
            
            if (event === 'SIGNED_OUT') {
                setUser(null);
                setLoading(false);
            } else if (session?.user) {
                // Ao logar ou mudar estado, iniciamos a busca do perfil
                fetchProfile(session.user);
            } else {
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchProfile = async (supabaseUser: any) => {
        if (!supabaseUser) return;
        
        console.log('👤 Buscando perfil real no banco de dados...');

        try {
            const { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('uid', supabaseUser.id)
                .maybeSingle();

            if (error) {
                console.error('❌ Erro ao buscar perfil no banco:', error.message);
                throw error;
            }

            if (profile) {
                console.log('✅ Perfil carregado com sucesso do banco');
                setUser({
                    ...profile,
                    displayName: profile.display_name
                } as AppUser);
            } else {
                console.log('🆕 Perfil não encontrado, criando novo no banco...');
                const isOwner = supabaseUser.email?.toLowerCase() === OWNER_EMAIL;
                const newProfile = {
                    uid: supabaseUser.id,
                    email: supabaseUser.email || '',
                    display_name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Usuário',
                    role: isOwner ? 'admin' : 'customer'
                };
                
                const { error: insError } = await supabase.from('users').insert(newProfile);
                if (insError) throw insError;
                
                setUser({
                    ...newProfile,
                    displayName: newProfile.display_name
                } as AppUser);
                console.log('✅ Novo perfil criado e carregado');
            }
        } catch (err) {
            console.error('⚠️ Falha ao obter dados do banco:', err);
            // Fallback de segurança apenas se o banco falhar criticamente
            const isOwner = supabaseUser.email?.toLowerCase() === OWNER_EMAIL;
            const fallbackProfile = {
                uid: supabaseUser.id,
                email: supabaseUser.email || '',
                display_name: supabaseUser.user_metadata?.full_name || 'Usuário',
                role: isOwner ? 'admin' : 'customer'
            };
            setUser({
                ...fallbackProfile,
                displayName: fallbackProfile.display_name
            } as AppUser);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        console.log(`🔐 Tentando login para: ${email}...`);

        // Teste de conectividade rápido
        try {
            await fetch(import.meta.env.VITE_SUPABASE_URL, { method: 'HEAD', mode: 'no-cors' });
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
                const msg = translateAuthError(error.message);
                toast.error(msg);
                throw new Error(msg);
            }

            console.log('✅ Auth: Login bem-sucedido via Supabase', data?.user?.id);
            toast.success('Bem-vindo(a) de volta! 🎀');
        } catch (err: any) {
            console.error('❌ Falha na autenticação:', err.message || err);
            const msg = translateAuthError(err.message || '');
            if (!err.message?.startsWith(msg)) toast.error(msg);
            throw err;
        }
    };

    const signUp = async (email: string, password: string, name: string) => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name }
                }
            });

            if (error) {
                const msg = translateAuthError(error.message);
                toast.error(msg);
                throw new Error(msg);
            }
            toast.success('Conta criada com sucesso! 🎀');
        } catch (err: any) {
            const msg = translateAuthError(err.message || '');
            // Only show toast if not already shown above
            if (!err.message?.startsWith(msg)) toast.error(msg);
            throw err;
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (err) {
            // Network failure during sign out — ignore, we still clear local state
            console.warn('⚠️ SignOut request failed (possivelmente por rede), limpando estado local...', err);
        } finally {
            // Always clear local state regardless of network result
            setUser(null);
            toast.success('Sessão encerrada.');
        }
    };

    const updateUserProfile = async (data: Partial<AppUser> & { displayName?: string }) => {
        if (!user) throw new Error('No user logged in');

        // Normalização de dados: Mapeia displayName (camelCase) para display_name (snake_case)
        const dbData = { ...data };
        if ('displayName' in dbData) {
            dbData.display_name = dbData.displayName!;
            delete dbData.displayName;
        }

        const updatedUser = { 
            ...user, 
            ...data, 
            display_name: dbData.display_name || user.display_name,
            displayName: dbData.display_name || user.display_name 
        };

        const { error } = await supabase
            .from('users')
            .update(dbData)
            .eq('uid', user.uid);

        if (error) {
            toast.error('Erro ao atualizar perfil.');
            throw error;
        }

        setUser(updatedUser as AppUser);
        toast.success('Perfil atualizado com sucesso!');

        // Sincronização Automática com o WhatsApp Marketing
        if (updatedUser.whatsapp && updatedUser.display_name) {
            try {
                // Verifica se já existe um cadastro com esse telefone na newsletter
                const { data: existing } = await supabase
                    .from('newsletter')
                    .select('id')
                    .eq('phone', updatedUser.whatsapp)
                    .maybeSingle();

                if (!existing) {
                    // Insere novo contato de marketing
                    await supabase.from('newsletter').insert({
                        name: updatedUser.display_name,
                        phone: updatedUser.whatsapp,
                        email: updatedUser.email || null
                    });
                    console.log('📢 Cliente adicionado ao WhatsApp Marketing!');
                } else {
                    // Atualiza nome/e-mail do contato de marketing existente
                    await supabase
                        .from('newsletter')
                        .update({
                            name: updatedUser.display_name,
                            email: updatedUser.email || null
                        })
                        .eq('phone', updatedUser.whatsapp);
                    console.log('📢 Contato de WhatsApp Marketing atualizado!');
                }
            } catch (syncErr) {
                console.error('⚠️ Falha ao sincronizar com WhatsApp Marketing:', syncErr);
            }
        }
    };

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login`,
        });
        if (error) {
            toast.error(error.message);
            throw error;
        }
        toast.success('E-mail de redefinição enviado com sucesso!');
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signUp, signOut, updateUserProfile, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
}
