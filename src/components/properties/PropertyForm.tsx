'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useProperties } from '@/hooks/useProperties';
import { Property, CreatePropertyDTO } from '@/types/property';
import { useCommunity } from '@/context/CommunityContext';

const propertySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  ownerName: z.string().min(1, 'El nombre del propietario es requerido'),
  ownerEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  tenantName: z.string().optional(),
  tenantEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  area: z.number().min(1, 'El área debe ser mayor a 0'),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  initialData?: Property;
  isEditing?: boolean;
}

export function PropertyForm({ initialData, isEditing = false }: PropertyFormProps) {
  const router = useRouter();
  const { createProperty, updateProperty } = useProperties();
  const { activeCommunityId } = useCommunity();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData ? {
      name: initialData.name,
      ownerName: initialData.ownerName || initialData.owner?.name || '',
      ownerEmail: initialData.owner?.email || '',
      tenantName: initialData.tenant?.name || '',
      tenantEmail: initialData.tenant?.email || '',
      area: initialData.area || 0,
    } : {
      name: '',
      ownerName: '',
      ownerEmail: '',
      tenantName: '',
      tenantEmail: '',
      area: 0,
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    if (!activeCommunityId) return;

    try {
      const dto: CreatePropertyDTO = {
        communityId: activeCommunityId,
        name: data.name,
        squareMeters: data.area,
        ownerName: data.ownerName,
        ownerEmail: data.ownerEmail || undefined,
        tenantName: data.tenantName || undefined,
        tenantEmail: data.tenantEmail || undefined,
        ownerId: initialData?.ownerId,
      };

      if (isEditing && initialData) {
        const { communityId: _communityId, ...updateDto } = dto;
        await updateProperty({ id: initialData.id, data: updateDto });
      } else {
        await createProperty(dto);
      }
      router.push('/properties');
    } catch {
      // Error toast is handled by the mutation's onError callback
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Nombre"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Área (m²)"
          type="number"
          error={errors.area?.message}
          {...register('area', { valueAsNumber: true })}
        />

        <div className="sm:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Propietario</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Nombre"
              error={errors.ownerName?.message}
              {...register('ownerName')}
            />
            <Input
              label="Email"
              type="email"
              error={errors.ownerEmail?.message}
              {...register('ownerEmail')}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Inquilino (Opcional)</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Nombre"
              error={errors.tenantName?.message}
              {...register('tenantName')}
            />
            <Input
              label="Email"
              type="email"
              error={errors.tenantEmail?.message}
              {...register('tenantEmail')}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {isEditing ? 'Actualizar' : 'Crear Propiedad'}
        </Button>
      </div>
    </form>
  );
}
