'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useMessages } from '@/hooks/useMessages';
import { CreateMessageDTO } from '@/types/message';
import { useCommunity } from '@/context/CommunityContext';

const messageSchema = z.object({
  content: z.string().min(1, 'El mensaje no puede estar vacío'),
  type: z.enum(['ANNOUNCEMENT', 'NOTICE', 'ALERT', 'GENERAL']),
});

type MessageFormData = z.infer<typeof messageSchema>;

export function MessageInput() {
  const { createMessage } = useMessages();
  const { activeCommunityId } = useCommunity();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
      type: 'GENERAL',
    },
  });

  const onSubmit = async (data: MessageFormData) => {
    if (!activeCommunityId) return;

    try {
      await createMessage({ ...data, communityId: activeCommunityId });
      reset();
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const typeOptions = [
    { label: 'General', value: 'GENERAL' },
    { label: 'Anuncio', value: 'ANNOUNCEMENT' },
    { label: 'Aviso', value: 'NOTICE' },
    { label: 'Alerta', value: 'ALERT' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Nuevo Mensaje</h3>

      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <textarea
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
            rows={3}
            placeholder="Escribe tu mensaje aquí..."
            {...register('content')}
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
        </div>

        <div className="w-48">
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                options={typeOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.type?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Enviar Mensaje
        </Button>
      </div>
    </form>
  );
}
