import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        artist: '',
        genre: '',
        original_key: '',
        bpm: '',
        lyrics: '',
        chords_text: '',
        notes: '',
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/music');
    };

    return (
        <AppLayout>
            <Head title="Nova Música" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href="/music"
                            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center mb-2"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Voltar para lista
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900">Nova Música</h2>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Título <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.title ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        {/* Artist */}
                        <div>
                            <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-1">
                                Artista/Compositor
                            </label>
                            <input
                                type="text"
                                id="artist"
                                value={data.artist}
                                onChange={(e) => setData('artist', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.artist ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.artist && <p className="mt-1 text-sm text-red-600">{errors.artist}</p>}
                        </div>

                        {/* Genre, Key, BPM */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                                    Gênero
                                </label>
                                <input
                                    type="text"
                                    id="genre"
                                    value={data.genre}
                                    onChange={(e) => setData('genre', e.target.value)}
                                    placeholder="Ex: Adoração, Gospel..."
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.genre ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.genre && <p className="mt-1 text-sm text-red-600">{errors.genre}</p>}
                            </div>

                            <div>
                                <label htmlFor="original_key" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tom Original
                                </label>
                                <select
                                    id="original_key"
                                    value={data.original_key}
                                    onChange={(e) => setData('original_key', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.original_key ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Selecione</option>
                                    <option value="C">C</option>
                                    <option value="C#">C#</option>
                                    <option value="D">D</option>
                                    <option value="D#">D#</option>
                                    <option value="E">E</option>
                                    <option value="F">F</option>
                                    <option value="F#">F#</option>
                                    <option value="G">G</option>
                                    <option value="G#">G#</option>
                                    <option value="A">A</option>
                                    <option value="A#">A#</option>
                                    <option value="B">B</option>
                                    <option value="Cm">Cm</option>
                                    <option value="Dm">Dm</option>
                                    <option value="Em">Em</option>
                                    <option value="Fm">Fm</option>
                                    <option value="Gm">Gm</option>
                                    <option value="Am">Am</option>
                                    <option value="Bm">Bm</option>
                                </select>
                                {errors.original_key && <p className="mt-1 text-sm text-red-600">{errors.original_key}</p>}
                            </div>

                            <div>
                                <label htmlFor="bpm" className="block text-sm font-medium text-gray-700 mb-1">
                                    BPM
                                </label>
                                <input
                                    type="number"
                                    id="bpm"
                                    min="1"
                                    max="300"
                                    value={data.bpm}
                                    onChange={(e) => setData('bpm', e.target.value)}
                                    placeholder="Ex: 120"
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.bpm ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.bpm && <p className="mt-1 text-sm text-red-600">{errors.bpm}</p>}
                            </div>
                        </div>

                        {/* Lyrics */}
                        <div>
                            <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 mb-1">
                                Letra com Cifras
                            </label>
                            <textarea
                                id="lyrics"
                                rows={10}
                                value={data.lyrics}
                                onChange={(e) => setData('lyrics', e.target.value)}
                                placeholder="Digite a letra da música com as cifras inline..."
                                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-mono ${
                                    errors.lyrics ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.lyrics && <p className="mt-1 text-sm text-red-600">{errors.lyrics}</p>}
                        </div>

                        {/* Chords Only */}
                        <div>
                            <label htmlFor="chords_text" className="block text-sm font-medium text-gray-700 mb-1">
                                Apenas Acordes (opcional)
                            </label>
                            <textarea
                                id="chords_text"
                                rows={4}
                                value={data.chords_text}
                                onChange={(e) => setData('chords_text', e.target.value)}
                                placeholder="Ex: C Am F G..."
                                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-mono ${
                                    errors.chords_text ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.chords_text && <p className="mt-1 text-sm text-red-600">{errors.chords_text}</p>}
                        </div>

                        {/* Notes */}
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                Observações
                            </label>
                            <textarea
                                id="notes"
                                rows={3}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Notas, instruções especiais..."
                                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.notes ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                        </div>

                        {/* File Upload */}
                        <div>
                            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                                Arquivo PDF/DOC (opcional)
                            </label>
                            <input
                                type="file"
                                id="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setData('file', e.target.files[0])}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.file ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
                            <p className="mt-1 text-sm text-gray-500">
                                Tamanho máximo: 10MB. Formatos: PDF, DOC, DOCX
                            </p>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'Salvando...' : 'Salvar Música'}
                            </button>
                            <Link
                                href="/music"
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
