import { api } from '../lib/api';
import { User } from '../types';

export interface CreateStudentDto {
  name: string;
  email: string;
  phone: string;
  enrollment: string;
  class?: string;
  role?: string;
  password?: string;
}

export interface UpdateStudentDto {
  name?: string;
  email?: string;
  phone?: string;
  enrollment?: string;
  class?: string;
}

export const studentsService = {
  getAll: async () => {
    try {
      const response = await api.get('/users', { 
        params: { role: 'student' } 
      });
      
      const rawUsers = response.data.data || response.data; 

      if (!Array.isArray(rawUsers)) {
        console.warn("studentsService: Dados inválidos recebidos", rawUsers);
        return [];
      }

      return rawUsers.map((user: any) => {
        // 1. Extração da Matrícula (Número visual)
        // Prioriza a coluna 'matricula' (string) da tabela users
        let enrollmentValue = user.matricula || user.enrollment || 'Pendente';
        
        // Se por acaso 'enrollment' for o objeto de relação e não a string, pegamos o ID dele
        if (typeof enrollmentValue === 'object' && enrollmentValue !== null) {
            enrollmentValue = enrollmentValue.id || 'Pendente';
        }

        // 2. Extração da Turma (Nome visual)
        let className = 'Sem Turma';

        // Verifica se existe o relacionamento 'enrollment' (objeto) e se tem 'class' dentro
        if (user.enrollment && typeof user.enrollment === 'object' && user.enrollment.class) {
            className = user.enrollment.class.name || 'Sem Turma';
        }
        // Fallback: Tenta ver se a turma veio direto no objeto user (alguns backends fazem isso)
        else if (user.class) {
             className = typeof user.class === 'string' ? user.class : (user.class.name || 'Sem Turma');
        }

        return {
          id: user.id,
          name: user.name || 'Sem Nome',
          email: user.email || 'sem@email.com',
          phone: user.phone || '',
          status: user.status || 'active',
          role: user.role || 'student',
          
          enrollment: enrollmentValue, // Campo visual da matrícula
          class: className,            // Campo visual da turma
          
          grades: Array.isArray(user.grades) ? user.grades : [] 
        };
      });
    } catch (error) {
      console.error("studentsService: Erro ao buscar alunos", error);
      throw error;
    }
  },
  
  create: async (data: CreateStudentDto) => {
      const payload = { 
        ...data, 
        matricula: data.enrollment, // Envia como matricula para o back
        password: data.password || 'Mudar@123', 
        role: 'student' 
      };
      const response = await api.post('/users', payload);
      return response.data;
  },

  update: async (id: string, data: UpdateStudentDto) => {
      const payload = {
        ...data,
        matricula: data.enrollment
      };
      const response = await api.patch(`/users/${id}`, payload);
      return response.data;
  },

  delete: async (id: string) => {
      await api.delete(`/users/${id}`);
  }
};