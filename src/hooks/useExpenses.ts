import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Expense, CreateExpenseDTO, UpdateExpenseDTO } from '@/types/expense';
import { useCommunity } from '@/context/CommunityContext';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

// Mock data
const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    communityId: '1',
    description: 'Mantenimiento Ascensor',
    amount: 500,
    date: '2025-12-01',
    category: 'MAINTENANCE',
  },
  {
    id: '2',
    communityId: '1',
    description: 'Servicio de Agua',
    amount: 1200,
    date: '2025-12-05',
    category: 'UTILITIES',
  },
];

export function useExpenses() {
  const { activeCommunityId } = useCommunity();
  const queryClient = useQueryClient();

  const expensesQuery = useQuery({
    queryKey: ['expenses', activeCommunityId],
    queryFn: async () => {
      if (!activeCommunityId) return [];
      const { data } = await api.get<Expense[]>(`/community-expenses`);
      return data;
    },
    enabled: !!activeCommunityId,
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
    isLoading: expensesQuery.isLoading,
    createExpense: createExpenseMutation.mutateAsync,
    deleteExpense: deleteExpenseMutation.mutateAsync,
  };
}
