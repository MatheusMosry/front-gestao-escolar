import { api } from '../lib/api';
import { User, CreateUserDto } from '../types';

export const studentsService = {
    // Lista todos os usuários com role 'student'
    getAll: async () => {
        const response = await api.get('/users', {
            params: { role: 'student' }
        });

        // O backend retorna { data: [...], total: ... }
        const rawUsers = response.data.data || response.data;

        if (!Array.isArray(rawUsers)) return [];

        // MAPEAMENTO (Adaptação dos dados)
        return rawUsers.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            status: user.status || 'active',
            role: user.role,

            // AQUI: Pegamos os dados aninhados que o JOIN trouxe
            // Se tiver enrollment, pega o ID, senão exibe traço
            enrollment: user.enrollment ? 'Matriculado' : 'Pendente',

            // Navega dentro do objeto: user -> enrollment -> class -> name
            class: user.enrollment?.class?.name || 'Sem Turma'
        }));
    },

    // Cria um novo estudante
    create: async (data: CreateUserDto) => {
        const response = await api.post('/users', data);
        return response.data;
    },

    // Remove um estudante
    delete: async (id: string) => {
        await api.delete(`/users/${id}`);
    }
};