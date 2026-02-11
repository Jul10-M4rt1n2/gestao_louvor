import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Edit({ auth, music, keys, errors: serverErrors }) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const { data, setData, put, processing, errors } = useForm({
        title: music.title || '',
        artist: music.artist || '',
        genre: music.genre || '',
        original_key: music.original_key || '',
        bpm: music.bpm || '',
        lyrics: music.lyrics || '',
        chords_text: music.chords_text || '',
        notes: music.notes || '',
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== '') {
                if (key === 'file' && data[key]) {
                    formData.append(key, data[key]);
                } else if (key !== 'file') {
                    formData.append(key, data[key]);
                }
            }
        });
        
        formData.append('_method', 'PUT');
        
        put(route('music.update', music.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Success handled by Inertia
            },
        });
    };

    const handleDelete = () => {
        router.delete(route('music.destroy', music.id), {
            onSuccess: () => {
                // Redirect handled by controller
            },
        });
        setShowDeleteConfirm(false);
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={`Editar ${music.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Editar Música
                                </h2>
                                <Link
                                    href={route('music.show', music.id)}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Cancelar
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        Título *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                {/* Artist */}
                                <div>
                                    <label htmlFor="artist" className="block text-sm font-medium text-gray-700">
                                        Artista
                                    </label>
                                    <input
                                        type="text"
                                        id="artist"
                                        value={data.artist}
                                        onChange={e => setData('artist', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.artist && (
                                        <p className="mt-1 text-sm text-red-600">{errors.artist}</p>
                                    )}
                                </div>

                                {/* Genre and Key Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                                            Gênero
                                        </label>
                                        <input
                                            type="text"
                                            id="genre"
                                            value={data.genre}
                                            onChange={e => setData('genre', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Gospel, Adoração, etc."
                                        />
                                        {errors.genre && (
                                            <p className="mt-1 text-sm text-red-600">{errors.genre}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="original_key" className="block text-sm font-medium text-gray-700">
                                            Tom Original
                                        </label>
                                        <select
                                            id="original_key"
                                            value={data.original_key}
                                            onChange={e => setData('original_key', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">Selecione um tom</option>
                                            {keys && keys.map(key => (
                                                <option key={key} value={key}>
                                                    {key}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.original_key && (
                                            <p className="mt-1 text-sm text-red-600">{errors.original_key}</p>
                                        )}
                                    </div>
                                </div>

                                {/* BPM */}
                                <div>
                                    <label htmlFor="bpm" className="block text-sm font-medium text-gray-700">
                                        BPM (Batidas por Minuto)
                                    </label>
                                    <input
                                        type="number"
                                        id="bpm"
                                        value={data.bpm}
                                        onChange={e => setData('bpm', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        min="1"
                                        max="300"
                                    />
                                    {errors.bpm && (
                                        <p className="mt-1 text-sm text-red-600">{errors.bpm}</p>
                                    )}
                                </div>

                                {/* Lyrics */}
                                <div>
                                    <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700">
                                        Letra com Cifras
                                    </label>
                                    <textarea
                                        id="lyrics"
                                        value={data.lyrics}
                                        onChange={e => setData('lyrics', e.target.value)}
                                        rows={10}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
                                        placeholder="Digite a letra com as cifras na linha acima da letra..."
                                    />
                                    {errors.lyrics && (
                                        <p className="mt-1 text-sm text-red-600">{errors.lyrics}</p>
                                    )}
                                </div>

                                {/* Chords Text */}
                                <div>
                                    <label htmlFor="chords_text" className="block text-sm font-medium text-gray-700">
                                        Apenas Acordes
                                    </label>
                                    <textarea
                                        id="chords_text"
                                        value={data.chords_text}
                                        onChange={e => setData('chords_text', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
                                        placeholder="C G Am F D..."
                                    />
                                    {errors.chords_text && (
                                        <p className="mt-1 text-sm text-red-600">{errors.chords_text}</p>
                                    )}
                                </div>

                                {/* Notes */}
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                        Notas / Observações
                                    </label>
                                    <textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Notas sobre a música, instruções especiais, etc."
                                    />
                                    {errors.notes && (
                                        <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                    )}
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                                        Substituir Arquivo (PDF, DOC, DOCX)
                                    </label>
                                    {music.file_path && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            Arquivo atual: {music.file_path.split('/').pop()}
                                        </p>
                                    )}
                                    <input
                                        type="file"
                                        id="file"
                                        onChange={e => setData('file', e.target.files[0])}
                                        accept=".pdf,.doc,.docx"
                                        className="mt-1 block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-indigo-50 file:text-indigo-700
                                            hover:file:bg-indigo-100"
                                    />
                                    {errors.file && (
                                        <p className="mt-1 text-sm text-red-600">{errors.file}</p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Excluir
                                    </button>

                                    <div className="flex space-x-3">
                                        <Link
                                            href={route('music.show', music.id)}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Cancelar
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                        >
                                            {processing ? 'Salvando...' : 'Salvar Alterações'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Confirmar Exclusão
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Tem certeza que deseja excluir a música "{music.title}"? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
