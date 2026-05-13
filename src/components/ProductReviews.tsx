import { useState, useEffect } from 'react';
import { Star, Send, User, MessageSquare, Ribbon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface ProductReviewsProps {
    productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state
    const [userName, setUserName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    // Honeypot state
    const [honeypot, setHoneypot] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', productId)
                .eq('is_approved', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Anti-spam check (Honeypot)
        if (honeypot) {
            console.warn('Bot detected');
            return;
        }

        if (!userName || !comment || rating === 0) {
            toast.error('Por favor, preencha todos os campos!');
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('reviews').insert({
                product_id: productId,
                user_name: userName,
                rating,
                comment,
                is_approved: false // Now requires moderation
            });

            if (error) throw error;

            toast.success('Avaliação enviada com sucesso! Ela aparecerá no site após uma breve revisão.');
            setUserName('');
            setComment('');
            setRating(5);
            // We don't call fetchReviews() here because the new review is not approved yet
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Erro ao enviar avaliação. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-16 pt-16 border-t border-pink-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Review Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-3xl shadow-soft border border-pink-50 sticky top-24">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <MessageSquare className="text-pink-500" /> Avaliar Produto
                        </h3>
                        <p className="text-gray-500 mb-8 text-sm">
                            Sua opinião é muito importante para nós e para outras clientes!
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Honeypot field - Hidden from users */}
                            <div className="hidden" aria-hidden="true">
                                <input
                                    type="text"
                                    value={honeypot}
                                    onChange={(e) => setHoneypot(e.target.value)}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Seu Nome</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Ex: Maria Silva"
                                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50/50"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Sua Nota</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform active:scale-90"
                                        >
                                            <Star
                                                size={32}
                                                className={`transition-colors ${
                                                    (hoverRating || rating) >= star 
                                                    ? 'fill-amber-400 text-amber-400' 
                                                    : 'text-gray-200'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Seu Comentário</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Conte o que achou do laço..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-2xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50/50 resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-pink-500 text-white font-bold rounded-2xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-100 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>Enviar Avaliação <Send size={18} /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-gray-800">
                            Avaliações de Clientes ({reviews.length})
                        </h3>
                        {reviews.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill="currentColor" />
                                    ))}
                                </div>
                                <span className="font-bold text-gray-700">
                                    {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                                </span>
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="bg-pink-50/50 rounded-3xl p-12 text-center border-2 border-dashed border-pink-100">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-pink-300 mx-auto mb-4">
                                <MessageSquare size={32} />
                            </div>
                            <p className="text-gray-500 font-medium">Seja a primeira a avaliar este produto!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <AnimatePresence>
                                {reviews.map((review) => (
                                    <motion.div
                                        key={review.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-6 rounded-3xl border border-pink-50 shadow-sm"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-400 border border-pink-100">
                                                    <Ribbon size={20} fill="currentColor" className="opacity-70" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{review.user_name}</p>
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
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(review.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed italic">
                                            "{review.comment}"
                                        </p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
