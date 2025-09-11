'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import GroupCard, { Group } from './GroupCard';
import type { Client } from '../lib/types';
import ClientModal from './ClientModal';

type Props = {
  group: Group;
  onChanged?: () => void;
  districts: string[];
};

export default function GroupWithClients({ group, onChanged, districts }: Props) {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [openClient, setOpenClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  async function toggle() {
    if (!open && clients.length === 0) {
      setLoading(true);
      const { data, error } = await supabase
        .from('client_groups')
        .select('client:clients(*)')
        .eq('group_id', group.id)
        .returns<{ client: Client }[]>();
      if (!error && data) {
        setClients(data.map((r) => r.client));
      }
      setLoading(false);
    }
    setOpen(!open);
  }

  return (
    <div className="space-y-2">
      <GroupCard
        group={group}
        onChanged={onChanged}
        districts={districts}
        onAddClient={() => setOpenClient(true)}
      />
      <button
        className="text-sm text-blue-600 underline"
        onClick={toggle}
      >
        {open ? 'Скрыть клиентов' : 'Показать клиентов'}
      </button>
      {open && (
        <div className="pl-4 space-y-1">
          {loading && <div className="text-sm text-gray-500">Загрузка…</div>}
          {!loading && clients.length === 0 && (
            <div className="text-sm text-gray-500">Клиентов нет</div>
          )}
          {clients.map((c) => (
            <button
              key={c.id}
              className="text-sm text-blue-600 underline"
              onClick={() => { setEditingClient(c); setOpenClient(true); }}
            >
              {c.first_name}
              {c.last_name ? ` ${c.last_name}` : ''}
            </button>
          ))}
        </div>
      )}
      {openClient && (
        <ClientModal
          initial={editingClient ?? { district: group.district }}
          onClose={() => { setOpenClient(false); setEditingClient(null); }}
          onSaved={(c) => {
            setOpenClient(false);
            setEditingClient(null);
            if (c) {
              setClients((prev) => {
                const idx = prev.findIndex((p) => p.id === c.id);
                if (idx >= 0) {
                  const copy = [...prev];
                  copy[idx] = c;
                  return copy;
                }
                return [...prev, c];
              });
            }
          }}
          groupId={editingClient ? undefined : group.id}
          districts={districts}
        />
      )}
    </div>
  );
}
