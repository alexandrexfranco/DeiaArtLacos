import { useState, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function BannerManager() {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const { data } = await supabase.from('settings').select('value').eq('key', 'heroBanner').maybeSingle();
                if (data?.value) {
                    setPreviewUrl(data.value);
                }
            } catch (error) {
                console.error('Error fetching banner:', error);
            }
        };
        fetchBanner();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!previewUrl) return;

        setIsLoading(true);
        try {
            // Save the URL to Supabase settings
            const { error } = await supabase.from('settings').upsert({ key: 'heroBanner', value: previewUrl });
            if (error) throw error;
            toast.success('Configuração de banner salva com sucesso!');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao salvar configuração.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.from('settings').upsert({ key: 'heroBanner', value: '' });
            if (error) throw error;
            setPreviewUrl('');
            toast.success('Banner customizado removido. O vídeo padrão do sistema será exibido.');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao remover configuração.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Limite de 15MB
        if (file.size > 15 * 1024 * 1024) {
            toast.error('O arquivo é muito grande! O limite é de 15MB.');
            return;
        }

        setIsUploading(true);
        try {
            const cleanName = file.name
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9.\-_]/g, '_');
            const fileName = `banner-${Date.now()}-${cleanName}`;
            const { error: uploadError } = await supabase.storage.from('assets').upload(fileName, file);
            if (uploadError) throw uploadError;
            
            const { data } = supabase.storage.from('assets').getPublicUrl(fileName);
            setPreviewUrl(data.publicUrl);
            toast.success('Arquivo enviado para o Supabase!');
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Erro ao fazer upload.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Gerenciar Banner Principal</h2>
                <p className="text-gray-500 mt-2">Altere a imagem ou vídeo de fundo da página inicial.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-3xl">
                <form onSubmit={handleSave} className="space-y-8">
                    {/* Preview Area */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 group flex items-center justify-center">
                        {isUploading ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
                                <p className="text-gray-500 font-medium">Enviando para o Supabase...</p>
                            </div>
                        ) : previewUrl ? (
                            <>
                                {previewUrl.match(/\.(mp4|webm)$/i) || previewUrl.includes('uc?') || previewUrl.includes('export=') ? (
                                    <video key={previewUrl} className="w-full h-full object-cover" autoPlay muted loop>
                                        <source src={previewUrl.replace('export=download&', '')} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img src={previewUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white font-bold">Clique abaixo para alterar</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <Upload size={48} className="mb-4" />
                                <p className="font-bold">Nenhum banner selecionado</p>
                            </div>
                        )}
                    </div>

                    {/* Upload Input */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700">Selecione uma nova imagem ou vídeo (MP4)</label>
                        <input
                            type="file"
                            accept="image/*,video/mp4"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-3 file:px-6
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-pink-50 file:text-pink-600
                                hover:file:bg-pink-100
                                cursor-pointer disabled:opacity-50"
                        />
                        <p className="text-xs text-gray-400">Recomendado: 1920x1080px (Alta Resolução). Vídeos max 15MB.</p>
                        <p className="text-xs text-blue-600">✅ Arquivo salvo no Supabase Storage · URL salva no banco de dados</p>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={isLoading || isUploading || !previewUrl}
                            className="px-6 py-3 text-red-500 hover:bg-red-50 font-bold rounded-xl disabled:opacity-50 transition-all"
                        >
                            Remover Banner Atual
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading || isUploading || !previewUrl}
                            className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                        >
                            {isLoading ? 'Salvando...' : (
                                <>
                                    <Save size={20} />
                                    Salvar Alterações
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
