import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Message, CreateMessageDTO } from '@/types/message';
import { useCommunity } from '@/context/CommunityContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
// import io from 'socket.io-client';

export function useMessages() {
  const { activeCommunityId } = useCommunity();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Socket.io integration would go here
  /*
  useEffect(() => {
    if (!activeCommunityId) return;
    const socket = io(process.env.NEXT_PUBLIC_API_URL || '');
    socket.emit('join', activeCommunityId);
    socket.on('newMessage', (message: Message) => {
      queryClient.setQueryData(['messages', activeCommunityId], (old: Message[] = []) => [message, ...old]);
    });
    return () => {
      socket.disconnect();
    };
  }, [activeCommunityId, queryClient]);
  */

  const messagesQuery = useQuery({
    queryKey: ['messages', activeCommunityId],
    queryFn: async () => {
      if (!activeCommunityId) return [];
      const { data } = await api.get<Message[]>(`/messages/community/${activeCommunityId}`);
      return data;
    },
    enabled: !!activeCommunityId,
  });

  const createMessageMutation = useMutation({
    mutationFn: async (newMessage: CreateMessageDTO) => {
      const { data } = await api.post<Message>('/messages', newMessage);
      return data;
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(['messages', activeCommunityId], (old: Message[] = []) => [newMessage, ...old]);
      toast.success('Mensaje enviado');
    },
    onError: () => {
      toast.error('Error al enviar mensaje');
    },
  });

  const rawData = messagesQuery.data;
  const messages = Array.isArray(rawData)
    ? rawData
    : Array.isArray((rawData as any)?.data)
    ? (rawData as any).data
    : [];

  return {
    messages,
    isLoading: messagesQuery.isLoading,
    isError: messagesQuery.isError,
    createMessage: createMessageMutation.mutateAsync,
  };
}
