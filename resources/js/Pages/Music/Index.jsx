import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ musics, genres, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [genre, setGenre] = useState(filters.genre || '');
    const [key, setKey] = useState(filters.key || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/music', { search, genre, key }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setGenre('');
        setKey('');
        router.get('/music');
    };

    return (
        <AppLayout>
            <Head title="Músicas" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                🎵 Repertório de Músicas
                            </h2>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <Link
                                href="/music/create"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Nova Música
                            </Link>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white shadow rounded-lg p-4 mb-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Search */}
                                <div className="md:col-span-2">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                        Buscar
                                    </label>
                                    <input
                                        type="text"
                                        id="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Título, artista ou gênero..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {/* Genre Filter */}
                                <div>
                                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                                        Gênero
                                    </label>
                                    <select
                                        id="genre"
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Todos</option>
                                        {genres.map((g) => (
                                            <option key={g} value={g}>
                                                {g}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Key Filter */}
                                <div>
                                    <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tonalidade
                                    </label>
                                    <select
                                        id="key"
                                        value={key}
                                        onChange={(e) => setKey(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Todas</option>
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
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Buscar
                                </button>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Limpar
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Music List */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        {musics.data && musics.data.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {musics.data.map((music) => (
                                    <li key={music.id}>
                                        <Link
                                            href={`/music/${music.id}`}
                                            className="block hover:bg-gray-50 transition duration-150"
                                        >
                                            <div className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-lg font-semibold text-indigo-600 truncate">
                                                            {music.title}
                                                        </p>
                                                        <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
                                                            {music.artist && (
                                                                <span className="flex items-center">
                                                                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                                    </svg>
                                                                    {music.artist}
                                                                </span>
                                                            )}
                                                            {music.genre && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                    {music.genre}
                                                                </span>
                                                            )}
                                                            {music.original_key && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                                    Tom: {music.original_key}
                                                                </span>
                                                            )}
                                                            {music.bpm && (
                                                                <span className="text-gray-500">
                                                                    {music.bpm} BPM
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma música encontrada</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Comece cadastrando uma nova música.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/music/create"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Nova Música
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {musics.data && musics.data.length > 0 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">{musics.from}</span> a{' '}
                                <span className="font-medium">{musics.to}</span> de{' '}
                                <span className="font-medium">{musics.total}</span> resultados
                            </div>
                            <div className="flex gap-2">
                                {musics.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        disabled={!link.url}
                                        className={`px-3 py-1 rounded-md text-sm ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
