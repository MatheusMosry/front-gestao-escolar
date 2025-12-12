import { api } from '../lib/api';

export interface CreateClassDto {
  name: string;
  academic_year: number;
  teacherId: string;
  schedule?: string;
  room?: string;
}

export const classesService = {
  getAll: async () => {
    try {
      const response = await api.get('/classes');
      // Garante que retorna um array, lidando com possíveis formatos de paginação
      const data = response.data.data || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("classesService: Erro ao buscar turmas", error);
      throw error;
    }
  },

  create: async (data: CreateClassDto) => {
    const response = await api.post('/classes', data);
    return response.data;
  },

  update: (id: string, data: CreateClassDto) => Promise<any>,
  

  delete: async (id: string) => {
    await api.delete(`/classes/${id}`);
  }

};