import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, Plus, Trash2, Edit2, Save, X, User, Upload, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    image: string;
}

export default function TestimonialManager() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Testimonial>>({});

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('testimonials')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('testimonials')
                .getPublicUrl(filePath);

            setEditForm({ ...editForm, image: publicUrl });
            toast.success('Foto carregada!');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Erro ao subir foto.');
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTestimonials(data || []);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            toast.error('Erro ao carregar depoimentos.');
        } finally {
            setIsLoading(false);
        }
    };

    const importStaticTestimonials = async () => {
        setIsLoading(true);
        try {
            const staticData = [
                {
                    name: 'Ana Julia',
                    role: 'Mãe da Sofia',
                    content: 'Amei o laço! Acabamento impecável e chegou super rápido. A Sofia não quer tirar mais da cabeça!',
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200'
                },
                {
                    name: 'Fernanda Lima',
                    role: 'Mãe da Alice',
                    content: 'Produtos maravilhosos. Dá para sentir o carinho em cada detalhe. O atendimento também foi incrível.',
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
                },
                {
                    name: 'Carla Dias',
                    role: 'Mãe da Beatriz',
                    content: 'Comprei para o batizado da minha filha e ficou perfeito. Muito delicado e confortável, não aperta a cabecinha.',
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
                }
            ];

            const { error } = await supabase.from('testimonials').insert(staticData);
            if (error) throw error;
            
            toast.success('Depoimentos iniciais importados!');
            fetchTestimonials();
        } catch (error: any) {
            toast.error('Erro ao importar: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = () => {
        setIsEditing('new');
        setEditForm({ name: '', role: '', content: '', rating: 5, image: '' });
    };

    const handleEdit = (t: Testimonial) => {
        setIsEditing(t.id);
        setEditForm(t);
    };

    const handleSave = async () => {
        if (!editForm.name || !editForm.content) {
            toast.error('Nome e conteúdo são obrigatórios');
            return;
        }

        try {
            if (isEditing === 'new') {
                const { error } = await supabase
                    .from('testimonials')
                    .insert([editForm]);
                if (error) throw error;
                toast.success('Depoimento adicionado!');
            } else {
                const { error } = await supabase
                    .from('testimonials')
                    .update(editForm)
                    .eq('id', isEditing);
                if (error) throw error;
                toast.success('Depoimento atualizado!');
            }
            
            setIsEditing(null);
            fetchTestimonials();
        } catch (error) {
            console.error('Error saving testimonial:', error);
            toast.error('Erro ao salvar depoimento.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir este depoimento?')) return;
        
        try {
            const { error } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Depoimento removido.');
            fetchTestimonials();
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            toast.error('Erro ao excluir.');
        }
    };

    if (isLoading) return <div className="animate-pulse p-8">Carregando...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Gerenciar Depoimentos</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {testimonials.length === 0 && (
                        <button 
                            onClick={importStaticTestimonials}
                            className="w-full sm:w-auto bg-gray-100 text-gray-600 px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors font-bold"
                        >
                            <Download size={20} /> Importar Padrão
                        </button>
                    )}
                    <button 
                        onClick={handleAdd}
                        className="w-full sm:w-auto bg-pink-500 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-pink-600 transition-colors font-bold shadow-lg shadow-pink-200"
                    >
                        <Plus size={20} /> Novo Depoimento
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing && (
                    <div className="bg-pink-50 border-2 border-pink-200 p-6 rounded-3xl space-y-4">
                        <h3 className="font-bold text-pink-600 flex items-center gap-2">
                            {isEditing === 'new' ? 'Novo' : 'Editar'} Depoimento
                        </h3>
                        <div className="space-y-3">
                            <input 
                                placeholder="Nome do Cliente"
                                className="w-full p-3 rounded-xl border border-pink-100"
                                value={editForm.name}
                                onChange={e => setEditForm({...editForm, name: e.target.value})}
                            />
                            <input 
                                placeholder="Papel (Ex: Mãe da Sofia)"
                                className="w-full p-3 rounded-xl border border-pink-100"
                                value={editForm.role}
                                onChange={e => setEditForm({...editForm, role: e.target.value})}
                            />
                            <textarea 
                                placeholder="Texto do depoimento"
                                className="w-full p-3 rounded-xl border border-pink-100 h-24"
                                value={editForm.content}
                                onChange={e => setEditForm({...editForm, content: e.target.value})}
                            />
                            <div className="flex gap-4 items-center bg-white p-3 rounded-xl border border-pink-100">
                                {editForm.image ? (
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-pink-200">
                                        <img src={editForm.image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-300">
                                        <User size={24} />
                                    </div>
                                )}
                                <label className="flex-1 flex items-center justify-center gap-2 bg-pink-50 text-pink-600 py-2 rounded-lg cursor-pointer hover:bg-pink-100 transition-colors border border-dashed border-pink-300">
                                    {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                                    <span className="text-sm font-medium">{editForm.image ? 'Alterar Foto' : 'Subir Foto'}</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                </label>
                                <select 
                                    className="p-2 rounded-lg border border-pink-100 text-sm"
                                    value={editForm.rating}
                                    onChange={e => setEditForm({...editForm, rating: Number(e.target.value)})}
                                >
                                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={handleSave} className="flex-1 bg-green-500 text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600">
                                <Save size={18} /> Salvar
                            </button>
                            <button onClick={() => setIsEditing(null)} className="bg-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-300">
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {testimonials.map(t => (
                    <div key={t.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-100 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                            {t.image ? <img src={t.image} alt={t.name} className="w-full h-full object-cover" /> : <User className="text-gray-300" />}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between">
                                <h4 className="font-bold text-gray-800">{t.name}</h4>
                                <div className="flex gap-1">
                                    <button onClick={() => handleEdit(t)} className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Edit2 size={16}/></button>
                                    <button onClick={() => handleDelete(t.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                                </div>
                            </div>
                            <p className="text-xs text-pink-500 font-medium">{t.role}</p>
                            <div className="flex text-amber-400 py-1">
                                {[...Array(t.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 italic">"{t.content}"</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
