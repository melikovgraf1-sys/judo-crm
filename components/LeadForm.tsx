import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { LEAD_SOURCES } from '../lib/types';
import type { LeadSource, District } from '../lib/types';
import { DISTRICT_OPTIONS } from '../lib/districts';

type Group = { id: string; district: string; age_band: string; name?: string | null };

export default function LeadForm({
  onAdd,
  onError,
}: {
  onAdd: (data: {
    name: string;
    phone: string | null;
    source: LeadSource;
    birth_date: string | null;
    district: District | null;
    group_id: string | null;
  }) => Promise<void>;
  onError: (msg: string) => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState<LeadSource>('instagram');
  const [birthDate, setBirthDate] = useState('');
  const [district, setDistrict] = useState<District | ''>('');
  const [groupId, setGroupId] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('id, district, age_band, name')
        .order('district', { ascending: true });
      if (error) {
        console.error(error);
        onError(error.message);
        return;
      }
      if (data) setGroups(data);
    })();
  }, [onError]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await onAdd({
      name,
      phone: phone || null,
      source,
      birth_date: birthDate || null,
      district: (district as District) || null,
      group_id: groupId || null,
    });
    setName('');
    setPhone('');
    setSource('instagram');
    setBirthDate('');
    setDistrict('');
    setGroupId('');
  }

  return (
    <form onSubmit={submit} className="flex gap-2 mb-4 flex-wrap">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя"
        className="border p-1 flex-1 min-w-[8rem]"
        required
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Телефон"
        className="border p-1 flex-1 min-w-[8rem]"
      />
      <select
        value={source}
        onChange={(e) => setSource(e.target.value as LeadSource)}
        className="border p-1"
      >
        {LEAD_SOURCES.map((s) => (
          <option key={s.key} value={s.key}>
            {s.title}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        className="border p-1"
        aria-label="Дата рождения"
      />
      <select
        value={district}
        onChange={(e) => setDistrict((e.target.value as District) || '')}
        className="border p-1"
      >
        <option value="">Район</option>
        {DISTRICT_OPTIONS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
        className="border p-1"
      >
        <option value="">Группа</option>
        {groups
          .filter((g) => !district || g.district === district)
          .map((g) => (
            <option key={g.id} value={g.id}>
              {g.district} • {g.age_band}
            </option>
          ))}
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Добавить
      </button>
    </form>
  );
}
