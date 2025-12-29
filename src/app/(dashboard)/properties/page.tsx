'use client';

import React from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { useProperties } from '@/hooks/useProperties';
import { Property } from '@/types/property';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useCommunity } from '@/context/CommunityContext';

export default function PropertiesPage() {
  const { properties, isLoading, deleteProperty } = useProperties();
  const { user } = useAuth();
  const { activeCommunityId } = useCommunity();

  const isAdminOfCurrentCommunity = user?.adminCommunities?.some(
    (c: any) => c.id === activeCommunityId
  );

  const columns: ColumnDef<Property>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre / Dirección',
    },
    {
      accessorKey: 'ownerName',
      header: 'Propietario',
    },
    {
      accessorKey: 'tenantName',
      header: 'Arrendatario',
      cell: ({ row }) => row.original.tenantName || 'Sin arrendatario',
    },
    {
      accessorKey: 'area',
      header: 'Área (m²)',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const property = row.original;

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
                      <Link
                        href={`/properties/${property.id}`}
                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } flex px-4 py-2 text-sm`}
                      >
                        <Pencil className="mr-3 h-4 w-4" />
                        Editar
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => deleteProperty(property.id)}
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
        <h1 className="text-2xl font-bold text-gray-900">Propiedades</h1>
        {isAdminOfCurrentCommunity && (
          <Link href="/properties/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Propiedad
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={properties} searchKey="name" searchPlaceholder="Buscar por nombre..." />
      )}
    </div>
  );
}
