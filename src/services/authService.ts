import { api } from '../lib/api';
import { LoginRequestDto, AuthResponseDto } from '../types';

export const authService = {
    login: async (credentials: LoginRequestDto) => {
        // Chama o endpoint POST /auth/login definido no Swagger
        const response = await api.post<AuthResponseDto>('/auth/login', credentials);
        return response.data;
    },

    // Opcional: Buscar dados do usuário logado (se houver endpoint /users/me)
    getProfile: async () => {
        const response = await api.get('/users/me');
        return response.data;
    }
};