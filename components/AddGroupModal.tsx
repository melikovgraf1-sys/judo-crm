import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void; // перезагрузить список
  districts: string[];
  initialDistrict?: string;
};

export default function AddGroupModal({ open, onClose, onCreated, districts, initialDistrict }: Props) {
  const [district, setDistrict] = useState(initialDistrict ?? districts[0] ?? '');
  const [ageBand, setAgeBand] = useState('');
  const [capacity, setCapacity] = useState<number>(16);
  const [loading, setLoading] = useState(false);
  const disabled = loading || !district || !ageBand || !capacity;

  useEffect(() => {
    setDistrict(initialDistrict ?? districts[0] ?? '');
  }, [initialDistrict, districts]);

  if (!open) return null;

  const submit = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('groups')
        .insert({ district, age_band: ageBand, capacity });
      if (error) throw error;
      onClose();
      onCreated();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow p-6 w-[420px]">
        <h3 className="text-xl font-semibold mb-4">Добавить группу</h3>

        <label className="block text-sm mb-1">Район</label>
        <select
          className="w-full border rounded px-3 py-2 mb-3"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        >
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <label className="block text-sm mb-1">Возраст (диапазон)</label>
        <input
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder="Напр. 4 - 6 лет"
          value={ageBand}
          onChange={(e) => setAgeBand(e.target.value)}
        />

        <label className="block text-sm mb-1">Вместимость</label>
        <input
          type="number"
          min={1}
          className="w-full border rounded px-3 py-2 mb-4"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">Отмена</button>
          <button
            onClick={submit}
            disabled={disabled}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? 'Сохраняю…' : 'Создать'}
          </button>
        </div>
      </div>
    </div>
  );
}
