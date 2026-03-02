'use client';

import React from 'react';
import { Users } from 'lucide-react';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestión de residentes y personal de la comunidad.
        </p>
      </div>

      <div className="text-center py-16 bg-white rounded-lg shadow">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Próximamente</h3>
        <p className="mt-1 text-sm text-gray-500">
          La gestión de usuarios estará disponible pronto.
        </p>
      </div>
    </div>
  );
}
