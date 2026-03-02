import { api } from '@/lib/api';
import { Expense, CreateExpenseDTO } from '@/types/expense';

export const expensesService = {
  getByCommunity: async (communityId: string): Promise<Expense[]> => {
    const { data } = await api.get<{ data: Expense[] } | Expense[]>(
      `/community-expenses/community/${communityId}`
    );
    const rawData = (data as { data: Expense[] }).data ?? data;
    return Array.isArray(rawData) ? rawData : [];
  },

  getMasterExpenses: async (): Promise<Expense[]> => {
    const { data } = await api.get<{ data: Expense[] } | Expense[]>('/expenses');
    const rawData = (data as { data: Expense[] }).data ?? data;
    return Array.isArray(rawData) ? rawData : [];
  },

  create: (dto: CreateExpenseDTO) =>
    api.post<Expense>('/community-expenses', dto),

  remove: (id: string) =>
    api.delete(`/community-expenses/${id}`),
};
