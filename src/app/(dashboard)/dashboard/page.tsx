'use client';

import React from 'react';
import { useCommunity } from '@/context/CommunityContext';
import { Building2, Receipt, MessageSquare, Users } from 'lucide-react';

export default function DashboardPage() {
  const { communities, activeCommunityId } = useCommunity();
  const activeCommunity = communities.find(c => c.id === activeCommunityId);

  const stats = [
    { name: 'Propiedades', value: '120', icon: Building2, change: '+4.75%', changeType: 'positive' },
    { name: 'Gastos del Mes', value: '$45,000', icon: Receipt, change: '+10.18%', changeType: 'negative' },
    { name: 'Mensajes Nuevos', value: '5', icon: MessageSquare, change: '-2', changeType: 'neutral' },
    { name: 'Residentes', value: '350', icon: Users, change: '+12', changeType: 'positive' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard - {activeCommunity?.name || 'Seleccione Comunidad'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Resumen general de la comunidad activa.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              <p
                className={
                  item.changeType === 'positive'
                    ? 'text-green-600'
                    : item.changeType === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-500'
                }
              >
                <span className="ml-2 flex items-baseline text-sm font-semibold">
                  {item.change}
                </span>
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Placeholder for charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Gastos Mensuales</h3>
          <div className="mt-5 h-64 w-full bg-gray-50 rounded flex items-center justify-center text-gray-400">
            Gráfico de Gastos (Recharts)
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Últimos Mensajes</h3>
          <div className="mt-5 h-64 w-full bg-gray-50 rounded flex items-center justify-center text-gray-400">
            Lista de Mensajes
          </div>
        </div>
      </div>
    </div>
  );
}
