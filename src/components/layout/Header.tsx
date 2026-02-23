'use client';

import React, { Fragment } from 'react';
import { Menu, Transition, Listbox } from '@headlessui/react';
import { Bell, ChevronDown, User as UserIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCommunity } from '@/context/CommunityContext';
import { clsx } from 'clsx';

export function Header() {
  const { user, logout } = useAuth();
  const { communities, activeCommunityId, setActiveCommunityId } = useCommunity();

  const activeCommunity = communities.find((c) => c.id === activeCommunityId);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Community Selector */}
        <div className="w-64">
          {communities.length === 1 && activeCommunity ? (
            <div className="relative w-full rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-3 text-left shadow-sm sm:text-sm">
              <span className="block truncate font-medium text-gray-900">
                {activeCommunity.name}
              </span>
            </div>
          ) : (
            <Listbox value={activeCommunityId} onChange={setActiveCommunityId}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:text-sm">
                  <span className="block truncate">
                    {activeCommunity ? activeCommunity.name : 'Seleccionar Comunidad'}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronsUpDown
                      className="h-4 w-4 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {communities.map((community) => (
                      <Listbox.Option
                        key={community.id}
                        className={({ active }) =>
                          clsx(
                            'relative cursor-default select-none py-2 pl-10 pr-4',
                            active ? 'bg-primary-50 text-primary-900' : 'text-gray-900'
                          )
                        }
                        value={community.id}
                      >
                        {({ selected }) => (
                          <>
                            <span className={clsx('block truncate', selected ? 'font-medium' : 'font-normal')}>
                              {community.name}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                                <Check className="h-4 w-4" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-full p-1.5 text-gray-400 transition-colors hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          aria-label="Ver notificaciones"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span
            className="absolute top-0.5 right-0.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
            aria-label="Tienes notificaciones nuevas"
          />
        </button>

        {/* Profile Dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-2 rounded-full bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
            <span className="sr-only">Abrir menú de usuario</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
              <UserIcon className="h-4 w-4" />
            </div>
            <span className="hidden text-sm font-medium text-gray-700 lg:block">
              {user?.name}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-gray-400 lg:block" aria-hidden="true" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/10 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={clsx(
                      'block w-full px-4 py-2 text-left text-sm text-gray-700',
                      active && 'bg-gray-50'
                    )}
                  >
                    Tu Perfil
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={clsx(
                      'block w-full px-4 py-2 text-left text-sm text-gray-700',
                      active && 'bg-gray-50'
                    )}
                  >
                    Configuración
                  </button>
                )}
              </Menu.Item>
              <div className="my-1 border-t border-gray-100" />
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={logout}
                    className={clsx(
                      'block w-full px-4 py-2 text-left text-sm text-red-600',
                      active && 'bg-gray-50'
                    )}
                  >
                    Cerrar Sesión
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}
