import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Register({ organizations }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        organization_id: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <GuestLayout>
            <Head title="Cadastro" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">Cadastre-se</h2>
                <p className="text-sm text-gray-600 text-center mt-1">
                    Crie sua conta gratuitamente
                </p>
            </div>

            <form onSubmit={submit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome completo
                    </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        autoComplete="name"
                        autoFocus
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone (opcional)
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        autoComplete="tel"
                        onChange={(e) => setData('phone', e.target.value)}
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="organization_id" className="block text-sm font-medium text-gray-700 mb-1">
                        Organização
                    </label>
                    <select
                        id="organization_id"
                        name="organization_id"
                        value={data.organization_id}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.organization_id ? 'border-red-500' : 'border-gray-300'
                        }`}
                        onChange={(e) => setData('organization_id', e.target.value)}
                    >
                        <option value="">Selecione uma organização</option>
                        {organizations.map((org) => (
                            <option key={org.id} value={org.id}>
                                {org.name}
                            </option>
                        ))}
                    </select>
                    {errors.organization_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.organization_id}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Senha
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                </div>

                <div className="mb-6">
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar senha
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                        }`}
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                    {errors.password_confirmation && (
                        <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                >
                    {processing ? 'Cadastrando...' : 'Cadastrar'}
                </button>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Já tem uma conta?{' '}
                        <Link
                            href="/login"
                            className="text-indigo-600 hover:text-indigo-700 font-semibold"
                        >
                            Entre aqui
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
