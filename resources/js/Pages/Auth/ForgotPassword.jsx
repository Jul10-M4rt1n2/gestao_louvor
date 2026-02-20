import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <GuestLayout>
            <Head title="Esqueci a Senha" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">Recuperar Senha</h2>
                <p className="text-sm text-gray-600 text-center mt-1">
                    Enviaremos um link de recuperação para seu email
                </p>
            </div>

            {status && (
                <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-sm text-green-800">{status}</p>
                </div>
            )}

            <form onSubmit={submit}>
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
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                >
                    {processing ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </button>

                <div className="mt-4 text-center">
                    <Link
                        href="/login"
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                        Voltar para o login
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
