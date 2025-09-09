import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Group = {
  id: string;
  district: string;
  age_band: string;
  capacity: number | null;
  name?: string | null; // если поле осталось в схеме
};

export default function ClientGroupPicker({
  clientId,
}: {
  clientId: string;
}) {
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [clientGroupIds, setClientGroupIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const assigned = useMemo(
    () => new Set(clientGroupIds),
    [clientGroupIds]
  );

  // грузим все группы
  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('groups')
        .select('id, district, age_band, capacity, name')
        .order('district', { ascending: true });
      if (!ignore) {
        if (error) console.error(error);
        setAllGroups(data || []);
        setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // грузим группы клиента
  useEffect(() => {
    let ignore = false;
    (async () => {
      const { data, error } = await supabase
        .from('client_groups')
        .select('group_id')
        .eq('client_id', clientId);
      if (!ignore) {
        if (error) console.error(error);
        setClientGroupIds((data || []).map((r) => r.group_id));
      }
    })();
    return () => { ignore = true; };
  }, [clientId]);

  async function add(groupId: string) {
    if (assigned.has(groupId)) return;
    setSaving(true);
    const { error } = await supabase
      .from('client_groups')
      .insert({ client_id: clientId, group_id: groupId });
    if (error) {
      alert(error.message);
    } else {
      setClientGroupIds((prev) => [...prev, groupId]);
    }
    setSaving(false);
  }

  async function remove(groupId: string) {
    setSaving(true);
    const { error } = await supabase
      .from('client_groups')
      .delete()
      .match({ client_id: clientId, group_id: groupId });
    if (error) {
      alert(error.message);
    } else {
      setClientGroupIds((prev) => prev.filter((id) => id !== groupId));
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="text-sm text-gray-500">loading groups…</div>;
  }

  return (
    <div className="space-y-2">
      {/* Назначенные группы — чипсы */}
      <div className="flex flex-wrap gap-2">
        {clientGroupIds.length === 0 && (
          <span className="text-sm text-gray-500">not assigned</span>
        )}
        {allGroups
          .filter((g) => assigned.has(g.id))
          .map((g) => (
            <span
              key={g.id}
              className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-sm"
            >
              {g.district} • {g.age_band}
              <button
                disabled={saving}
                onClick={() => remove(g.id)}
                className="ml-1 rounded-full bg-blue-100 hover:bg-blue-200 px-2"
                title="Remove"
              >
                ×
              </button>
            </span>
          ))}
      </div>

      {/* Добавление новой связи */}
      <div className="flex items-center gap-2">
        <select
          className="border rounded-xl px-3 py-2 text-sm"
          defaultValue=""
          onChange={(e) => {
            const id = e.target.value;
            if (id) add(id);
            e.currentTarget.value = '';
          }}
          disabled={saving}
        >
          <option value="" disabled>
            + add to group…
          </option>
          {allGroups
            .filter((g) => !assigned.has(g.id))
            .map((g) => (
              <option key={g.id} value={g.id}>
                {g.district} • {g.age_band}
              </option>
            ))}
        </select>
        {saving && <span className="text-xs text-gray-400">saving…</span>}
      </div>
    </div>
  );
}
