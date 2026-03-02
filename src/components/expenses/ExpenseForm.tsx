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
import { CreateExpenseDTO } from '@/types/expense';
import { useCommunity } from '@/context/CommunityContext';
import { formatCategory } from '@/lib/formatters';
import toast from 'react-hot-toast';

const expenseSchema = z.object({
  expenseId: z.string().min(1, 'El gasto es requerido'),
  allocatedAmount: z.number().min(1, 'El monto debe ser mayor a 0'),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export function ExpenseForm() {
  const router = useRouter();
  const { createExpense, masterExpenses } = useExpenses();
  const { activeCommunityId } = useCommunity();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expenseId: '',
      allocatedAmount: 0,
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    if (!activeCommunityId) {
      toast.error('No hay comunidad activa seleccionada');
      return;
    }

    try {
      await createExpense({
        expenseId: data.expenseId,
        allocatedAmount: data.allocatedAmount,
        communityId: activeCommunityId,
      });
      router.push('/expenses');
    } catch {
      // Error toast is handled by the mutation's onError callback
    }
  };

  const expenseOptions = masterExpenses.map((e: any) => ({
    label: `${e.description} (${formatCategory(e.category)})`,
    value: e.id,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 gap-6">

        <Controller
          control={control}
          name="expenseId"
          render={({ field }) => (
            <Select
              label="Gasto (Master)"
              options={expenseOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.expenseId?.message}
              placeholder="Seleccionar Gasto"
            />
          )}
        />

        <Input
          label="Monto Asignado"
          type="number"
          error={errors.allocatedAmount?.message}
          {...register('allocatedAmount', { valueAsNumber: true })}
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
          Registrar Gasto
        </Button>
      </div>
    </form>
  );
}
