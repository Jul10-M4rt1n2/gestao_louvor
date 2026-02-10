import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Create({ groups }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        type: 'culto',
        description: '',
        group_id: '',
        scheduled_date: '',
        duration: '02:00:00',
        location: '',
        status: 'planejada',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/scales');
    };

    return (
        <AppLayout>
            <Head title="Nova Escala" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <h2 className="text-2xl font-bold text-gray-900">Nova Escala</h2>
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
                                <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Data e Hora <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    id="scheduled_date"
                                    value={data.scheduled_date}
                                    onChange={(e) => setData('scheduled_date', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.scheduled_date ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.scheduled_date && <p className="mt-1 text-sm text-red-600">{errors.scheduled_date}</p>}
                            </div>

                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                                    Duração
                                </label>
                                <input
                                    type="time"
                                    id="duration"
                                    value={data.duration}
                                    onChange={(e) => setData('duration', e.target.value)}
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
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'Salvando...' : 'Criar Escala'}
                            </button>
                            <Link
                                href="/scales"
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
