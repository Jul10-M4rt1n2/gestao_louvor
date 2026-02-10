import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ music, transposed, chords, currentKey }) {
    const [selectedKey, setSelectedKey] = useState(currentKey || music.original_key || '');

    const handleKeyChange = (newKey) => {
        setSelectedKey(newKey);
        router.get(`/music/${music.id}`, { key: newKey }, { preserveState: true });
    };

    const displayedLyrics = transposed ? transposed.lyrics : music.lyrics;
    const displayedChords = transposed ? transposed.chords_text : music.chords_text;

    return (
        <AppLayout>
            <Head title={music.title} />

            <div className="py-6">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{music.title}</h1>
                                {music.artist && (
                                    <p className="text-lg text-gray-600 mt-1">{music.artist}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/music/${music.id}/edit`}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Editar
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Key Selector */}
                            {music.original_key && (
                                <div className="bg-white shadow rounded-lg p-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <label className="text-sm font-medium text-gray-700">
                                                Tonalidade:
                                            </label>
                                            <select
                                                value={selectedKey}
                                                onChange={(e) => handleKeyChange(e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
                                            {transposed && (
                                                <span className="text-sm text-green-600 flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Transposta de {music.original_key} para {selectedKey}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Lyrics */}
                            {displayedLyrics && (
                                <div className="bg-white shadow rounded-lg p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Letra e Cifras</h2>
                                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-900">
                                        {displayedLyrics}
                                    </pre>
                                </div>
                            )}

                            {/* Chords Only (if available and no lyrics) */}
                            {!displayedLyrics && displayedChords && (
                                <div className="bg-white shadow rounded-lg p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Acordes</h2>
                                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-900">
                                        {displayedChords}
                                    </pre>
                                </div>
                            )}

                            {/* Notes */}
                            {music.notes && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-yellow-800">Observações</p>
                                            <p className="mt-1 text-sm text-yellow-700">{music.notes}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Info Card */}
                            <div className="bg-white shadow rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                                    Informações
                                </h3>
                                <dl className="space-y-3">
                                    {music.genre && (
                                        <div>
                                            <dt className="text-sm text-gray-500">Gênero</dt>
                                            <dd className="mt-1">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {music.genre}
                                                </span>
                                            </dd>
                                        </div>
                                    )}
                                    {music.original_key && (
                                        <div>
                                            <dt className="text-sm text-gray-500">Tom Original</dt>
                                            <dd className="mt-1">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {music.original_key}
                                                </span>
                                            </dd>
                                        </div>
                                    )}
                                    {music.bpm && (
                                        <div>
                                            <dt className="text-sm text-gray-500">BPM</dt>
                                            <dd className="mt-1 text-sm font-medium text-gray-900">{music.bpm}</dd>
                                        </div>
                                    )}
                                    {music.creator && (
                                        <div>
                                            <dt className="text-sm text-gray-500">Cadastrado por</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{music.creator.name}</dd>
                                        </div>
                                    )}
                                    {music.created_at && (
                                        <div>
                                            <dt className="text-sm text-gray-500">Data</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{music.created_at}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            {/* Detected Chords */}
                            {chords && chords.length > 0 && (
                                <div className="bg-white shadow rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                                        Acordes Detectados
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {chords.map((chord, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800"
                                            >
                                                {chord}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* File Download */}
                            {music.file_path && (
                                <div className="bg-white shadow rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                                        Arquivo
                                    </h3>
                                    <a
                                        href={music.file_path}
                                        download
                                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Baixar {music.file_type?.toUpperCase()}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
