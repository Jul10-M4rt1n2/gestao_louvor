import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Dashboard() {
    const { auth } = usePage().props;

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-bold mb-4">
                                Bem-vindo, {auth.user?.name}! 👋
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                <div className="bg-indigo-50 p-6 rounded-lg">
                                    <div className="text-3xl mb-2">🎸</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Músicas</h3>
                                    <p className="text-gray-600 text-sm">
                                        Gerencie o repertório de músicas do ministério
                                    </p>
                                </div>

                                <div className="bg-purple-50 p-6 rounded-lg">
                                    <div className="text-3xl mb-2">👥</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Grupos</h3>
                                    <p className="text-gray-600 text-sm">
                                        Organize grupos e escalas de louvor
                                    </p>
                                </div>

                                <div className="bg-pink-50 p-6 rounded-lg">
                                    <div className="text-3xl mb-2">📅</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Escalas</h3>
                                    <p className="text-gray-600 text-sm">
                                        Gerencie as escalas de cultos e eventos
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-900">
                                    <strong>Organização:</strong> {auth.user?.organization?.name || 'Não definida'}
                                </p>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3">Início Rápido</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Complete seu perfil e adicione uma foto</li>
                                    <li>• Explore o repertório de músicas disponíveis</li>
                                    <li>• Participe de um grupo de louvor</li>
                                    <li>• Verifique as próximas escalas</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
