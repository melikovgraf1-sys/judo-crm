import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Client, AttendanceRecord } from '../lib/types';

type Group = {
  id: string;
  age_band: string;
  schedule?: string | null;
};

type GroupData = Group & { clients: Client[] };

const DISTRICTS = ['Центр', 'Джикджилли', 'Махмутлар'];

export default function AttendancePage() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState<Record<string, boolean>>({});
  const [openDistricts, setOpenDistricts] = useState<Record<string, boolean>>({});
  const [groups, setGroups] = useState<Record<string, GroupData[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

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

  async function loadDistrict(district: string) {
    setLoading((p) => ({ ...p, [district]: true }));
    const { data: groupsData } = await supabase
      .from('groups')
      .select('id, age_band, schedule')
      .eq('district', district)
      .order('age_band', { ascending: true });
    const result: GroupData[] = [];
    for (const g of groupsData || []) {
      const { data: cg } = await supabase
        .from('client_groups')
        .select('client:clients(id, first_name, last_name)')
        .eq('group_id', g.id)
        .returns<{ client: Client }[]>();
      result.push({ ...g, clients: (cg || []).map((r) => r.client) });
    }
    setGroups((p) => ({ ...p, [district]: result }));
    setLoading((p) => ({ ...p, [district]: false }));
  }

  const toggleDistrict = (district: string) => {
    setOpenDistricts((prev) => ({ ...prev, [district]: !prev[district] }));
    if (!groups[district]) {
      loadDistrict(district);
    }
  };

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
      <div className="space-y-4">
        {DISTRICTS.map((d) => (
          <div key={d} className="border rounded-xl bg-white/70 shadow">
            <button
              className="w-full text-left px-4 py-2 font-semibold"
              onClick={() => toggleDistrict(d)}
            >
              {d}
            </button>
            {openDistricts[d] && (
              <div className="p-4 space-y-4">
                {loading[d] && (
                  <div className="text-sm text-gray-500">loading…</div>
                )}
                {!loading[d] &&
                  (groups[d] || []).map((g) => (
                    <div key={g.id} className="space-y-2">
                      <div className="font-semibold">
                        {g.age_band}
                        {g.schedule ? ` • ${g.schedule}` : ''}
                      </div>
                      <div className="pl-4 space-y-1">
                        {g.clients.map((c) => (
                          <label key={c.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!records[c.id]}
                              onChange={() => toggle(c.id)}
                            />
                            <span>
                              {c.first_name}
                              {c.last_name ? ` ${c.last_name}` : ''}
                            </span>
                          </label>
                        ))}
                        {g.clients.length === 0 && (
                          <div className="text-sm text-gray-500">Клиентов нет</div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

