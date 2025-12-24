'use client';

import React from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, MoreHorizontal, Trash } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { useExpenses } from '@/hooks/useExpenses';
import { Expense } from '@/types/expense';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';

export default function ExpensesPage() {
  const { expenses, isLoading, deleteExpense } = useExpenses();

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: 'description',
      header: 'Descripción',
    },
    {
      accessorKey: 'category',
      header: 'Categoría',
      cell: ({ row }) => {
        const category = row.getValue('category') as string;
        const map: Record<string, string> = {
          MAINTENANCE: 'Mantenimiento',
          UTILITIES: 'Servicios Públicos',
          SERVICES: 'Servicios',
          INSURANCE: 'Seguros',
          OTHER: 'Otros',
        };
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {map[category] || category}
          </span>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Fecha',
      cell: ({ row }) => {
        return new Date(row.getValue('date')).toLocaleDateString();
      },
    },
    {
      accessorKey: 'amount',
      header: 'Monto',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(amount);
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const expense = row.original;

        return (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600 focus:outline-none">
              <MoreHorizontal className="h-4 w-4" />
            </Menu.Button>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className={`${active ? 'bg-gray-100 text-red-900' : 'text-red-700'
                          } flex w-full px-4 py-2 text-sm`}
                      >
                        <Trash className="mr-3 h-4 w-4" />
                        Eliminar
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gastos Comunitarios</h1>
        <Link href="/expenses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Gasto
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={expenses} searchKey="description" searchPlaceholder="Buscar gasto..." />
      )}
    </div>
  );
}
