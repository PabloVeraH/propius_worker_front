import { api } from '@/lib/api';
import { Message, CreateMessageDTO } from '@/types/message';

export const messagesService = {
  getByCommunity: async (communityId: string): Promise<Message[]> => {
    const { data } = await api.get<Message[] | { data: Message[] }>(
      `/messages/community/${communityId}`
    );
    const rawData = Array.isArray(data) ? data : (data as { data: Message[] }).data ?? [];
    return Array.isArray(rawData) ? rawData : [];
  },

  create: (dto: CreateMessageDTO) =>
    api.post<Message>('/messages', dto),
};
