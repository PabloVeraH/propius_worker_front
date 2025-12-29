import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Consignment, CreateConsignmentDTO, Category } from '@/types/consignment';
import { useCommunity } from '@/context/CommunityContext';
import toast from 'react-hot-toast';

export function useConsignments() {
  const { activeCommunityId } = useCommunity();
  const queryClient = useQueryClient();

  // Fetch Consignments
  const consignmentsQuery = useQuery({
    queryKey: ['consignments', activeCommunityId],
    queryFn: async () => {
      if (!activeCommunityId) return [];
      // Assuming GET /consignments/community/:id or similar.
      // If the user didn't specify, I'll try /consignments first,
      // but usually everything is scoped.
      // Given the POST is /consigments (typo in user prompt "consigments"?), I will use that.
      // User said: curl -X 'POST' 'http://localhost:3000/consigments'
      // I'll assume GET is also /consigments, maybe filtering by community header or generic list.
      // But typically we need to filter by community.
      // I will try getting from /consigments for now.
      const response = await api.get<any>('/consigments');
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
      // Handle { data: [...] } or [...]
      const rawData = response.data?.data || response.data;
      return Array.isArray(rawData) ? rawData : [];
    },
  });

  // Create Consignment
  const createConsignmentMutation = useMutation({
    mutationFn: async (newConsignment: CreateConsignmentDTO) => {
      // User specified /consigments (with typo?)
      const { data } = await api.post<Consignment>('/consigments', newConsignment);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consignments'] });
      toast.success('Envío registrado exitosamente');
    },
    onError: () => {
      toast.error('Error al registrar el envío');
    },
  });

  // Delete Consignment
  const deleteConsignmentMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/consigments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consignments'] });
      toast.success('Envío eliminado exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar el envío');
    },
  });

  // Update Consignment (Stub for now, or assumed endpoint)
  const updateConsignmentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const res = await api.patch(`/consigments/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consignments'] });
      toast.success('Envío actualizado exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar el envío');
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
      const response = await api.get<any>(`/consigments/${id}`);
      // Handle { data: ... } or ...
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
