import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateExpenseDTO } from '@/types/expense';
import { useCommunity } from '@/context/CommunityContext';
import { expensesService } from '@/services/expenses.service';
import toast from 'react-hot-toast';

export function useExpenses() {
  const { activeCommunityId } = useCommunity();
  const queryClient = useQueryClient();

  const expensesQuery = useQuery({
    queryKey: ['expenses', activeCommunityId],
    queryFn: () =>
      activeCommunityId ? expensesService.getByCommunity(activeCommunityId) : [],
    enabled: !!activeCommunityId,
  });

  const masterExpensesQuery = useQuery({
    queryKey: ['master-expenses'],
    queryFn: () => expensesService.getMasterExpenses(),
  });

  const createExpenseMutation = useMutation({
    mutationFn: (dto: CreateExpenseDTO) =>
      expensesService.create(dto).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Gasto registrado exitosamente');
    },
    onError: () => {
      toast.error('Error al registrar el gasto');
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => expensesService.remove(id),
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
