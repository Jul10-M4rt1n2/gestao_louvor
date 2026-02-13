import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Edit({ schedule, groups }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        title: schedule.title || '',
        type: schedule.type || 'culto',
        description: schedule.description || '',
        group_id: schedule.group_id || '',
        scheduled_at: schedule.scheduled_at_input || '',
        duration: schedule.duration || '02:00:00',
        location: schedule.location || '',
        status: schedule.status || 'planejada',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/scales/${schedule.id}`);
    };

    const handleDelete = () => {
        router.delete(`/scales/${schedule.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`Editar ${schedule.title}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={`/scales/${schedule.id}`}
                            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center mb-2"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Voltar para detalhes
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900">Editar Escala</h2>
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
                                placeholder="Ex: Culto de Domingo - Manhã"
                                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.title ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        {/* Type and Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.type ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="culto">⛪ Culto</option>
                                    <option value="ensaio">🎵 Ensaio</option>
                                    <option value="evento especial">🎉 Evento Especial</option>
                                </select>
                                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                            </div>

                            <div>
                                <label htmlFor="group_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Grupo/Ministério <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="group_id"
                                    value={data.group_id}
                                    onChange={(e) => setData('group_id', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.group_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Selecione um grupo</option>
                                    {groups.map((group) => (
                                        <option key={group.id} value={group.id}>
                                            {group.name} {group.ministry && `- ${group.ministry.name}`}
                                        </option>
                                    ))}
                                </select>
                                {errors.group_id && <p className="mt-1 text-sm text-red-600">{errors.group_id}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Descrição ou observações sobre o evento..."
                                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        {/* Scheduled Date and Duration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 mb-1">
                                    Data e Hora <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    id="scheduled_at"
                                    value={data.scheduled_at}
                                    onChange={(e) => setData('scheduled_at', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.scheduled_at ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.scheduled_at && <p className="mt-1 text-sm text-red-600">{errors.scheduled_at}</p>}
                            </div>

                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                                    Duração
                                </label>
                                <input
                                    type="time"
                                    id="duration"
                                    value={data.duration ? data.duration.substring(0, 5) : ''}
                                    onChange={(e) => setData('duration', e.target.value + ':00')}
                                    step="3600"
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.duration ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                                <p className="mt-1 text-sm text-gray-500">
                                    Duração estimada do evento
                                </p>
                            </div>
                        </div>

                        {/* Location and Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                    Local
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="Ex: Templo Principal, Sala de Ensaio..."
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.location ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.status ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="planejada">Planejada</option>
                                    <option value="confirmada">Confirmada</option>
                                    <option value="em_andamento">Em Andamento</option>
                                    <option value="concluida">Concluída</option>
                                    <option value="cancelada">Cancelada</option>
                                </select>
                                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Excluir Escala
                            </button>

                            <div className="flex gap-3">
                                <Link
                                    href={`/scales/${schedule.id}`}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {processing ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        </div>
                    </form>
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
                                            Tem certeza que deseja excluir esta escala? Esta ação não pode ser desfeita e todos os dados relacionados (músicas e participantes) serão removidos.
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
        </AppLayout>
    );
}
