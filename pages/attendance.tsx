'use client';
import { useEffect, useState, Fragment } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Client, AttendanceRecord } from '../lib/types';
import {
  DISTRICT_OPTIONS,
  DISTRICT_TRAINING_DAYS,
  District,
} from '../lib/districts';

type Group = {
  id: string;
  age_band: string;
};

type GroupData = Group & { clients: Client[] };

function getTrainingDates(district: District, month: string): string[] {
  const [yearStr, monthStr] = month.split('-');
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1; // 0-based
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const weekdays = DISTRICT_TRAINING_DAYS[district] || [];
  const dates: string[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, monthIndex, day);
    if (weekdays.includes(d.getDay())) {
      dates.push(d.toISOString().slice(0, 10));
    }
  }
  return dates;
}

export default function AttendancePage() {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [records, setRecords] = useState<Record<string, boolean>>({});
  const [openDistricts, setOpenDistricts] = useState<Record<string, boolean>>({});
  const [groups, setGroups] = useState<Record<string, GroupData[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  useEffect(() => {
    setRecords({});
    setGroups({});
    Object.keys(openDistricts).forEach((d) => {
      if (openDistricts[d]) loadDistrict(d);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  async function toggle(clientId: string, day: string) {
    const key = `${clientId}-${day}`;
    const present = !records[key];
    setRecords((prev) => ({ ...prev, [key]: present }));
    const { error } = await supabase
      .from('attendance')
      .upsert({ client_id: clientId, date: day, present }, { onConflict: 'client_id,date' });
    if (error) alert(error.message);
  }

  async function loadDistrict(district: string) {
    setLoading((p) => ({ ...p, [district]: true }));
    const { data: groupData, error } = await supabase
      .from('groups')
      .select('id, age_band')
      .eq('district', district)
      .order('age_band', { ascending: true })
      .returns<Group[]>();

    if (!error && groupData) {
      const ids = groupData.map((g) => g.id);
      const { data: clientData } = await supabase
        .from('client_groups')
        .select('group_id, client:clients(id, first_name, last_name)')
        .in('group_id', ids.length ? ids : ['-'])
        .returns<{ group_id: string; client: Client }[]>();

      const clientMap: Record<string, Client[]> = {};
      (clientData || []).forEach((cg) => {
        if (!clientMap[cg.group_id]) clientMap[cg.group_id] = [];
        clientMap[cg.group_id].push(cg.client);
      });

      const result: GroupData[] = groupData.map((g) => ({
        ...g,
        clients: clientMap[g.id] || [],
      }));
      setGroups((p) => ({ ...p, [district]: result }));

      const clientIds = result.flatMap((g) => g.clients.map((c) => c.id));
      const dates = getTrainingDates(district as District, month);
      if (clientIds.length && dates.length) {
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('client_id, date, present')
          .in('client_id', clientIds)
          .in('date', dates)
          .returns<AttendanceRecord[]>();
        const map: Record<string, boolean> = {};
        (attendanceData || []).forEach((r) => {
          map[`${r.client_id}-${r.date}`] = r.present;
        });
        setRecords((prev) => ({ ...prev, ...map }));
      }
    } else {
      setGroups((p) => ({ ...p, [district]: [] }));
    }

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
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>
      <div className="space-y-4">
        {DISTRICT_OPTIONS.map((d) => {
          const dates = getTrainingDates(d, month);
          return (
            <div key={d} className="border rounded-xl bg-white/70 shadow">
              <button
                className="w-full text-left px-4 py-2 font-semibold"
                onClick={() => toggleDistrict(d)}
              >
                {d}
              </button>
              {openDistricts[d] && (
                <div className="p-4 overflow-x-auto">
                  {loading[d] && (
                    <div className="text-sm text-gray-500">загрузка…</div>
                  )}
                  {!loading[d] && (
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr>
                          <th className="px-2 py-1 text-left">ФИО</th>
                          {dates.map((dt) => (
                            <th key={dt} className="px-2 py-1 text-center">
                              {new Date(dt).getDate()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(groups[d] || []).map((g) => (
                          <Fragment key={g.id}>
                            <tr>
                              <td
                                colSpan={dates.length + 1}
                                className="font-semibold pt-2"
                              >
                                {g.age_band}
                              </td>
                            </tr>
                            {g.clients.map((c) => (
                              <tr key={c.id} className="border-t">
                                <td className="px-2 py-1">
                                  {c.first_name}
                                  {c.last_name ? ` ${c.last_name}` : ''}
                                </td>
                                {dates.map((dt) => {
                                  const key = `${c.id}-${dt}`;
                                  return (
                                    <td key={dt} className="px-2 py-1 text-center">
                                      <input
                                        type="checkbox"
                                        checked={!!records[key]}
                                        onChange={() => toggle(c.id, dt)}
                                      />
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                            {g.clients.length === 0 && (
                              <tr>
                                <td
                                  className="px-2 py-1 text-sm text-gray-500"
                                  colSpan={dates.length + 1}
                                >
                                  Клиентов нет
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

