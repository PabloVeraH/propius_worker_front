import { api } from '@/lib/api';
import { Property, CreatePropertyDTO, UpdatePropertyDTO } from '@/types/property';
import { parseDecimal } from '@/lib/utils';

type RawProperty = Omit<Property, 'area'> & {
  squareMeters?: unknown;
  area?: number;
  owner?: { id: string; name: string; email: string };
  tenant?: { id: string; name: string; email: string } | null;
};

type ApiResponse = { data: RawProperty[] } | RawProperty[];

function normalizeProperty(item: RawProperty): Property {
  return {
    ...item,
    name: item.name || item.address || 'Sin nombre',
    address: item.address || item.name || '',
    ownerName: item.owner?.name || item.ownerName || 'Sin propietario',
    tenantName:
      item.tenant?.name ||
      item.tenantName ||
      (item.tenant ? item.tenant.email : '') ||
      'Sin arrendatario',
    area: parseDecimal(item.squareMeters) || item.area || 0,
  };
}

export const propertiesService = {
  getByCommunity: async (communityId: string): Promise<Property[]> => {
    const response = await api.get<ApiResponse>(`/properties/community/${communityId}`);
    const rawData: RawProperty[] = Array.isArray(response.data)
      ? response.data
      : (response.data as { data: RawProperty[] }).data ?? [];
    return Array.isArray(rawData) ? rawData.map(normalizeProperty) : [];
  },

  getById: (id: string) =>
    api.get<Property>(`/properties/${id}`),

  create: (dto: CreatePropertyDTO) =>
    api.post<Property>('/properties', dto),

  update: (id: string, dto: UpdatePropertyDTO) =>
    api.patch<Property>(`/properties/${id}`, dto),

  remove: (id: string) =>
    api.delete(`/properties/${id}`),
};
