'use client';

import React from 'react';
import { useCommunity } from '@/context/CommunityContext';
import { Building2, Receipt, MessageSquare, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat('es-AR').format(value);

type ChangeType = 'positive' | 'negative' | 'neutral';

const stats: {
  name: string;
  value: number;
  format: 'number' | 'currency';
  icon: React.ElementType;
  change: string;
  changeType: ChangeType;
}[] = [
  { name: 'Propiedades', value: 120, format: 'number', icon: Building2, change: '+4.75%', changeType: 'positive' },
  { name: 'Gastos del Mes', value: 45000, format: 'currency', icon: Receipt, change: '+10.18%', changeType: 'negative' },
  { name: 'Mensajes Nuevos', value: 5, format: 'number', icon: MessageSquare, change: '−2', changeType: 'neutral' },
  { name: 'Residentes', value: 350, format: 'number', icon: Users, change: '+12', changeType: 'positive' },
];

const TrendIcon = ({ type }: { type: ChangeType }) => {
  if (type === 'positive') return <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />;
  if (type === 'negative') return <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />;
  return <Minus className="h-3.5 w-3.5" aria-hidden="true" />;
};

export default function DashboardPage() {
  const { communities, activeCommunityId } = useCommunity();
  const activeCommunity = communities.find(c => c.id === activeCommunityId);

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
            <dd className="mt-3 flex items-baseline gap-2">
              <span className="tabular-nums text-2xl font-semibold text-gray-900">
                {item.format === 'currency' ? formatCurrency(item.value) : formatNumber(item.value)}
              </span>
              <span
                className={clsx(
                  'inline-flex items-center gap-0.5 text-xs font-medium',
                  item.changeType === 'positive' && 'text-emerald-600',
                  item.changeType === 'negative' && 'text-red-500',
                  item.changeType === 'neutral' && 'text-gray-400',
                )}
              >
                <TrendIcon type={item.changeType} />
                {item.change}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Gastos Mensuales</h2>
          <div
            className="mt-4 flex h-64 w-full items-center justify-center rounded-md bg-gray-50 text-sm text-gray-400"
            role="img"
            aria-label="Gráfico de gastos mensuales — en construcción"
          >
            Gráfico de Gastos (Recharts)
          </div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Últimos Mensajes</h2>
          <div
            className="mt-4 flex h-64 w-full items-center justify-center rounded-md bg-gray-50 text-sm text-gray-400"
            role="img"
            aria-label="Lista de últimos mensajes — en construcción"
          >
            Lista de Mensajes
          </div>
        </div>
      </div>
    </div>
  );
}
