import { useState } from 'react';
import { LEAD_SOURCES } from '../lib/types';
import type { LeadSource } from '../lib/types';

export default function LeadForm({
  onAdd,
}: {
  onAdd: (data: { name: string; phone: string | null; source: LeadSource }) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState<LeadSource>('instagram');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await onAdd({ name, phone: phone || null, source });
    setName('');
    setPhone('');
    setSource('instagram');
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
          <option key={s} value={s}>
            {s}
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
