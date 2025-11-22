import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { LoginRequestDto } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequestDto) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Ao carregar a página, verifica se já tem token
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = async (data: LoginRequestDto) => {
        try {
            const response = await authService.login(data);

            // Salva o token no navegador
            localStorage.setItem('access_token', response.access_token);
            setIsAuthenticated(true);

        } catch (error) {
            console.error("Erro no login", error);
            throw error; // Repassa o erro para a tela de login tratar
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para facilitar o uso
export const useAuth = () => useContext(AuthContext);