'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useExpenses } from '@/hooks/useExpenses';
import { useProperties } from '@/hooks/useProperties';
import { CreateExpenseDTO } from '@/types/expense';
import { useCommunity } from '@/context/CommunityContext';

const expenseSchema = z.object({
  description: z.string().min(1, 'La descripción es requerida'),
  amount: z.number().min(1, 'El monto debe ser mayor a 0'),
  date: z.string().min(1, 'La fecha es requerida'),
  category: z.enum(['MAINTENANCE', 'UTILITIES', 'SERVICES', 'INSURANCE', 'OTHER']),
  propertyId: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export function ExpenseForm() {
  const router = useRouter();
  const { createExpense } = useExpenses();
  const { properties } = useProperties();
  const { activeCommunityId } = useCommunity();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: 'MAINTENANCE',
      propertyId: '',
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    if (!activeCommunityId) return;

    try {
      await createExpense({
        ...data,
        communityId: activeCommunityId,
        propertyId: data.propertyId || undefined
      });
      router.push('/expenses');
    } catch (error) {
      console.error('Error saving expense', error);
    }
  };

  const categoryOptions = [
    { label: 'Mantenimiento', value: 'MAINTENANCE' },
    { label: 'Servicios Públicos', value: 'UTILITIES' },
    { label: 'Servicios', value: 'SERVICES' },
    { label: 'Seguros', value: 'INSURANCE' },
    { label: 'Otros', value: 'OTHER' },
  ];

  const propertyOptions = [
    { label: 'Comunidad (Gasto General)', value: '' },
    ...properties.map(p => ({ label: `${p.name} - ${p.ownerName}`, value: p.id }))
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Descripción"
            error={errors.description?.message}
            {...register('description')}
          />
        </div>

        <Input
          label="Monto"
          type="number"
          error={errors.amount?.message}
          {...register('amount', { valueAsNumber: true })}
        />

        <Input
          label="Fecha"
          type="date"
          error={errors.date?.message}
          {...register('date')}
        />

        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select
              label="Categoría"
              options={categoryOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.category?.message}
            />
          )}
        />

        <div className="sm:col-span-2">
          <Controller
            control={control}
            name="propertyId"
            render={({ field }) => (
              <Select
                label="Asignar a Propiedad (Opcional)"
                options={propertyOptions}
                value={field.value || ''}
                onChange={field.onChange}
                error={errors.propertyId?.message}
              />
            )}
          />
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
          Registrar Gasto
        </Button>
      </div>
    </form>
  );
}
