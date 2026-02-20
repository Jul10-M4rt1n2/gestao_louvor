import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ChordDiagram from '@/Components/Music/ChordDiagram';
import { useState } from 'react';

export default function Index({ chords, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedKey, setSelectedKey] = useState(filters.key || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');

    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const types = [
        { value: '', label: 'Todos' },
        { value: 'major', label: 'Maior' },
        { value: 'minor', label: 'Menor' },
        { value: '7', label: 'Sétima' },
        { value: 'maj7', label: 'Sétima Maior' },
        { value: 'm7', label: 'Sétima Menor' },
        { value: 'sus2', label: 'Sus2' },
        { value: 'sus4', label: 'Sus4' },
        { value: 'dim', label: 'Diminuto' },
        { value: 'aug', label: 'Aumentado' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/chords', {
            search,
            key: selectedKey,
            type: selectedType,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (filterType, value) => {
        const params = {
            search,
            key: selectedKey,
            type: selectedType,
        };

        if (filterType === 'key') {
            params.key = value === selectedKey ? '' : value;
            setSelectedKey(params.key);
        } else if (filterType === 'type') {
            params.type = value;
            setSelectedType(value);
        }

        router.get('/chords', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Dicionário de Acordes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            🎹 Dicionário de Acordes
                        </h1>
                        <p className="text-gray-600">
                            Explore {chords.length} acordes com diagramas para violão
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar acorde (ex: Em, C7, Gmaj7)..."
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                                >
                                    🔍 Buscar
                                </button>
                            </div>
                        </form>

                        {/* Key Filter */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filtrar por Tonalidade:
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {keys.map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => handleFilterChange('key', key)}
                                        className={`px-4 py-2 rounded-md font-medium transition ${
                                            selectedKey === key
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {key}
                                    </button>
                                ))}
                                {selectedKey && (
                                    <button
                                        onClick={() => handleFilterChange('key', '')}
                                        className="px-4 py-2 rounded-md font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
                                    >
                                        ✕ Limpar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filtrar por Tipo:
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                className="w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                {types.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results */}
                    {chords.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {chords.map((chord) => (
                                <Link
                                    key={chord.name}
                                    href={`/chords/${chord.name}`}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6 block"
                                >
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {chord.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {chord.fullName}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <ChordDiagram chord={chord} size="small" />
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">Notas:</span>{' '}
                                        {chord.notes.join(', ')}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <div className="text-6xl mb-4">🎸</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Nenhum acorde encontrado
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Tente ajustar os filtros ou buscar por outro termo.
                            </p>
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setSelectedKey('');
                                    setSelectedType('');
                                    router.get('/chords');
                                }}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
