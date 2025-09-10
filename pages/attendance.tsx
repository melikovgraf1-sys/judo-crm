import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Client, AttendanceRecord } from '../lib/types';

export default function AttendancePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [records, setRecords] = useState<Record<string, boolean>>({});
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, first_name, last_name')
        .order('first_name', { ascending: true });
      if (!error && data) setClients(data as Client[]);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('client_id, present')
        .eq('date', date);
      if (!error && data) {
        const map: Record<string, boolean> = {};
        (data as AttendanceRecord[]).forEach((r) => {
          map[r.client_id] = r.present;
        });
        setRecords(map);
      } else {
        setRecords({});
      }
    })();
  }, [date]);

  async function toggle(clientId: string) {
    const present = !records[clientId];
    setRecords((prev) => ({ ...prev, [clientId]: present }));
    const { error } = await supabase
      .from('attendance')
      .upsert({ client_id: clientId, date, present }, { onConflict: 'client_id,date' });
    if (error) alert(error.message);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Журнал посещений</h1>
      <div className="mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>
      <div className="space-y-2">
        {clients.map((c) => (
          <label key={c.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!records[c.id]}
              onChange={() => toggle(c.id)}
            />
            <span>
              {c.first_name} {c.last_name}
            </span>
          </label>
        ))}
        {clients.length === 0 && (
          <div className="text-gray-500">Клиентов нет</div>
        )}
      </div>
    </div>
  );
}
