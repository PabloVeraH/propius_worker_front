'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useCommunity } from '@/context/CommunityContext';
import { useConsignments, useConsignment } from '@/hooks/useConsignments';
import { useProperties } from '@/hooks/useProperties';
import toast from 'react-hot-toast';

const consignmentSchema = z.object({
  propertyId: z.string().min(1, 'La propiedad es requerida'),
  categoryId: z.string().min(1, 'La categoría es requerida'),
});

type ConsignmentFormData = z.infer<typeof consignmentSchema>;

export default function EditConsignmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const { activeCommunityId, setActiveCommunityId } = useCommunity(); // 2. Get activeCommunityId and setActiveCommunityId
  const { categories, updateConsignment } = useConsignments();
  const { properties } = useProperties();
  const { consignment, isLoading } = useConsignment(id || '');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConsignmentFormData>({
    resolver: zodResolver(consignmentSchema),
    defaultValues: {
      propertyId: '',
      categoryId: '',
    },
  });

  useEffect(() => {
    if (consignment) {
      // Restore active community if missing
      const communityId = consignment.property?.communityId;
      if (!activeCommunityId && communityId) {
        console.log('Restoring active community from consignment:', communityId);
        setActiveCommunityId(communityId);
      }

      // Handle potential nested objects or direct IDs
      const propertyId = consignment.propertyId || consignment.property?.id || '';
      const categoryId = consignment.categoryId || consignment.category?.id || '';

      reset({
        propertyId,
        categoryId,
      });
    }
  }, [consignment, activeCommunityId, setActiveCommunityId, reset]); // 3. Add activeCommunityId and setActiveCommunityId to dependencies

  const onSubmit = async (data: ConsignmentFormData) => {
    if (!id) {
      toast.error('Error: ID no encontrado');
      return;
    }
    try {
      await updateConsignment({ id, data });
      router.push('/consignments');
    } catch (error) {
      console.error('Error updating consignment', error);
    }
  };

  const propertyOptions = properties.map(p => ({
    label: `${p.name} - ${p.ownerName}`,
    value: p.id,
  }));

  const categoryOptions = categories.map(c => ({
    label: c.name,
    value: c.id,
  }));

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Envío</h1>
        <p className="mt-1 text-sm text-gray-500">
          Modifica los datos del envío.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6">

          <Controller
            control={control}
            name="propertyId"
            render={({ field }) => (
              <Select
                label="Propiedad"
                options={propertyOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.propertyId?.message}
                placeholder="Seleccionar propiedad"
              />
            )}
          />

          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select
                label="Categoría"
                options={categoryOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.categoryId?.message}
                placeholder="Seleccionar categoría"
              />
            )}
          />

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
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
