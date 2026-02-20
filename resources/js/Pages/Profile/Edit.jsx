import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
    });

    const { data: passwordData, setData: setPasswordData, put: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put('/profile');
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        updatePassword('/profile/password', {
            onSuccess: () => resetPassword(),
        });
    };

    return (
        <AppLayout>
            <Head title="Perfil" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Meu Perfil</h2>
                        <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e configurações de conta</p>
                    </div>

                    <div className="space-y-6">
                        {/* Profile Information */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Informações do Perfil</h3>
                                <p className="text-sm text-gray-600 mt-1">Atualize suas informações pessoais</p>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome Completo <span className="text-red-500">*</span>
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

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                            errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Telefone
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="(00) 00000-0000"
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                            errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>

                                {/* Organization (Read-only) */}
                                {user.organization && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Organização
                                        </label>
                                        <input
                                            type="text"
                                            value={user.organization.name}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                        />
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Salvando...' : 'Salvar Alterações'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Change Password */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Alterar Senha</h3>
                                <p className="text-sm text-gray-600 mt-1">Mantenha sua conta segura com uma senha forte</p>
                            </div>
                            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
                                {/* Current Password */}
                                <div>
                                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Senha Atual <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="current_password"
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                            passwordErrors.current_password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {passwordErrors.current_password && (
                                        <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password}</p>
                                    )}
                                </div>

                                {/* New Password */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nova Senha <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={passwordData.password}
                                        onChange={(e) => setPasswordData('password', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                                            passwordErrors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {passwordErrors.password && (
                                        <p className="mt-1 text-sm text-red-600">{passwordErrors.password}</p>
                                    )}
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirmar Nova Senha <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password_confirmation"
                                        value={passwordData.password_confirmation}
                                        onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={passwordProcessing}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {passwordProcessing ? 'Atualizando...' : 'Atualizar Senha'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
