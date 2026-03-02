import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Property, CreatePropertyDTO, UpdatePropertyDTO } from '@/types/property';
import { useCommunity } from '@/context/CommunityContext';
import { parseDecimal } from '@/lib/utils';
import toast from 'react-hot-toast';

// Mock data updated
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    communityId: '1',
    name: 'Departamento 101',
    address: 'Apto 101',
    ownerName: 'Juan Pérez',
    tenantName: 'Pedro Almodovar',
    area: 85,
  },
  {
    id: '2',
    communityId: '1',
    name: 'Departamento 102',
    address: 'Apto 102',
    ownerName: 'María García',
    area: 90,
  },
];

export function useProperties() {
  const { activeCommunityId } = useCommunity();
  const queryClient = useQueryClient();

  const propertiesQuery = useQuery({
    queryKey: ['properties', activeCommunityId],
    queryFn: async () => {
      if (!activeCommunityId) return [];
      // The API returns { data: Property[] } structure based on the issue description
      const response = await api.get<any>(`/properties/community/${activeCommunityId}`);

      const rawData = response.data.data || response.data; // Handle wrapped or unwrapped

      if (!Array.isArray(rawData)) return [];

      return rawData.map((item: any) => ({
        ...item,
        name: item.name || item.address || 'Sin nombre',
        address: item.address || item.name || '',
        ownerName: item.owner?.name || item.ownerName || 'Sin propietario',
        tenantName: item.tenant?.name || item.tenantName || (item.tenant ? item.tenant.email : '') || 'Sin arrendatario',
        area: parseDecimal(item.squareMeters) || item.area || 0,
        // Backend does not support type/status currently
      })) as Property[];
    },
    enabled: !!activeCommunityId,
  });

  const createPropertyMutation = useMutation({
    mutationFn: async (newProperty: CreatePropertyDTO) => {
      const { data } = await api.post<Property>('/properties', newProperty);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Propiedad creada exitosamente');
    },
    onError: () => {
      toast.error('Error al crear la propiedad');
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePropertyDTO }) => {
      const { data: res } = await api.patch<Property>(`/properties/${id}`, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Propiedad actualizada exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar la propiedad');
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/properties/${id}`);
    },
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
    queryFn: async () => {
      const { data } = await api.get<Property>(`/properties/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
