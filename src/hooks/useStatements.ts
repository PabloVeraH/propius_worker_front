import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCommunity } from '@/context/CommunityContext';
import { statementsService } from '@/services/statements.service';
import toast from 'react-hot-toast';

export function useStatements() {
  const { activeCommunityId } = useCommunity();
  const queryClient = useQueryClient();

  const statementsQuery = useQuery({
    queryKey: ['statements', activeCommunityId],
    queryFn: () =>
      activeCommunityId
        ? statementsService.getByCommunity(activeCommunityId).then(r => r.data)
        : [],
    enabled: !!activeCommunityId,
  });

  const generateStatementsMutation = useMutation({
    mutationFn: (month: string) => statementsService.generate(month),
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
    isGenerating: generateStatementsMutation.isPending,
  };
}
