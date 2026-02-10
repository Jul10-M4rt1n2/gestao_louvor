import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Edit({ group, ministries }) {
    const { data, setData, put, processing, errors } = useForm({
        name: group.name || '',
        description: group.description || '',
        ministry_id: group.ministry?.id || '',
        schedule_frequency: group.schedule_frequency || '',
        meeting_days: group.meeting_days || [],
        active: group.active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/groups/${group.id}`);
    };

    const weekDays = [
        { value: 'sunday', label: 'Domingo' },
        { value: 'monday', label: 'Segunda' },
        { value: 'tuesday', label: 'Terça' },
        { value: 'wednesday', label: 'Quarta' },
        { value: 'thursday', label: 'Quinta' },
        { value: 'friday', label: 'Sexta' },
        { value: 'saturday', label: 'Sábado' },
    ];

    const toggleDay = (day) => {
        const days = [...data.meeting_days];
        const index = days.indexOf(day);
        
        if (index > -1) {
            days.splice(index, 1);
        } else {
            days.push(day);
        }
        
        setData('meeting_days', days);
    };

    return (
        <AppLayout>
            <Head title={`Editar ${group.name}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={`/groups/${group.id}`}
                            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center mb-2"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Voltar para detalhes
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900">Editar Grupo</h2>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nome do Grupo <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* Ministry */}
                        <div>
                            <label htmlFor="ministry_id" className="block text-sm font-medium text-gray-700 mb-1">
                                Ministério <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="ministry_id"
                                value={data.ministry_id}
                                onChange={(e) => setData('ministry_id', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.ministry_id ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Selecione um ministério</option>
                                {ministries.map((ministry) => (
                                    <option key={ministry.id} value={ministry.id}>
                                        {ministry.name}
                                    </option>
                                ))}
                            </select>
                            {errors.ministry_id && <p className="mt-1 text-sm text-red-600">{errors.ministry_id}</p>}
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
                                placeholder="Descreva o objetivo e atividades do grupo..."
                                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        {/* Schedule Frequency */}
                        <div>
                            <label htmlFor="schedule_frequency" className="block text-sm font-medium text-gray-700 mb-1">
                                Frequência de Ensaios
                            </label>
                            <input
                                type="text"
                                id="schedule_frequency"
                                value={data.schedule_frequency}
                                onChange={(e) => setData('schedule_frequency', e.target.value)}
                                placeholder="Ex: Todas as quartas às 19h"
                                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.schedule_frequency ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.schedule_frequency && <p className="mt-1 text-sm text-red-600">{errors.schedule_frequency}</p>}
                        </div>

                        {/* Meeting Days */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dias de Reunião
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {weekDays.map((day) => (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => toggleDay(day.value)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                            data.meeting_days.includes(day.value)
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                            {errors.meeting_days && <p className="mt-1 text-sm text-red-600">{errors.meeting_days}</p>}
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="active"
                                checked={data.active}
                                onChange={(e) => setData('active', e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                                Grupo ativo
                            </label>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                            <Link
                                href={`/groups/${group.id}`}
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
