import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Loader2, Lock, Mail, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login({ email, password });
            setLoginSuccess(true);
            // Pequeno delay para o usuário ver a animação de sucesso
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            setError('Email ou senha incorretos.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">

            {/* --- BACKGROUND FLUIDO ANIMADO --- */}
            {/* z-0 garante que fique no fundo, pointer-events-none impede que bloqueie cliques */}
            <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                {/* Blob 1 - Roxo/Azul */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-400/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob" />

                {/* Blob 2 - Rosa/Roxo (Com delay inline via style) */}
                <div
                    className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-400/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"
                    style={{ animationDelay: '2s' }}
                />

                {/* Blob 3 - Rosa/Laranja */}
                <div
                    className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] bg-pink-400/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"
                    style={{ animationDelay: '4s' }}
                />
            </div>

            {/* --- CONTEÚDO PRINCIPAL (z-10 para ficar acima do background) --- */}
            <div className="relative z-10 min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">

                <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-transform duration-300 mb-6">
                        <GraduationCap className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-slate-800 tracking-tight">
                        EduGestão
                    </h2>
                    <p className="mt-3 text-base text-slate-600 max-w-xs mx-auto">
                        Bem-vindo de volta! Acesse sua conta para continuar.
                    </p>
                </div>

                {/* --- CARTÃO GLASSMORPHISM --- */}
                <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl shadow-indigo-100/50 rounded-3xl py-10 px-6 sm:px-12 relative overflow-hidden">

                        {/* Efeito de brilho no topo do cartão */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />

                        {loginSuccess ? (
                            <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in fade-in zoom-in duration-500">
                                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800">Login realizado!</h3>
                                <p className="text-slate-500">Redirecionando para o painel...</p>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>

                                {error && (
                                    <div className="bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-xl p-4 flex items-start animate-in slide-in-from-top-2">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-red-800">{error}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Campo de Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                                        Email Institucional
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 sm:text-sm shadow-sm hover:bg-white/80 focus:bg-white"
                                            placeholder="admin@escola.com"
                                        />
                                    </div>
                                </div>

                                {/* Campo de Senha */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                                        Senha
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-11 pr-12 py-3.5 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 sm:text-sm shadow-sm hover:bg-white/80 focus:bg-white"
                                            placeholder="••••••••"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 focus:outline-none transition-colors"
                                                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer accent-indigo-600"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer select-none">
                                            Lembrar de mim
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors hover:underline">
                                            Esqueceu a senha?
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Autenticando...
                                            </>
                                        ) : (
                                            <>
                                                Entrar
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Rodapé */}
                        {!loginSuccess && (
                            <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200/60" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white/30 backdrop-blur-xl text-slate-500 rounded-full text-xs uppercase tracking-wider">
                                            Suporte
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-1 gap-3">
                                    <div className="text-center text-xs text-slate-500">
                                        Entre em contato com a secretaria escolar para criar ou recuperar seu acesso.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="text-center text-slate-400 text-xs mt-8 font-medium">
                        &copy; 2025 EduGestão. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}