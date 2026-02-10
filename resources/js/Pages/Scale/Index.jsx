import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ schedules, groups, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [groupId, setGroupId] = useState(filters.group_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/schedules', { 
            search, 
            status, 
            group_id: groupId, 
            date_from: dateFrom, 
            date_to: dateTo 
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setGroupId('');
        setDateFrom('');
        setDateTo('');
        router.get('/schedules');
    };

    const statusBadges = {
        planejada: 'bg-yellow-100 text-yellow-800',
        confirmada: 'bg-green-100 text-green-800',
        em_andamento: 'bg-blue-100 text-blue-800',
        concluida: 'bg-gray-100 text-gray-800',
        cancelada: 'bg-red-100 text-red-800',
    };

    const statusLabels = {
        planejada: 'Planejada',
        confirmada: 'Confirmada',
        em_andamento: 'Em Andamento',
        concluida: 'Concluída',
        cancelada: 'Cancelada',
    };

    const typeLabels = {
        culto: '⛪ Culto',
        ensaio: '🎵 Ensaio',
        'evento especial': '🎉 Evento Especial',
    };

    return (
        <AppLayout>
            <Head title="Escalas" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                📅 Escalas e Agendamentos
                            </h2>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <Link
                                href="/schedules/create"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Nova Escala
                            </Link>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white shadow rounded-lg p-4 mb-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {/* Search */}
                                <div className="md:col-span-2">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                        Buscar
                                    </label>
                                    <input
                                        type="text"
                                        id="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Título ou local..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Todos</option>
                                        <option value="planejada">Planejada</option>
                                        <option value="confirmada">Confirmada</option>
                                        <option value="em_andamento">Em Andamento</option>
                                        <option value="concluida">Concluída</option>
                                        <option value="cancelada">Cancelada</option>
                                    </select>
                                </div>

                                {/* Group Filter */}
                                <div>
                                    <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
                                        Grupo
                                    </label>
                                    <select
                                        id="group"
                                        value={groupId}
                                        onChange={(e) => setGroupId(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Todos</option>
                                        {groups.map((group) => (
                                            <option key={group.id} value={group.id}>
                                                {group.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date From */}
                                <div>
                                    <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                                        Data Início
                                    </label>
                                    <input
                                        type="date"
                                        id="dateFrom"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {/* Date To */}
                                <div>
                                    <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                                        Data Fim
                                    </label>
                                    <input
                                        type="date"
                                        id="dateTo"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="md:col-span-4 flex items-end gap-2">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        Filtrar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Limpar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Schedules Grid */}
                    {schedules.data && schedules.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {schedules.data.map((schedule) => (
                                <Link
                                    key={schedule.id}
                                    href={`/schedules/${schedule.id}`}
                                    className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {schedule.title}
                                            </h3>
                                            <span className="inline-flex items-center text-sm text-gray-600">
                                                {typeLabels[schedule.type] || schedule.type}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadges[schedule.status]}`}>
                                            {statusLabels[schedule.status]}
                                        </span>
                                    </div>

                                    {schedule.group && (
                                        <div className="mb-3">
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {schedule.group.ministry?.icon} {schedule.group.name}
                                            </span>
                                        </div>
                                    )}

                                    <div className="space-y-2 text-sm text-gray-600">
                                        {schedule.scheduled_date && (
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {schedule.scheduled_date}
                                            </div>
                                        )}

                                        {schedule.location && (
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {schedule.location}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                {schedule.participants_count || 0} participantes
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                                </svg>
                                                {schedule.musics_count || 0} músicas
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white shadow rounded-lg p-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma escala encontrada</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Comece criando uma nova escala.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/schedules/create"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nova Escala
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {schedules.links && schedules.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                {schedules.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                            link.active
                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
