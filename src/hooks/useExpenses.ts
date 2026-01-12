import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Expense, CreateExpenseDTO, UpdateExpenseDTO } from '@/types/expense';
import { useCommunity } from '@/context/CommunityContext';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

// Mock data
// Mock data (updated to match new structure)
const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    communityId: '1',
    expenseId: 'master-1',
    allocatedAmount: 500,
    date: '2025-12-01',
    masterExpense: {
      id: 'master-1',
      description: 'Mantenimiento Ascensor',
      category: 'MAINTENANCE'
    }
  },
];

export function useExpenses() {
  const { activeCommunityId } = useCommunity();
  const queryClient = useQueryClient();

  const expensesQuery = useQuery({
    queryKey: ['expenses', activeCommunityId],
    queryFn: async () => {
      if (!activeCommunityId) return [];
      const { data } = await api.get<{ data: Expense[] } | Expense[]>(`/community-expenses/community/${activeCommunityId}`);
      // Handle potential wrapper
      const rawData = (data as any).data || data;
      return Array.isArray(rawData) ? rawData : [];
    },
    enabled: !!activeCommunityId,
  });

  const masterExpensesQuery = useQuery({
    queryKey: ['master-expenses'],
    queryFn: async () => {
      const { data } = await api.get<{ data: any[] } | any[]>('/expenses'); // Handle potential wrapper
      const rawData = (data as any).data || data;
      return Array.isArray(rawData) ? rawData : [];
    },
  });

  const createExpenseMutation = useMutation({
    mutationFn: async (newExpense: CreateExpenseDTO) => {
      const { data } = await api.post<Expense>('/community-expenses', newExpense);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Gasto registrado exitosamente');
    },
    onError: () => {
      toast.error('Error al registrar el gasto');
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/community-expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Gasto eliminado exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar el gasto');
    },
  });

  return {
    expenses: expensesQuery.data || [],
    masterExpenses: masterExpensesQuery.data || [],
    isLoading: expensesQuery.isLoading || masterExpensesQuery.isLoading,
    createExpense: createExpenseMutation.mutateAsync,
    deleteExpense: deleteExpenseMutation.mutateAsync,
  };
}
