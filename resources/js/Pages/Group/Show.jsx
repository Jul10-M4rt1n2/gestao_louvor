import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ schedule, scheduleMusics, participants, availableMusics, availableUsers, availableFunctions }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddMusicModal, setShowAddMusicModal] = useState(false);
    const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);

    const keyOptions = [
        'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
        'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm',
    ];

    const [presentationOpen, setPresentationOpen] = useState(false);
    const [presentationIndex, setPresentationIndex] = useState(0);
    const [presentationColumns, setPresentationColumns] = useState(2);
    const [presentationKeys, setPresentationKeys] = useState(() => (
        scheduleMusics.reduce((acc, scheduleMusic) => {
            acc[scheduleMusic.id] = scheduleMusic.custom_key || scheduleMusic.music?.original_key || '';
            return acc;
        }, {})
    ));
    const [transposedMap, setTransposedMap] = useState({});

    // --- Forms para adicionar música e participante ---
    const { data: musicData, setData: setMusicData, post: postMusic, processing: processingMusic, reset: resetMusic } = useForm({
        music_id: '',
        custom_key: '',
        notes: '',
    });

    const { data: participantData, setData: setParticipantData, post: postParticipant, processing: processingParticipant, reset: resetParticipant } = useForm({
        user_id: '',
        function_id: '',
        status: 'convidado',
    });

    // --- Funções de ação ---

    const handleDelete = () => {
        router.delete(`/scales/${schedule.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
            },
        });
    };

    const handleAddMusic = (e) => {
        e.preventDefault();
        postMusic(`/scales/${schedule.id}/music`, {
            onSuccess: () => {
                setShowAddMusicModal(false);
                resetMusic();
            },
        });
    };

    const handleRemoveMusic = (scheduleMusicId) => {
        if (confirm('Tem certeza que deseja remover esta música do grupo?')) {
            router.delete(`/groups/${group.id}/members/${userId}`);
        }
    };

    const handleAddParticipant = (e) => {
        e.preventDefault();
        postParticipant(`/groups/${group.id}/members`, {
            onSuccess: () => {
                setShowAddParticipantModal(false);
                resetParticipant();
            },
        });
    };

    const toggleFunction = (functionId) => {
        const currentFunctions = data.function_ids;
        if (currentFunctions.includes(functionId)) {
            setData('function_ids', currentFunctions.filter(id => id !== functionId));
        } else {
            setData('function_ids', [...currentFunctions, functionId]);
        }
    };

    const weekDayLabels = {
        sunday: 'Domingo',
        monday: 'Segunda',
        tuesday: 'Terça',
        wednesday: 'Quarta',
        thursday: 'Quinta',
        friday: 'Sexta',
        saturday: 'Sábado',
    };

    return (
        <AppLayout>
            <Head title={group.name} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href="/groups"
                            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center mb-2"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Voltar para lista
                        </Link>

                        <div className="md:flex md:items-start md:justify-between">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {group.name}
                                </h2>
                                {group.ministry && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        {group.ministry.icon} {group.ministry.name}
                                    </span>
                                )}
                            </div>
                            <div className="mt-4 flex gap-2 md:mt-0 md:ml-4">
                                <Link
                                    href={`/groups/${group.id}/edit`}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Editar
                                </Link>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Group Info */}
                        <div className="lg:col-span-1">
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações</h3>

                                <div className="space-y-4">
                                    {/* Status */}
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                            group.active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {group.active ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    {group.description && (
                                        <div>
                                            <p className="text-sm text-gray-500">Descrição</p>
                                            <p className="text-sm text-gray-900 mt-1">{group.description}</p>
                                        </div>
                                    )}

                                    {/* Schedule Frequency */}
                                    {group.schedule_frequency && (
                                        <div>
                                            <p className="text-sm text-gray-500">Frequência de Ensaios</p>
                                            <p className="text-sm text-gray-900 mt-1">📅 {group.schedule_frequency}</p>
                                        </div>
                                    )}

                                    {/* Meeting Days */}
                                    {group.meeting_days && group.meeting_days.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">Dias de Reunião</p>
                                            <div className="flex flex-wrap gap-1">
                                                {group.meeting_days.map((day) => (
                                                    <span
                                                        key={day}
                                                        className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded"
                                                    >
                                                        {weekDayLabels[day]}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Dates */}
                                    <div>
                                        <p className="text-sm text-gray-500">Criado em</p>
                                        <p className="text-sm text-gray-900 mt-1">{group.created_at}</p>
                                    </div>

                                    {group.updated_at !== group.created_at && (
                                        <div>
                                            <p className="text-sm text-gray-500">Atualizado em</p>
                                            <p className="text-sm text-gray-900 mt-1">{group.updated_at}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Members */}
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Membros ({members.length})
                                    </h3>
                                    <button
                                        onClick={() => setShowAddMemberModal(true)}
                                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Adicionar Membro
                                    </button>
                                </div>

                                {members.length > 0 ? (
                                    <div className="space-y-3">
                                        {members.map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        {member.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">{member.email}</p>
                                                    {member.functions && member.functions.length > 0 && (
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            {member.functions.map((func, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                                                                >
                                                                    {func}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteMember(member.id)}
                                                    className="ml-4 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Remover membro"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Nenhum membro cadastrado neste grupo.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Delete Modal */}
                    {showDeleteModal && (
                        <div className="fixed z-50 inset-0 overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>

                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                                <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Excluir Grupo
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Tem certeza que deseja excluir este grupo? Esta ação não pode ser desfeita.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                                        >
                                            Excluir
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteModal(false)}
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add Member Modal */}
                    {showAddMemberModal && (
                        <div className="fixed z-50 inset-0 overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddMemberModal(false)}></div>

                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                                <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                    <div className="mb-4">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Adicionar Membro ao Grupo
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Selecione um usuário e as funções que ele irá desempenhar no grupo.
                                        </p>
                                    </div>

                                    <form onSubmit={handleAddMember} className="space-y-4">
                                        {/* User Selection */}
                                        <div>
                                            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">
                                                Usuário *
                                            </label>
                                            <select
                                                id="user_id"
                                                value={data.user_id}
                                                onChange={(e) => setData('user_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            >
                                                <option value="">Selecione um usuário</option>
                                                {availableUsers.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name} ({user.email})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.user_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
                                            )}
                                        </div>

                                        {/* Functions Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Funções (opcional)
                                            </label>
                                            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                                                {functions.map((func) => (
                                                    <label key={func.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.function_ids.includes(func.id)}
                                                            onChange={() => toggleFunction(func.id)}
                                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <span className="text-sm text-gray-900">
                                                            {func.icon && `${func.icon} `}{func.name}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.function_ids && (
                                                <p className="mt-1 text-sm text-red-600">{errors.function_ids}</p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm disabled:opacity-50"
                                            >
                                                {processing ? 'Adicionando...' : 'Adicionar Membro'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddMemberModal(false)}
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
