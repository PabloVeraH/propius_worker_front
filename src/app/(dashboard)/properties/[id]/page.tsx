'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PropertyForm } from '@/components/properties/PropertyForm';
import { useProperty } from '@/hooks/useProperties';

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: property, isLoading } = useProperty(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!property) {
    return <div>Propiedad no encontrada</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar Propiedad</h1>
        <p className="mt-1 text-sm text-gray-500">
          Modifique los datos de la propiedad.
        </p>
      </div>

      <PropertyForm initialData={property} isEditing />
    </div>
  );
}
