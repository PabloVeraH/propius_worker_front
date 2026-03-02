import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatePropertyDTO, UpdatePropertyDTO } from '@/types/property';
import { useCommunity } from '@/context/CommunityContext';
import { propertiesService } from '@/services/properties.service';
import toast from 'react-hot-toast';

export function useProperties() {
  const { activeCommunityId } = useCommunity();
  const queryClient = useQueryClient();

  const propertiesQuery = useQuery({
    queryKey: ['properties', activeCommunityId],
    queryFn: () =>
      activeCommunityId ? propertiesService.getByCommunity(activeCommunityId) : [],
    enabled: !!activeCommunityId,
  });

  const createPropertyMutation = useMutation({
    mutationFn: (dto: CreatePropertyDTO) =>
      propertiesService.create(dto).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Propiedad creada exitosamente');
    },
    onError: () => {
      toast.error('Error al crear la propiedad');
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePropertyDTO }) =>
      propertiesService.update(id, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Propiedad actualizada exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar la propiedad');
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: (id: string) => propertiesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Propiedad eliminada exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar la propiedad');
    },
  });

  return {
    properties: propertiesQuery.data || [],
    isLoading: propertiesQuery.isLoading,
    createProperty: createPropertyMutation.mutateAsync,
    updateProperty: updatePropertyMutation.mutateAsync,
    deleteProperty: deletePropertyMutation.mutateAsync,
  };
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesService.getById(id).then(r => r.data),
    enabled: !!id,
  });
}
