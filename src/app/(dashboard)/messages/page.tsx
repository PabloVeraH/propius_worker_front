'use client';

import React from 'react';
import { MessageList } from '@/components/messages/MessageList';
import { MessageInput } from '@/components/messages/MessageInput';

export default function MessagesPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mensajería Comunitaria</h1>
        <p className="mt-1 text-sm text-gray-500">
          Comunícate con los residentes y el personal.
        </p>
      </div>

      <MessageInput />
      <MessageList />
    </div>
  );
}
