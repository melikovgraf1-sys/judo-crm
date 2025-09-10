import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Lead } from '../lib/types';
import { LEAD_STAGES } from '../lib/types';

export default function LeadModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: Lead | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<Lead>>({});

  useEffect(() => { setForm(initial ?? {}); }, [initial]);

  const set = (k: keyof Lead, v: Lead[keyof Lead]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    if (!form.name) { alert('Введите имя'); return; }
    if (!form.source) { alert('Выберите источник'); return; }
    const payload = {
      name: form.name,
      phone: form.phone ?? null,
      source: form.source,
      stage: (form.stage as Lead['stage']) ?? 'queue',
    };
    let error;
    if (initial?.id) {
      ({ error } = await supabase.from('leads').update(payload).eq('id', initial.id));
    } else {
      ({ error } = await supabase.from('leads').insert(payload));
    }
    if (error) { alert(error.message); return; }
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-4 w-full max-w-lg space-y-3">
        <div className="text-lg font-semibold">{initial ? 'Edit lead' : 'Add lead'}</div>
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded p-2 col-span-2" placeholder="Имя"
                 value={form.name ?? ''} onChange={e => set('name', e.target.value)} />
          <input className="border rounded p-2 col-span-2" placeholder="Телефон"
                 value={form.phone ?? ''} onChange={e => set('phone', e.target.value)} />
          <select className="border rounded p-2 col-span-1" value={form.source ?? ''} onChange={e => set('source', e.target.value as Lead['source'])}>
            <option value="">Источник</option>
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
          </select>
          <select className="border rounded p-2 col-span-1" value={form.stage ?? ''} onChange={e => set('stage', e.target.value as Lead['stage'])}>
            <option value="">Стадия</option>
            {LEAD_STAGES.map(s => (
              <option key={s.key} value={s.key}>{s.title}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-2 rounded bg-gray-200" onClick={onClose}>Cancel</button>
          <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
