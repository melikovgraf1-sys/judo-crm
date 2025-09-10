'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export type Group = {
  id: string;
  district: string;
  age_band: string;
  capacity: number;
};

type Props = {
  group: Group;
  onChanged?: () => void; // вызовем после update/delete
  onAddClient?: () => void;
  districts?: string[];
};

export default function GroupCard({ group, onChanged, onAddClient, districts }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    district: group.district,
    age_band: group.age_band,
    capacity: group.capacity,
  });
  const [err, setErr] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setErr(null);
    const { error } = await supabase
      .from('groups')
      .update({
        district: form.district.trim(),
        age_band: form.age_band.trim(),
        capacity: Number(form.capacity) || 0,
      })
      .eq('id', group.id);

    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setEditing(false);
    onChanged?.();
  }

  async function handleDelete() {
    if (!confirm('Удалить эту группу?')) return;
    const { error } = await supabase.from('groups').delete().eq('id', group.id);
    if (error) {
      alert('Ошибка удаления: ' + error.message);
      return;
    }
    onChanged?.();
  }

  if (!editing) {
    return (
      <div
        className="border rounded-2xl bg-white/70 shadow p-4 flex items-start justify-between cursor-pointer"
        onClick={onAddClient}
      >
        <div>
          <div className="font-semibold">{group.age_band}</div>
          <div className="text-sm text-gray-600">
            {group.district} • возраст {group.age_band} • вместимость {group.capacity}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded-lg bg-blue-400 text-white hover:bg-blue-500"
            onClick={(e) => { e.stopPropagation(); onAddClient?.(); }}
          >
            Добавить клиента
          </button>
          <button
            className="px-3 py-1 rounded-lg bg-blue-600 text-white"
            onClick={(e) => { e.stopPropagation(); setEditing(true); }}
          >
            Редактировать
          </button>
          <button
            className="px-3 py-1 rounded-lg bg-red-600/90 text-white"
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
          >
            Удалить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-2xl bg-white/70 shadow p-4 space-y-3 max-w-xl">
      <div className="grid grid-cols-3 gap-3">
        <label className="text-sm">
          Район
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          >
            {districts?.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Возраст
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={form.age_band}
            onChange={(e) => setForm({ ...form, age_band: e.target.value })}
          />
        </label>
        <label className="text-sm">
          Вместимость
          <input
            type="number"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={form.capacity}
            onChange={(e) =>
              setForm({ ...form, capacity: Number(e.target.value) })
            }
          />
        </label>
      </div>

      {err && <div className="text-sm text-red-600">{err}</div>}

      <div className="flex gap-2">
        <button
          className="px-3 py-2 rounded-lg bg-gray-200"
          onClick={() => {
            setForm({
              district: group.district,
              age_band: group.age_band,
              capacity: group.capacity,
            });
            setEditing(false);
          }}
          disabled={saving}
        >
          Отмена
        </button>
        <button
          className="px-3 py-2 rounded-lg bg-blue-600 text-white"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Сохраняю…' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}
