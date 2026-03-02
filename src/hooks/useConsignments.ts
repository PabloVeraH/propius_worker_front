import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateConsignmentDTO, UpdateConsignmentDTO } from '@/types/consignment';
import { useCommunity } from '@/context/CommunityContext';
import { consignmentsService } from '@/services/consignments.service';
import toast from 'react-hot-toast';

export function useConsignments() {
  const { activeCommunityId } = useCommunity();
  const queryClient = useQueryClient();

  const consignmentsQuery = useQuery({
    queryKey: ['consignments', activeCommunityId],
    queryFn: () => (activeCommunityId ? consignmentsService.getAll() : []),
    enabled: !!activeCommunityId,
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => consignmentsService.getCategories(),
  });

  const createConsignmentMutation = useMutation({
    mutationFn: (dto: CreateConsignmentDTO) =>
      consignmentsService.create(dto).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consignments'] });
      toast.success('Consignación registrada exitosamente');
    },
    onError: () => {
      toast.error('Error al registrar la consignación');
    },
  });

  const deleteConsignmentMutation = useMutation({
    mutationFn: (id: string) => consignmentsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consignments'] });
      toast.success('Consignación eliminada exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar la consignación');
    },
  });

  const updateConsignmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConsignmentDTO }) =>
      consignmentsService.update(id, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consignments'] });
      toast.success('Consignación actualizada exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar la consignación');
    },
  });

  return {
    consignments: consignmentsQuery.data || [],
    categories: categoriesQuery.data || [],
    isLoading: consignmentsQuery.isLoading || categoriesQuery.isLoading,
    createConsignment: createConsignmentMutation.mutateAsync,
    deleteConsignment: deleteConsignmentMutation.mutateAsync,
    updateConsignment: updateConsignmentMutation.mutateAsync,
  };
}

export function useConsignment(id: string) {
  const query = useQuery({
    queryKey: ['consignment', id],
    queryFn: () => consignmentsService.getById(id),
    enabled: !!id,
  });

  return {
    consignment: query.data,
    isLoading: query.isLoading,
    error: query.error
  };
}
