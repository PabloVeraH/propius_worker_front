'use client';

import React from 'react';
import { useCommunity } from '@/context/CommunityContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { formatCurrency, formatNumber } from '@/lib/config';
import { Building2, Receipt, MessageSquare, Users } from 'lucide-react';

export default function DashboardPage() {
  const { communities, activeCommunityId } = useCommunity();
  const activeCommunity = communities.find(c => c.id === activeCommunityId);
  const { totalProperties, totalExpensesMonth, unreadMessages, uniqueResidents, isLoading } =
    useDashboardStats();

  const stats = [
    {
      name: 'Propiedades',
      value: totalProperties,
      format: 'number' as const,
      icon: Building2,
    },
    {
      name: 'Gastos del Mes',
      value: totalExpensesMonth,
      format: 'currency' as const,
      icon: Receipt,
    },
    {
      name: 'Mensajes',
      value: unreadMessages,
      format: 'number' as const,
      icon: MessageSquare,
    },
    {
      name: 'Residentes',
      value: uniqueResidents,
      format: 'number' as const,
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {activeCommunity?.name ?? 'Seleccione una Comunidad'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Resumen general de la comunidad activa.
        </p>
      </div>

      {/* Stats */}
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-lg border border-gray-100 bg-white px-5 py-5 shadow-sm"
          >
            <dt className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-primary-50">
                <item.icon className="h-5 w-5 text-primary-600" aria-hidden="true" />
              </div>
              <span className="truncate text-sm font-medium text-gray-500">{item.name}</span>
            </dt>
            <dd className="mt-3">
              {isLoading ? (
                <div className="h-7 w-20 animate-pulse rounded bg-gray-200" />
              ) : (
                <span className="tabular-nums text-2xl font-semibold text-gray-900">
                  {item.format === 'currency'
                    ? formatCurrency(item.value)
                    : formatNumber(item.value)}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {/* Charts — pending real endpoints */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Gastos Mensuales</h2>
          <div
            className="mt-4 flex h-64 w-full items-center justify-center rounded-md bg-gray-50 text-sm text-gray-400"
            role="img"
            aria-label="Gráfico de gastos mensuales — en construcción"
          >
            Gráfico de Gastos (en construcción)
          </div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Últimos Mensajes</h2>
          <div
            className="mt-4 flex h-64 w-full items-center justify-center rounded-md bg-gray-50 text-sm text-gray-400"
            role="img"
            aria-label="Lista de últimos mensajes — en construcción"
          >
            Lista de Mensajes (en construcción)
          </div>
        </div>
      </div>
    </div>
  );
}
