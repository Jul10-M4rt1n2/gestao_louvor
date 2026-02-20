import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Bem-vindo" />
            
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                <div className="flex min-h-screen items-center justify-center p-6">
                    <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-12">
                        <div className="text-center">
                            <h1 className="text-6xl font-bold text-gray-900 mb-4">
                                🎵 Gestão Louvor
                            </h1>
                            <p className="text-2xl text-gray-600 mb-8">
                                Sistema de Gerenciamento de Ministérios de Louvor
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                <div className="bg-indigo-50 p-6 rounded-2xl">
                                    <div className="text-4xl mb-3">🎸</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Gestão de Músicas
                                    </h3>
                                    <p className="text-gray-600">
                                        Cadastro, transposição de cifras, upload de PDFs e busca avançada
                                    </p>
                                </div>
                                
                                <div className="bg-purple-50 p-6 rounded-2xl">
                                    <div className="text-4xl mb-3">👥</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Grupos e Escalas
                                    </h3>
                                    <p className="text-gray-600">
                                        Organize grupos, crie escalas e gerencie participantes
                                    </p>
                                </div>
                                
                                <div className="bg-pink-50 p-6 rounded-2xl">
                                    <div className="text-4xl mb-3">💬</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Chat em Tempo Real
                                    </h3>
                                    <p className="text-gray-600">
                                        Comunicação instantânea com seu grupo ou organização
                                    </p>
                                </div>
                                
                                <div className="bg-yellow-50 p-6 rounded-2xl">
                                    <div className="text-4xl mb-3">🎼</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Ferramentas Musicais
                                    </h3>
                                    <p className="text-gray-600">
                                        Afinador cromático, dicionário de acordes e muito mais
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                                        ✅ Status da Implementação
                                    </h3>
                                    <ul className="text-left text-green-800 space-y-1">
                                        <li>• Banco de dados completo (17 migrations)</li>
                                        <li>• Models com relacionamentos (8 models)</li>
                                        <li>• ChordTranspositionService (22 testes passando!)</li>
                                        <li>• Enums do domínio (Key, ChordType, UserRole, InstrumentType)</li>
                                        <li>• Frontend Inertia.js + React configurado</li>
                                        <li>• RoleSeeder com 4 roles (Admin, Líder, Músico, Visitante)</li>
                                    </ul>
                                </div>
                                
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                        🚧 Próximos Passos
                                    </h3>
                                    <p className="text-left text-blue-800">
                                        Controllers, Routes, mais páginas React, Services adicionais,
                                        autenticação, políticas de autorização, e testes de feature.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-8 text-gray-500 text-sm">
                                <p>Laravel 12 + React 18 + Inertia.js 2.0 + TailwindCSS 4.0</p>
                                <p className="mt-2">Desenvolvido com ❤️ seguindo arquitetura SOLID</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
