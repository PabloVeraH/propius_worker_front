'use client';

import React from 'react';
import { useMessages } from '@/hooks/useMessages';
import { Message } from '@/types/message';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertTriangle, Bell, Info, MessageSquare } from 'lucide-react';

export function MessageList() {
  const { messages, isLoading } = useMessages();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay mensajes</h3>
        <p className="mt-1 text-sm text-gray-500">Comienza una conversación o envía un anuncio.</p>
      </div>
    );
  }

  const getIcon = (type: Message['type']) => {
    switch (type) {
      case 'ALERT':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'ANNOUNCEMENT':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      case 'NOTICE':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBgColor = (type: Message['type']) => {
    switch (type) {
      case 'ALERT':
        return 'bg-red-50';
      case 'ANNOUNCEMENT':
        return 'bg-yellow-50';
      case 'NOTICE':
        return 'bg-blue-50';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((message: Message) => (
        <div
          key={message.id}
          className={`p-4 rounded-lg shadow border ${getBgColor(message.type)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">{getIcon(message.type)}</div>
              <div>
                <p className="text-sm font-medium text-gray-900">{message.senderName}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: es })}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800 border border-gray-200">
              {message.type}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{message.content}</p>
        </div>
      ))}
    </div>
  );
}
