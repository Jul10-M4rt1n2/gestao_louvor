import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
            <div>
                <Link href="/">
                    <div className="text-white text-center mb-6">
                        <h1 className="text-4xl font-bold">🎵 Gestão Louvor</h1>
                        <p className="text-sm opacity-90">Sistema de Gerenciamento de Ministérios</p>
                    </div>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white shadow-2xl overflow-hidden sm:rounded-2xl">
                {children}
            </div>
        </div>
    );
}
