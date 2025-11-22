import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar'; // Corrigido para coincidir com o arquivo criado
import { Home, Users, BookOpen, Award, Megaphone, Menu, X } from 'lucide-react';

export function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: Home },
        { path: '/students', label: 'Estudantes', icon: Users },
        { path: '/classes', label: 'Turmas', icon: BookOpen },
        { path: '/grades', label: 'Notas', icon: Award },
        { path: '/announcements', label: 'Anúncios', icon: Megaphone },
    ];

    return (
        <div className="relative min-h-screen bg-slate-50 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">

            {/* --- BACKGROUND FLUIDO ANIMADO --- */}
            <div className="fixed inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob" />
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] bg-pink-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000" />
            </div>

            {/* Backdrop for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex h-screen relative z-10">
                {/* Sidebar Wrapper */}
                <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 transition-transform duration-300 ease-in-out h-full shadow-2xl lg:shadow-none`}>
                    <AppSidebar
                        menuItems={menuItems}
                        onMobileClose={() => setSidebarOpen(false)}
                    />
                </div>

                <main className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Mobile header Glass */}
                    <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-white/20 px-4 py-3 flex-shrink-0 flex items-center justify-between shadow-sm z-20">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                        <h2 className="text-slate-800 font-bold text-lg">EduGestão</h2>
                        <div className="w-10" />
                    </div>

                    {/* Área de Conteúdo com Scroll Suave */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
                        <div className="max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}