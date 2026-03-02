'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Receipt,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Users,
  Package
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCommunity } from '@/context/CommunityContext';
import { clsx } from 'clsx';

const baseNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, adminOnly: false },
  { name: 'Propiedades', href: '/properties', icon: Building2, adminOnly: false },
  { name: 'Gastos', href: '/expenses', icon: Receipt, adminOnly: false },
  { name: 'Estados de Cuenta', href: '/statements', icon: FileText, adminOnly: false },
  { name: 'Mensajes', href: '/messages', icon: MessageSquare, adminOnly: false },
  { name: 'Envíos', href: '/consignments', icon: Package, adminOnly: false },
  { name: 'Usuarios', href: '/users', icon: Users, adminOnly: true },
  { name: 'Configuración', href: '/settings', icon: Settings, adminOnly: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { activeCommunityId } = useCommunity();

  const isAdminOfActiveCommunity = user?.adminCommunities?.some(
    (c) => c.id === activeCommunityId
  ) ?? false;

  const navigation = baseNavigation.filter(
    (item) => !item.adminOnly || isAdminOfActiveCommunity
  );

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-gray-800 px-4">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-primary-500">
          <Building2 className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold tracking-wide text-white">Comunidad App</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-2 py-3" aria-label="Navegación principal">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'group flex items-center rounded-md border-l-2 px-2 py-2 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900',
                isActive
                  ? 'border-primary-400 bg-gray-800 text-white'
                  : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon
                className={clsx(
                  'mr-3 h-4 w-4 flex-shrink-0 transition-colors',
                  isActive ? 'text-primary-400' : 'text-gray-500 group-hover:text-gray-300'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-800 p-2">
        <button
          type="button"
          onClick={logout}
          className={clsx(
            'group flex w-full items-center rounded-md border-l-2 border-transparent px-2 py-2 text-sm font-medium',
            'text-gray-400 transition-colors hover:bg-gray-800 hover:text-white',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900'
          )}
        >
          <LogOut
            className="mr-3 h-4 w-4 flex-shrink-0 text-gray-500 transition-colors group-hover:text-gray-300"
            aria-hidden="true"
          />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
