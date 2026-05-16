import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, CheckCircle, XCircle, Trash2, MessageSquare, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface ReviewWithProduct {
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    is_approved: boolean;
    created_at: string;
    product_id: string;
    products: {
        name: string;
    };
}

export default function ReviewManager() {
    const [reviews, setReviews] = useState<ReviewWithProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select(`
                    *,
                    products (
                        name
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Erro ao carregar avaliações.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleApproval = async (review: ReviewWithProduct) => {
        try {
            const { error } = await supabase
                .from('reviews')
                .update({ is_approved: !review.is_approved })
                .eq('id', review.id);

            if (error) throw error;
            
            toast.success(review.is_approved ? 'Avaliação ocultada.' : 'Avaliação aprovada!');
            fetchReviews();
        } catch (error) {
            console.error('Error toggling approval:', error);
            toast.error('Erro ao atualizar status.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir permanentemente esta avaliação?')) return;
        
        try {
            const { error } = await supabase
                .from('reviews')
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            toast.success('Avaliação excluída.');
            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Erro ao excluir avaliação.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <MessageSquare className="text-pink-500" /> Gerenciar Avaliações
                </h2>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                    Total: <span className="font-bold text-pink-500">{reviews.length}</span> avaliações
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Mobile Cards View */}
                <div className="grid grid-cols-1 divide-y divide-gray-100 lg:hidden">
                    {reviews.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-400">
                            Nenhuma avaliação encontrada.
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className={`p-4 space-y-3 ${!review.is_approved ? 'bg-amber-50/20' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{review.user_name}</h4>
                                        <p className="text-xs text-gray-500">
                                            {new Date(review.created_at).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    {review.is_approved ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                                            <CheckCircle size={10} /> Aprovada
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                                            <XCircle size={10} /> Pendente
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 uppercase font-bold">Produto</p>
                                    <Link 
                                        to={`/produto/${review.product_id}`} 
                                        className="text-pink-500 hover:underline flex items-center gap-1 text-sm font-medium"
                                        target="_blank"
                                    >
                                        {review.products?.name} <ExternalLink size={12} />
                                    </Link>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-400 uppercase font-bold">Avaliação</p>
                                        <div className="flex text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    size={12} 
                                                    fill={i < review.rating ? "currentColor" : "none"} 
                                                    className={i < review.rating ? "" : "text-gray-200"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-xl italic">
                                        "{review.comment}"
                                    </p>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        onClick={() => handleToggleApproval(review)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-bold text-xs ${
                                            review.is_approved 
                                            ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' 
                                            : 'text-green-600 bg-green-50 hover:bg-green-100'
                                        }`}
                                    >
                                        {review.is_approved ? <><XCircle size={14} /> Ocultar</> : <><CheckCircle size={14} /> Aprovar</>}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-bold text-xs"
                                    >
                                        <Trash2 size={14} /> Excluir
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                    <table className="w-full text-left table-fixed">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-3 py-4 text-center w-28">Status</th>
                                <th className="px-3 py-4 w-24">Data</th>
                                <th className="px-3 py-4 w-36">Cliente</th>
                                <th className="px-3 py-4 w-40">Produto</th>
                                <th className="px-3 py-4">Comentário</th>
                                <th className="px-3 py-4 w-24">Nota</th>
                                <th className="px-3 py-4 text-right w-24">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        Nenhuma avaliação encontrada.
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review.id} className={`hover:bg-gray-50 transition-colors ${!review.is_approved ? 'bg-amber-50/20' : ''}`}>
                                        <td className="px-3 py-4 text-center">
                                            {review.is_approved ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                    <CheckCircle size={12} /> Aprovada
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                                    <XCircle size={12} /> Pendente
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-500">
                                            {new Date(review.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-3 py-4 font-bold text-gray-800 truncate">{review.user_name}</td>
                                        <td className="px-3 py-4">
                                            <Link 
                                                to={`/produto/${review.product_id}`} 
                                                className="text-pink-500 hover:underline flex items-center gap-1 font-medium truncate"
                                                target="_blank"
                                            >
                                                <span className="truncate">{review.products?.name}</span> <ExternalLink size={12} className="flex-shrink-0" />
                                            </Link>
                                        </td>
                                        <td className="px-3 py-4">
                                            <p className="text-gray-600 text-sm truncate" title={review.comment}>
                                                {review.comment}
                                            </p>
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="flex text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        size={14} 
                                                        fill={i < review.rating ? "currentColor" : "none"} 
                                                        className={i < review.rating ? "" : "text-gray-200"}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleApproval(review)}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        review.is_approved 
                                                        ? 'text-amber-500 hover:bg-amber-50' 
                                                        : 'text-green-500 hover:bg-green-50'
                                                    }`}
                                                    title={review.is_approved ? 'Ocultar' : 'Aprovar'}
                                                >
                                                    {review.is_approved ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
