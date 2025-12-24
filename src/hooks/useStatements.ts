import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Statement } from '@/types/statement';
import { useCommunity } from '@/context/CommunityContext';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

// Mock data
const MOCK_STATEMENTS: Statement[] = [
  {
    id: '1',
    propertyId: '1',
    month: '2025-12',
    totalAmount: 150000,
    status: 'PENDING',
    generatedAt: '2025-12-01T10:00:00Z',
  },
  {
    id: '2',
    propertyId: '2',
    month: '2025-12',
    totalAmount: 145000,
    status: 'PAID',
    generatedAt: '2025-12-01T10:00:00Z',
  },
];

export function useStatements() {
  const { activeCommunityId } = useCommunity();
  const queryClient = useQueryClient();

  const statementsQuery = useQuery({
    queryKey: ['statements', activeCommunityId],
    queryFn: async () => {
      if (!activeCommunityId) return [];
      const { data } = await api.get<Statement[]>(`/property-statements`);
      return data;
    },
    enabled: !!activeCommunityId,
  });

  const generateStatementsMutation = useMutation({
    mutationFn: async (month: string) => {
      await api.post('/property-statements/generate', { month });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statements'] });
      toast.success('Estados de cuenta generados exitosamente');
    },
    onError: () => {
      toast.error('Error al generar estados de cuenta');
    },
  });

  return {
    statements: statementsQuery.data || [],
    isLoading: statementsQuery.isLoading,
    generateStatements: generateStatementsMutation.mutateAsync,
  };
}
