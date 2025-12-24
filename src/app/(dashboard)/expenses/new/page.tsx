'use client';

import React from 'react';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';

export default function NewExpensePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Registrar Gasto</h1>
        <p className="mt-1 text-sm text-gray-500">
          Registre un nuevo gasto comunitario.
        </p>
      </div>

      <ExpenseForm />
    </div>
  );
}
