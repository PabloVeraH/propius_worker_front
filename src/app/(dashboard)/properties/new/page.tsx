'use client';

import React from 'react';
import { PropertyForm } from '@/components/properties/PropertyForm';

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nueva Propiedad</h1>
        <p className="mt-1 text-sm text-gray-500">
          Registre una nueva propiedad en la comunidad.
        </p>
      </div>

      <PropertyForm />
    </div>
  );
}
