'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import GroupCard, { Group } from './GroupCard';
import type { Client } from '../lib/types';

type Props = {
  group: Group;
  onChanged?: () => void;
};

export default function GroupWithClients({ group, onChanged }: Props) {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!open && clients.length === 0) {
      setLoading(true);
      const { data, error } = await supabase
        .from('client_groups')
        .select('client:clients(id, first_name, last_name)')
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
      <GroupCard group={group} onChanged={onChanged} />
      <button
        className="text-sm text-blue-600 underline"
        onClick={toggle}
      >
        {open ? 'Hide clients' : 'Show clients'}
      </button>
      {open && (
        <div className="pl-4 space-y-1">
          {loading && <div className="text-sm text-gray-500">loading…</div>}
          {!loading && clients.length === 0 && (
            <div className="text-sm text-gray-500">no clients</div>
          )}
          {clients.map((c) => (
            <div key={c.id} className="text-sm">
              {c.first_name}
              {c.last_name ? ` ${c.last_name}` : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
