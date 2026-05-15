import { useState, useEffect } from 'react';
import { Users, Shield, User as UserIcon, Mail, Calendar, Edit2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface UserData {
    uid: string;
    email: string;
    display_name: string | null;
    role: 'admin' | 'customer';
    created_at: string;
}

export default function UserManager() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [editingRole, setEditingRole] = useState<'admin' | 'customer'>('customer');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setUsers(data as UserData[]);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Erro ao carregar usuários');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async (userId: string) => {
        try {
            const { error } = await supabase.from('users').update({ role: editingRole }).eq('uid', userId);
            if (error) throw error;

            // Update local state
            setUsers(users.map(u =>
                u.uid === userId ? { ...u, role: editingRole } : u
            ));

            toast.success('Permissão atualizada com sucesso!');
            setEditingUserId(null);
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('Erro ao atualizar permissão');
        }
    };

    const startEditing = (user: UserData) => {
        setEditingUserId(user.uid);
        setEditingRole(user.role);
    };

    const cancelEditing = () => {
        setEditingUserId(null);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <Users className="text-pink-500" />
                        Gerenciar Clientes
                    </h2>
                    <p className="text-gray-500 mt-1">Visualize e gerencie permissões de usuários cadastrados</p>
                </div>
                <div className="text-right bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                    <p className="text-xs text-gray-400 uppercase font-bold">Total</p>
                    <p className="text-2xl font-bold text-pink-500 leading-none">{users.length}</p>
                </div>
            </div>

            {isLoading ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Carregando usuários...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum usuário cadastrado ainda</p>
                </div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 gap-4 lg:hidden">
                        {users.map((user) => (
                            <div key={user.uid} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                                            {user.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{user.display_name || 'Sem nome'}</p>
                                            <p className="text-xs text-gray-400">ID: {user.uid.slice(0, 8)}...</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {editingUserId === user.uid ? (
                                            <>
                                                <button onClick={() => handleRoleChange(user.uid)} className="p-2 text-green-600 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                                                    <Save size={18} />
                                                </button>
                                                <button onClick={cancelEditing} className="p-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => startEditing(user)} className="p-2 text-pink-600 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail size={16} className="text-pink-400" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar size={16} className="text-pink-400" />
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '—'}
                                        </div>
                                        {editingUserId === user.uid ? (
                                            <select
                                                value={editingRole}
                                                onChange={(e) => setEditingRole(e.target.value as 'admin' | 'customer')}
                                                className="px-3 py-1 border border-pink-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-pink-300"
                                            >
                                                <option value="customer">Cliente</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        ) : (
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                                                }`}>
                                                {user.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                                                {user.role === 'admin' ? 'Admin' : 'Cliente'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-pink-50 border-b border-pink-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Usuário</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">E-mail</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Permissão</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Cadastro</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((user) => (
                                        <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                                                        {user.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {user.display_name || 'Sem nome'}
                                                        </p>
                                                        <p className="text-xs text-gray-400">ID: {user.uid.slice(0, 8)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Mail size={16} className="text-gray-400" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingUserId === user.uid ? (
                                                    <select
                                                        value={editingRole}
                                                        onChange={(e) => setEditingRole(e.target.value as 'admin' | 'customer')}
                                                        className="px-3 py-1 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                                                    >
                                                        <option value="customer">Cliente</option>
                                                        <option value="admin">Administrador</option>
                                                    </select>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                                                        }`}>
                                                        {user.role === 'admin' ? <Shield size={14} /> : <UserIcon size={14} />}
                                                        {user.role === 'admin' ? 'Admin' : 'Cliente'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                    <Calendar size={16} className="text-gray-400" />
                                                    {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '—'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {editingUserId === user.uid ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleRoleChange(user.uid)}
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Salvar"
                                                            >
                                                                <Save size={18} />
                                                            </button>
                                                            <button
                                                                onClick={cancelEditing}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Cancelar"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => startEditing(user)}
                                                            className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                                                            title="Editar permissão"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-sm text-blue-800">
                    <strong>💡 Dica:</strong> Administradores têm acesso total ao painel. Clientes só podem fazer compras e ver seus pedidos.
                    Os dados são armazenados no Supabase.
                </p>
            </div>
        </div>
    );
}
