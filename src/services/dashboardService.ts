import { api } from '../lib/api';
import { AdminDashboardStats } from '../types';

export const dashboardService = {
    getAdminStats: async () => {
        const response = await api.get<AdminDashboardStats>('/dashboard/admin');
        return response.data;
    }
};