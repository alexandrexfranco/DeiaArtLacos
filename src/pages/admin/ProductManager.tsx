import { useState } from 'react';
import { useProducts, Product } from '@/contexts/ProductContext';
import { Plus, Edit2, Trash2, X, Upload, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function ProductManager() {
    const { products, refreshProducts } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        category: 'Crianças',
        size: 'M',
        type: 'Laço',
        image: '',
        images: [],
        isNew: false,
        isBestSeller: false,
        likes: 0
    });

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData(product);
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: 0,
                category: 'Crianças',
                size: 'M',
                type: 'Laço',
                image: '',
                images: [],
                isNew: false,
                isBestSeller: false,
                likes: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const cleanName = file.name
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9.\-_]/g, '_');
            const fileName = `${Date.now()}-${cleanName}`;
            const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
            if (uploadError) throw uploadError;
            
            const { data } = supabase.storage.from('products').getPublicUrl(fileName);
            setFormData(prev => ({ ...prev, image: data.publicUrl }));
            toast.success('Imagem enviada para o Supabase com sucesso!');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Erro ao fazer upload da imagem.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleExtraImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            const newImageUrls: string[] = [];
            for (const file of files) {
                const cleanName = file.name
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-zA-Z0-9.\-_]/g, '_');
                const fileName = `${Date.now()}-${cleanName}`;
                const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
                if (uploadError) throw uploadError;
                
                const { data } = supabase.storage.from('products').getPublicUrl(fileName);
                newImageUrls.push(data.publicUrl);
            }
            
            setFormData(prev => ({ 
                ...prev, 
                images: [...(prev.images || []), ...newImageUrls] 
            }));
            toast.success(`${files.length} imagem(ns) adicionada(s) à galeria!`);
        } catch (error) {
            console.error('Error uploading extra images:', error);
            toast.error('Erro ao fazer upload das imagens extras.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveExtraImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images?.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('--- Iniciando salvamento do produto ---');
        console.log('Dados do formulário:', formData);

        try {
            const priceNumber = Number(
                String(formData.price || '0').replace(',', '.')
            );
            if (isNaN(priceNumber)) {
                toast.error('O preço informado não é um número válido!');
                setIsLoading(false);
                return;
            }

            const productData = {
                name: formData.name || '',
                description: formData.description || '',
                price: priceNumber,
                category: formData.category || 'Crianças',
                size: formData.size || 'M',
                type: formData.type || 'Bico de Pato',
                image: formData.image || '',
                images: formData.images || [],
                likes: formData.likes || 0,
                isNew: formData.isNew || false,
                isBestSeller: formData.isBestSeller || false,
            };

            console.log('Payload para o Supabase:', productData);

            if (editingProduct) {
                console.log('Atualizando produto existente:', editingProduct.id);
                const { data, error } = await supabase.from('products').update(productData).eq('id', editingProduct.id).select();
                console.log('Resposta Update:', { data, error });
                if (error) throw error;
                toast.success('Produto atualizado com sucesso!');
            } else {
                console.log('Criando novo produto...');
                const { data, error } = await supabase.from('products').insert(productData).select();
                console.log('Resposta Insert:', { data, error });
                if (error) throw error;
                toast.success('Produto criado com sucesso!');
            }

            console.log('Atualizando lista de produtos...');
            await refreshProducts();
            setIsModalOpen(false);
            console.log('--- Salvamento concluído ---');
        } catch (error: any) {
            console.error('SAVE ERROR FULL:', error);
            const errorMessage = error?.message || error?.details || error?.hint || 'Erro desconhecido';
            toast.error(`Erro ao salvar: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            toast.success('Produto excluído.');
            await refreshProducts();
        } catch (error) {
            console.error(error);
            toast.error('Erro ao excluir produto.');
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Gerenciar Produtos</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-200"
                >
                    <Plus size={20} />
                    Novo Produto
                </button>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {products.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100">
                        Nenhum produto cadastrado.
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center">
                            <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-800 truncate">{product.name}</h4>
                                <p className="text-pink-500 font-bold">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    <span className="px-2 py-0.5 bg-pink-50 text-pink-600 rounded-md text-[10px] font-bold uppercase">{product.category}</span>
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold uppercase">{product.type}</span>
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase">Tam: {product.size}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleOpenModal(product)}
                                    className="p-2 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Imagem</th>
                                <th className="px-6 py-4">Nome</th>
                                <th className="px-6 py-4">Cat / Tipo / Tam</th>
                                <th className="px-6 py-4">Preço</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        Nenhum produto cadastrado. Clique em "Novo Produto" para começar.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">{product.name}</td>
                                        <td className="px-6 py-4 text-xs text-gray-500 space-y-1">
                                            <div className="flex gap-1">
                                                <span className="px-2 py-0.5 bg-pink-50 text-pink-600 rounded-md font-bold">{product.category}</span>
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-bold">{product.type}</span>
                                            </div>
                                            <div className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md inline-block font-bold">Tam: {product.size}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700">Imagem do Produto</label>
                                    <div className="w-full aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-pink-300 transition-colors">
                                        <input
                                            type="file"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                            accept="image/*"
                                            disabled={isUploading}
                                        />
                                        {formData.image ? (
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center text-gray-400 p-4">
                                                {isUploading ? (
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                                                ) : (
                                                    <><Upload size={32} className="mx-auto mb-2" /><span className="text-sm">Clique para upload</span></>
                                                )}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center text-white font-bold">
                                            Alterar
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Imagem salva no Supabase.</p>

                                    {/* Extra Images Gallery */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Galeria Adicional (Opcional)</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {formData.images?.map((img, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                                    <img src={img} alt={`Extra ${idx}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExtraImage(idx)}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            
                                            <div className="aspect-square bg-pink-50 rounded-xl border-2 border-dashed border-pink-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-pink-300 transition-colors">
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={handleExtraImageUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                                    accept="image/*"
                                                    disabled={isUploading}
                                                />
                                                <Plus size={24} className="text-pink-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Preço (R$)</label>
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Categoria</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                                            >
                                                <option>Bebês</option>
                                                <option>Crianças</option>
                                                <option>Adultos</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Tamanho</label>
                                            <select
                                                value={formData.size}
                                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                                            >
                                                <option>P</option>
                                                <option>M</option>
                                                <option>G</option>
                                                <option>Mini</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                                        >
                                            <option>Laço</option>
                                            <option>Tiara</option>
                                            <option>Faixa</option>
                                            <option>Kit</option>
                                            <option>Bico de Pato</option>
                                            <option>Xuxinha</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isNew}
                                        onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                                        className="w-5 h-5 rounded text-pink-500 focus:ring-pink-500"
                                    />
                                    <span className="text-gray-700 font-medium">Marcar como Novo</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isBestSeller}
                                        onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                                        className="w-5 h-5 rounded text-pink-500 focus:ring-pink-500"
                                    />
                                    <span className="text-gray-700 font-medium">Marcar como Destaque</span>
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Save size={20} />}
                                    Salvar Produto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
