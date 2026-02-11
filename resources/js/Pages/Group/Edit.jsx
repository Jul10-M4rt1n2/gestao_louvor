import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Edit({ group, ministries }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
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

    const handleDelete = () => {
        router.delete(`/groups/${group.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
            },
        });
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
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Excluir Grupo
                            </button>
                            
                            <div className="flex gap-3">
                                <Link
                                    href={`/groups/${group.id}`}
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
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
                        
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
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
                                            Tem certeza que deseja excluir o grupo "{group.name}"? Esta ação não pode ser desfeita.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
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
