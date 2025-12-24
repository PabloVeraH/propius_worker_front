'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { FileText, Download, Mail } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { useStatements } from '@/hooks/useStatements';
import { Statement } from '@/types/statement';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { useProperties } from '@/hooks/useProperties';

export default function StatementsPage() {
  const { statements, isLoading, generateStatements } = useStatements();
  const { properties } = useProperties();

  const handleGenerate = async () => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    await generateStatements(currentMonth);
  };

  const columns: ColumnDef<Statement>[] = [
    {
      accessorKey: 'propertyId',
      header: 'Propiedad',
      cell: ({ row }) => {
        const propertyId = row.getValue('propertyId') as string;
        const property = properties.find(p => p.id === propertyId);
        return property ? `${property.name} - ${property.ownerName}` : propertyId;
      },
    },
    {
      accessorKey: 'month',
      header: 'Mes',
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('totalAmount'));
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(amount);
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'PAID'
              ? 'bg-green-100 text-green-800'
              : status === 'PENDING'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
              }`}
          >
            {status === 'PAID' ? 'Pagado' : status === 'PENDING' ? 'Pendiente' : 'Vencido'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <button className="text-gray-400 hover:text-gray-600">
              <Download className="h-4 w-4" />
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <Mail className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Estados de Cuenta</h1>
        <Button onClick={handleGenerate}>
          <FileText className="mr-2 h-4 w-4" />
          Generar Mes Actual
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={statements} searchKey="month" searchPlaceholder="Buscar por mes..." />
      )}
    </div>
  );
}
