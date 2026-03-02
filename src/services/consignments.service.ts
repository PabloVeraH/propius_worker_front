import { api } from '@/lib/api';
import { Consignment, CreateConsignmentDTO, UpdateConsignmentDTO, Category } from '@/types/consignment';

// Single source of truth for the endpoint (backend typo intentionally preserved)
const ENDPOINT = '/consigments';

export const consignmentsService = {
  getAll: async (): Promise<Consignment[]> => {
    const response = await api.get<{ data: Consignment[] } | Consignment[]>(ENDPOINT);
    const rawData = (response.data as { data: Consignment[] }).data ?? response.data;
    return Array.isArray(rawData) ? rawData : [];
  },

  getById: async (id: string): Promise<Consignment> => {
    const response = await api.get<{ data: Consignment } | Consignment>(`${ENDPOINT}/${id}`);
    return (response.data as { data: Consignment }).data ?? response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<{ data: Category[] } | Category[]>('/categories');
    const rawData = (response.data as { data: Category[] }).data ?? response.data;
    return Array.isArray(rawData) ? rawData : [];
  },

  create: (dto: CreateConsignmentDTO) =>
    api.post<Consignment>(ENDPOINT, dto),

  update: (id: string, dto: UpdateConsignmentDTO) =>
    api.patch<Consignment>(`${ENDPOINT}/${id}`, dto),

  remove: (id: string) =>
    api.delete(`${ENDPOINT}/${id}`),
};
