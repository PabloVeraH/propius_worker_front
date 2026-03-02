import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Consignment, CreateConsignmentDTO, Category } from '@/types/consignment';
import { useCommunity } from '@/context/CommunityContext';
import toast from 'react-hot-toast';

// Single source of truth for the consignments endpoint.
// The backend uses '/consigments' (one 'n'). Change here to update everywhere.
const CONSIGNMENTS_ENDPOINT = '/consigments';

export function useConsignments() {
  const { activeCommunityId } = useCommunity();
  const queryClient = useQueryClient();

  // Fetch Consignments
  const consignmentsQuery = useQuery({
    queryKey: ['consignments', activeCommunityId],
    queryFn: async () => {
      if (!activeCommunityId) return [];
      const response = await api.get<any>(CONSIGNMENTS_ENDPOINT);
      const rawData = response.data?.data || response.data;
      return Array.isArray(rawData) ? rawData : [];
    },
    enabled: !!activeCommunityId,
  });

  // Fetch Categories for the dropdown
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<any>('/categories');
      const rawData = response.data?.data || response.data;
      return Array.isArray(rawData) ? rawData : [];
    },
  });

  // Create Consignment
  const createConsignmentMutation = useMutation({
    mutationFn: async (newConsignment: CreateConsignmentDTO) => {
      const { data } = await api.post<Consignment>(CONSIGNMENTS_ENDPOINT, newConsignment);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consignments'] });
      toast.success('Consignación registrada exitosamente');
    },
    onError: () => {
      toast.error('Error al registrar la consignación');
    },
  });

  // Delete Consignment
  const deleteConsignmentMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`${CONSIGNMENTS_ENDPOINT}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consignments'] });
      toast.success('Consignación eliminada exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar la consignación');
    },
  });

  // Update Consignment
  const updateConsignmentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const res = await api.patch(`${CONSIGNMENTS_ENDPOINT}/${id}`, data);
      return res.data;
    },
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
    queryFn: async () => {
      const response = await api.get<any>(`${CONSIGNMENTS_ENDPOINT}/${id}`);
      return response.data?.data || response.data;
    },
    enabled: !!id,
  });

  return {
    consignment: query.data,
    isLoading: query.isLoading,
    error: query.error
  };
}
