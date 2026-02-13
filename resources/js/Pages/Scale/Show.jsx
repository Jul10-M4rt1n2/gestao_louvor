import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
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

    const getCsrfToken = () => document.querySelector('meta[name="csrf-token"]')?.content;

    const fetchTransposed = async (scheduleMusic, toKey) => {
        const originalKey = scheduleMusic.music?.original_key;
        if (!originalKey || !toKey || toKey === originalKey) {
            setTransposedMap((prev) => {
                const next = { ...prev };
                delete next[scheduleMusic.id];
                return next;
            });
            return;
        }

        try {
            const csrfToken = getCsrfToken();
            const response = await fetch(`/music/${scheduleMusic.music.id}/transpose-json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    from_key: originalKey,
                    to_key: toKey,
                }),
            });

            if (!response.ok) {
                throw new Error('Falha ao transpor música');
            }

            const payload = await response.json();
            setTransposedMap((prev) => ({
                ...prev,
                [scheduleMusic.id]: {
                    key: toKey,
                    lyrics: payload.lyrics ?? null,
                    chords_text: payload.chords_text ?? null,
                },
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const handlePresentationKeyChange = (scheduleMusic, newKey) => {
        setPresentationKeys((prev) => ({
            ...prev,
            [scheduleMusic.id]: newKey,
        }));
        fetchTransposed(scheduleMusic, newKey);
    };

    const handleOpenPresentation = () => {
        if (scheduleMusics.length === 0) {
            return;
        }
        setPresentationIndex(0);
        setPresentationOpen(true);
    };

    const handleClosePresentation = () => {
        setPresentationOpen(false);
    };

    useEffect(() => {
        if (!presentationOpen) {
            return;
        }
        const current = scheduleMusics[presentationIndex];
        if (!current) {
            return;
        }
        const desiredKey = presentationKeys[current.id];
        if (!desiredKey || desiredKey === current.music?.original_key) {
            return;
        }
        if (transposedMap[current.id]?.key === desiredKey) {
            return;
        }
        fetchTransposed(current, desiredKey);
    }, [presentationOpen, presentationIndex, presentationKeys, transposedMap, scheduleMusics]);

    const getDisplayedText = (scheduleMusic) => {
        const transposed = transposedMap[scheduleMusic.id];
        const lyrics = transposed?.lyrics ?? scheduleMusic.music?.lyrics ?? null;
        const chordsText = transposed?.chords_text ?? scheduleMusic.music?.chords_text ?? null;
        return lyrics || chordsText || '';
    };

    const getDisplayedKey = (scheduleMusic) => {
        const currentKey = presentationKeys[scheduleMusic.id];
        return currentKey || scheduleMusic.music?.original_key || '';
    };

    const canNavigatePrev = presentationIndex > 0;
    const canNavigateNext = presentationIndex < scheduleMusics.length - 1;

    const currentScheduleMusic = scheduleMusics[presentationIndex];

    const statusBadges = {
        planejada: 'bg-yellow-100 text-yellow-800',
        confirmada: 'bg-green-100 text-green-800',
        em_andamento: 'bg-blue-100 text-blue-800',
        concluida: 'bg-gray-100 text-gray-800',
        cancelada: 'bg-red-100 text-red-800',
    };

    const participantStatusBadges = {
        convidado: 'bg-blue-100 text-blue-800',
        confirmado: 'bg-green-100 text-green-800',
        rejeitado: 'bg-red-100 text-red-800',
        ausente: 'bg-gray-100 text-gray-800',
    };

    const statusLabels = {
        planejada: 'Planejada',
        confirmada: 'Confirmada',
        em_andamento: 'Em Andamento',
        concluida: 'Concluída',
        cancelada: 'Cancelada',
    };

    const participantStatusLabels = {
        convidado: 'Convidado',
        confirmado: 'Confirmado',
        rejeitado: 'Rejeitado',
        ausente: 'Ausente',
    };

    return (
        <AppLayout>
            <Head title={schedule.title} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href="/scales"
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
                                    {schedule.title}
                                </h2>
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadges[schedule.status]}`}>
                                        {statusLabels[schedule.status]}
                                    </span>
                                    {schedule.group && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                            {schedule.group.ministry?.icon} {schedule.group.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2 md:mt-0 md:ml-4">
                                <Link
                                    href={`/scales/${schedule.id}/edit`}
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
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Schedule Info */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações</h3>

                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {schedule.type && (
                                        <div>
                                            <dt className="text-sm text-gray-500">Tipo</dt>
                                            <dd className="mt-1 text-sm font-medium text-gray-900">{schedule.type}</dd>
                                        </div>
                                    )}
                                    {schedule.scheduled_date && (
                                        <div>
                                            <dt className="text-sm text-gray-500">Data e Hora</dt>
                                            <dd className="mt-1 text-sm font-medium text-gray-900">{schedule.scheduled_date}</dd>
                                        </div>
                                    )}
                                    {schedule.duration && (
                                        <div>
                                            <dt className="text-sm text-gray-500">Duração</dt>
                                            <dd className="mt-1 text-sm font-medium text-gray-900">{schedule.duration}</dd>
                                        </div>
                                    )}
                                    {schedule.location && (
                                        <div>
                                            <dt className="text-sm text-gray-500">Local</dt>
                                            <dd className="mt-1 text-sm font-medium text-gray-900">{schedule.location}</dd>
                                        </div>
                                    )}
                                </dl>

                                {schedule.description && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <dt className="text-sm text-gray-500 mb-1">Descrição</dt>
                                        <dd className="text-sm text-gray-900">{schedule.description}</dd>
                                    </div>
                                )}
                            </div>

                            {/* Music Section */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Músicas ({scheduleMusics.length})
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleOpenPresentation}
                                            disabled={scheduleMusics.length === 0}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4l12 8-12 8V4z" />
                                            </svg>
                                            Apresentar
                                        </button>
                                        <button
                                            onClick={() => setShowAddMusicModal(true)}
                                            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Adicionar Música
                                        </button>
                                    </div>
                                </div>

                                {scheduleMusics.length > 0 ? (
                                    <div className="space-y-3">
                                        {scheduleMusics.map((scheduleMusic, index) => (
                                            <div
                                                key={scheduleMusic.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="flex flex-col gap-1">
                                                        <button
                                                            onClick={() => handleReorderMusic(scheduleMusic.id, 'up')}
                                                            disabled={index === 0}
                                                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                            title="Mover para cima"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleReorderMusic(scheduleMusic.id, 'down')}
                                                            disabled={index === scheduleMusics.length - 1}
                                                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                            title="Mover para baixo"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                                                        {scheduleMusic.order}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-medium text-gray-900">
                                                            {scheduleMusic.music.title}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500">
                                                            {scheduleMusic.music.artist && (
                                                                <span>{scheduleMusic.music.artist}</span>
                                                            )}
                                                            {scheduleMusic.music.original_key && (
                                                                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                                                                    Tom Original: {scheduleMusic.music.original_key}
                                                                </span>
                                                            )}
                                                            {scheduleMusic.custom_key && (
                                                                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">
                                                                    Tom Customizado: {scheduleMusic.custom_key}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveMusic(scheduleMusic.id)}
                                                    className="ml-4 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                                                    title="Remover música"
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Nenhuma música adicionada ainda.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Participants Section */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Participantes ({participants.length})
                                    </h3>
                                    <button
                                        onClick={() => setShowAddParticipantModal(true)}
                                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Adicionar Participante
                                    </button>
                                </div>

                                {participants.length > 0 ? (
                                    <div className="space-y-3">
                                        {participants.map((participant) => (
                                            <div
                                                key={participant.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        {participant.user.name}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {participant.function && (
                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                                                {participant.function}
                                                            </span>
                                                        )}
                                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${participantStatusBadges[participant.status]}`}>
                                                            {participantStatusLabels[participant.status]}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <select
                                                        value={participant.status}
                                                        onChange={(e) => handleUpdateParticipantStatus(participant.id, e.target.value)}
                                                        className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                                    >
                                                        <option value="convidado">Convidado</option>
                                                        <option value="confirmado">Confirmado</option>
                                                        <option value="rejeitado">Rejeitado</option>
                                                        <option value="ausente">Ausente</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleRemoveParticipant(participant.id)}
                                                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                                                        title="Remover participante"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Nenhum participante adicionado ainda.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white shadow rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                                    Estatísticas
                                </h3>
                                <dl className="space-y-3">
                                    <div>
                                        <dt className="text-sm text-gray-500">Total de Músicas</dt>
                                        <dd className="mt-1 text-2xl font-semibold text-gray-900">{scheduleMusics.length}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Total de Participantes</dt>
                                        <dd className="mt-1 text-2xl font-semibold text-gray-900">{participants.length}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Confirmados</dt>
                                        <dd className="mt-1 text-2xl font-semibold text-green-600">
                                            {participants.filter(p => p.status === 'confirmado').length}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            {schedule.created_at && (
                                <div className="bg-white shadow rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                                        Registro
                                    </h3>
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm text-gray-500">Criado em</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{schedule.created_at}</dd>
                                        </div>
                                        {schedule.updated_at && schedule.updated_at !== schedule.created_at && (
                                            <div>
                                                <dt className="text-sm text-gray-500">Atualizado em</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{schedule.updated_at}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Delete Modal */}
                    {showDeleteModal && (
                        <div className="fixed z-50 inset-0 overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>

                                <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Excluir Escala
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Tem certeza que deseja excluir esta escala? Esta ação não pode ser desfeita.
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

                    {/* Add Music Modal */}
                    {showAddMusicModal && (
                        <div className="fixed z-50 inset-0 overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddMusicModal(false)}></div>

                                <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        Adicionar Música
                                    </h3>
                                    <form onSubmit={handleAddMusic} className="space-y-4">
                                        <div>
                                            <label htmlFor="music_id" className="block text-sm font-medium text-gray-700 mb-1">
                                                Música <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="music_id"
                                                value={musicData.music_id}
                                                onChange={(e) => setMusicData('music_id', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            >
                                                <option value="">Selecione uma música</option>
                                                {availableMusics.map((music) => (
                                                    <option key={music.id} value={music.id}>
                                                        {music.title} {music.artist && `- ${music.artist}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="custom_key" className="block text-sm font-medium text-gray-700 mb-1">
                                                Tom Customizado (opcional)
                                            </label>
                                            <select
                                                id="custom_key"
                                                value={musicData.custom_key}
                                                onChange={(e) => setMusicData('custom_key', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Tom original</option>
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

                                        <div className="flex gap-2 pt-4">
                                            <button
                                                type="submit"
                                                disabled={processingMusic}
                                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                            >
                                                {processingMusic ? 'Adicionando...' : 'Adicionar'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddMusicModal(false)}
                                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add Participant Modal */}
                    {showAddParticipantModal && (
                        <div className="fixed z-50 inset-0 overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddParticipantModal(false)}></div>

                                <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        Adicionar Participante
                                    </h3>
                                    <form onSubmit={handleAddParticipant} className="space-y-4">
                                        <div>
                                            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
                                                Pessoa <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="user_id"
                                                value={participantData.user_id}
                                                onChange={(e) => setParticipantData('user_id', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            >
                                                <option value="">Selecione uma pessoa</option>
                                                {availableUsers.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="function_id" className="block text-sm font-medium text-gray-700 mb-1">
                                                Função
                                            </label>
                                            <select
                                                id="function_id"
                                                value={participantData.function_id}
                                                onChange={(e) => setParticipantData('function_id', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Sem função específica</option>
                                                {(availableFunctions || []).map((fn) => (
                                                    <option key={fn.id} value={fn.id}>
                                                        {fn.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="participant_status" className="block text-sm font-medium text-gray-700 mb-1">
                                                Status
                                            </label>
                                            <select
                                                id="participant_status"
                                                value={participantData.status}
                                                onChange={(e) => setParticipantData('status', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="convidado">Convidado</option>
                                                <option value="confirmado">Confirmado</option>
                                                <option value="rejeitado">Rejeitado</option>
                                                <option value="ausente">Ausente</option>
                                            </select>
                                        </div>

                                        <div className="flex gap-2 pt-4">
                                            <button
                                                type="submit"
                                                disabled={processingParticipant}
                                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                            >
                                                {processingParticipant ? 'Adicionando...' : 'Adicionar'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddParticipantModal(false)}
                                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {presentationOpen && currentScheduleMusic && (
                        <div className="fixed inset-0 z-50 flex flex-col bg-gray-900/80">
                            <div className="bg-white shadow">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {currentScheduleMusic.music?.title || 'Música'}
                                        </h2>
                                        {currentScheduleMusic.music?.artist && (
                                            <p className="text-sm text-gray-600">
                                                {currentScheduleMusic.music.artist}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-500">
                                            {presentationIndex + 1} de {scheduleMusics.length}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={() => setPresentationIndex((prev) => Math.max(prev - 1, 0))}
                                            disabled={!canNavigatePrev}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Anterior
                                        </button>
                                        <button
                                            onClick={() => setPresentationIndex((prev) => Math.min(prev + 1, scheduleMusics.length - 1))}
                                            disabled={!canNavigateNext}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Próxima
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-600">Colunas</label>
                                            <select
                                                value={presentationColumns}
                                                onChange={(e) => setPresentationColumns(Number(e.target.value))}
                                                className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-600">Tom</label>
                                            <select
                                                value={getDisplayedKey(currentScheduleMusic)}
                                                onChange={(e) => handlePresentationKeyChange(currentScheduleMusic, e.target.value)}
                                                disabled={!currentScheduleMusic.music?.original_key}
                                                className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                                            >
                                                <option value="">Selecione</option>
                                                {keyOptions.map((key) => (
                                                    <option key={key} value={key}>{key}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            onClick={handleClosePresentation}
                                            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                                        >
                                            Fechar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto bg-white">
                                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                        {getDisplayedText(currentScheduleMusic) ? (
                                            <div
                                                className="font-mono text-base leading-relaxed text-gray-900"
                                                style={{ columnCount: presentationColumns, columnGap: '2rem', whiteSpace: 'pre-wrap' }}
                                            >
                                                {getDisplayedText(currentScheduleMusic)}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                Esta música não tem letra ou cifras cadastradas.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
