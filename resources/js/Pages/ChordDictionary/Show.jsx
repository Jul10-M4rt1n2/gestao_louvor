import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ChordDiagram from '@/Components/Music/ChordDiagram';

export default function Show({ chord, relatedChords }) {
    return (
        <AppLayout>
            <Head title={`${chord.name} - Dicionário de Acordes`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Back button */}
                    <div className="mb-6">
                        <Link
                            href="/chords"
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            ← Voltar ao Dicionário
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Main Content */}
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="mb-6">
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    {chord.name}
                                </h1>
                                <p className="text-xl text-gray-600">{chord.fullName}</p>
                            </div>

                            {/* Chord Diagram */}
                            <div className="mb-8 bg-gray-50 rounded-lg p-6">
                                <ChordDiagram chord={chord} size="large" />
                            </div>

                            {/* Chord Info */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                        Notas do Acorde
                                    </h3>
                                    <div className="flex gap-3">
                                        {chord.notes.map((note) => (
                                            <span
                                                key={note}
                                                className="px-4 py-2 bg-indigo-100 text-indigo-800 font-semibold rounded-lg"
                                            >
                                                {note}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                        Tipo de Acorde
                                    </h3>
                                    <p className="text-gray-900 font-medium capitalize">
                                        {chord.type === 'major' && 'Maior'}
                                        {chord.type === 'minor' && 'Menor'}
                                        {chord.type === '7' && 'Sétima'}
                                        {chord.type === 'maj7' && 'Sétima Maior'}
                                        {chord.type === 'm7' && 'Sétima Menor'}
                                        {chord.type === 'sus2' && 'Suspenso 2ª'}
                                        {chord.type === 'sus4' && 'Suspenso 4ª'}
                                        {chord.type === 'dim' && 'Diminuto'}
                                        {chord.type === 'aug' && 'Aumentado'}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                        Tonalidade
                                    </h3>
                                    <p className="text-gray-900 font-medium">{chord.key}</p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* How to read diagram */}
                            <div className="bg-blue-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    📖 Como Ler o Diagrama
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start">
                                        <span className="font-bold mr-2">•</span>
                                        <span>Linhas verticais = Cordas do violão (6 cordas)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-bold mr-2">•</span>
                                        <span>Linhas horizontais = Trastes</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-bold mr-2">•</span>
                                        <span>Pontos pretos = Onde colocar os dedos</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-bold mr-2">•</span>
                                        <span>Números = Qual dedo usar (1=indicador, 2=médio, 3=anelar, 4=mínimo)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-600 font-bold mr-2">O</span>
                                        <span>= Corda solta (tocar sem pressionar)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-red-600 font-bold mr-2">X</span>
                                        <span>= Corda abafada (não tocar)</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Related Chords */}
                            {relatedChords && relatedChords.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        🎼 Acordes Relacionados
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {relatedChords.map((related) => (
                                            <Link
                                                key={related.name}
                                                href={`/chords/${related.name}`}
                                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center"
                                            >
                                                <div className="font-bold text-gray-900 mb-1">
                                                    {related.name}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {related.fullName}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tips */}
                            <div className="bg-green-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    💡 Dicas de Prática
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>✓ Pratique o acorde lentamente até conseguir o som limpo</li>
                                    <li>✓ Toque cada corda individualmente para verificar</li>
                                    <li>✓ Certifique-se de pressionar bem as cordas</li>
                                    <li>✓ Mantenha o polegar atrás do braço do violão</li>
                                    <li>✓ Pratique transições entre acordes relacionados</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
