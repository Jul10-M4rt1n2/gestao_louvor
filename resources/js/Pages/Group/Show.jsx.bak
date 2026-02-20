import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ group, members, availableUsers, functions }) {
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [selectedFunctions, setSelectedFunctions] = useState([]);

    const { data, setData, post, processing, reset } = useForm({
        user_id: '',
    });

    const handleAddMember = (e) => {
        e.preventDefault();
        
        post(route('groups.members.store', group.id), {
            data: {
                ...data,
                function_ids: selectedFunctions,
            },
            onSuccess: () => {
                setShowAddMemberModal(false);
                reset();
                setSelectedFunctions([]);
            },
        });
    };

    const handleRemoveMember = (userId) => {
        if (confirm('Tem certeza que deseja remover este membro do grupo?')) {
            router.delete(route('groups.members.destroy', [group.id, userId]));
        }
    };

    const toggleFunction = (functionId) => {
        setSelectedFunctions(prev => 
            prev.includes(functionId)
                ? prev.filter(id => id !== functionId)
                : [...prev, functionId]
        );
    };

    const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    return (
        <AppLayout>
            <Head title={`Grupo: ${group.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Detalhes do grupo de louvor
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={route('groups.edit', group.id)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                            >
                                Editar
                            </Link>
                            <Link
                                href={route('groups.index')}
                                className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400"
                            >
                                Voltar
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Informações do Grupo */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações</h2>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Descrição</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {group.description || 'Sem descrição'}
                                            </p>
                                        </div>

                                        {group.ministry && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Ministério</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {group.ministry.name}
                                                </p>
                                            </div>
                                        )}

                                        {group.meeting_days && group.meeting_days.length > 0 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Dias de Reunião</label>
                                                <div className="mt-1 flex flex-wrap gap-2">
                                                    {group.meeting_days.map((dayIndex) => (
                                                        <span
                                                            key={dayIndex}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                        >
                                                            {weekDays[dayIndex]}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {group.meeting_time && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Horário</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {group.meeting_time}
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                group.active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {group.active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Membros</label>
                                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                                {members.length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lista de Membros */}
                        <div className="lg:col-span-2">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold text-gray-900">Membros do Grupo</h2>
                                        <button
                                            onClick={() => setShowAddMemberModal(true)}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                        >
                                            + Adicionar Membro
                                        </button>
                                    </div>

                                    {members.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">Nenhum membro no grupo ainda.</p>
                                            <p className="text-sm text-gray-400 mt-2">
                                                Clique em "Adicionar Membro" para começar.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {members.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex-shrink-0">
                                                            {member.profile_image ? (
                                                                <img
                                                                    className="h-12 w-12 rounded-full"
                                                                    src={member.profile_image}
                                                                    alt={member.name}
                                                                />
                                                            ) : (
                                                                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                                                                    <span className="text-lg font-medium text-gray-600">
                                                                        {member.name.charAt(0)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-900">
                                                                {member.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">{member.email}</p>
                                                            {member.functions && member.functions.length > 0 && (
                                                                <div className="mt-1 flex flex-wrap gap-1">
                                                                    {member.functions.map((func) => (
                                                                        <span
                                                                            key={func.id}
                                                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                                                                        >
                                                                            {func.icon && <span className="mr-1">{func.icon}</span>}
                                                                            {func.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        Remover
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Adicionar Membro */}
            {showAddMemberModal && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={() => setShowAddMemberModal(false)}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleAddMember}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Adicionar Membro ao Grupo
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Usuário
                                            </label>
                                            <select
                                                value={data.user_id}
                                                onChange={e => setData('user_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Selecione um usuário</option>
                                                {availableUsers.map(user => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name} ({user.email})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Funções (opcional)
                                            </label>
                                            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
                                                {functions.map(func => (
                                                    <label
                                                        key={func.id}
                                                        className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFunctions.includes(func.id)}
                                                            onChange={() => toggleFunction(func.id)}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-900">
                                                            {func.icon && <span className="mr-1">{func.icon}</span>}
                                                            {func.name}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                    >
                                        {processing ? 'Adicionando...' : 'Adicionar Membro'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddMemberModal(false)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
