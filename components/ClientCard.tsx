import React from 'react';
import type { Client } from '../lib/types';

export default function ClientCard({
  client,
  onEdit,
  onDelete,
  children,
}: {
  client: Client;
  onEdit: (c: Client) => void;
  onDelete: (id: string) => void;
  children?: React.ReactNode;
}) {
  const name = `${client.first_name}${client.last_name ? ' ' + client.last_name : ''}`;
  return (
    <div className="border rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-gray-600">
            {client.phone || '—'} • {client.district || '—'} • статус: {client.payment_status || '—'}
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => onEdit(client)}>Edit</button>
          <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => onDelete(client.id)}>Delete</button>
        </div>
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
