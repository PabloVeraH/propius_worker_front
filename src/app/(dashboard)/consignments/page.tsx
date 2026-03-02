'use client';

import React from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash } from 'lucide-react';
import { useConsignments } from '@/hooks/useConsignments';
import { Consignment } from '@/types/consignment';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useConfirm } from '@/hooks/useConfirm';

export default function ConsignmentsPage() {
  const { consignments, isLoading, deleteConsignment } = useConsignments();
  const { confirm, dialogProps } = useConfirm();

  const handleDelete = async (consignment: Consignment) => {
    const ok = await confirm({
      title: 'Eliminar consignación',
      message: '¿Estás seguro de que deseas eliminar esta consignación? Esta acción no se puede deshacer.',
    });
    if (ok) {
      await deleteConsignment(consignment.id);
    }
  };

  const columns: ColumnDef<Consignment>[] = [
    {
      accessorKey: 'property.name',
      id: 'propertyName',
      header: 'Propiedad',
      cell: ({ row }) => row.original.property?.name || 'Sin propiedad',
    },
    {
      accessorKey: 'category.name',
      header: 'Categoría',
      cell: ({ row }) => row.original.category?.name || 'Sin categoría',
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }) => {
        const dateString = row.original.createdAt;
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const consignment = row.original;

        return (
          <div className="flex items-center gap-2">
            <Link href={`/consignments/${consignment.id}`}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-900" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleDelete(consignment)}
            >
              <Trash className="h-4 w-4 text-red-500 hover:text-red-700" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Consignaciones</h1>
        <Link href="/consignments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Consignación
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={consignments}
          searchKey="propertyName"
          searchPlaceholder="Buscar por propiedad..."
        />
      )}

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
