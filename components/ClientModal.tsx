import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Client } from '../lib/types';

export default function ClientModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: Client | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<Client>>({});

  useEffect(() => { setForm(initial ?? {}); }, [initial]);

  const set = <K extends keyof Client>(k: K, v: Client[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    // валидация минимальная
    if (!form.first_name) { alert('Введите имя'); return; }

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name ?? null,
      phone: form.phone ?? null,
      channel: form.channel ?? null,
      birth_date: form.birth_date ?? null,
      parent_name: form.parent_name ?? null,
      start_date: form.start_date ?? null,
      gender: form.gender ?? null,
      payment_status: form.payment_status ?? null,
      payment_method: form.payment_method ?? null,
      district: form.district ?? null,
    };

    let error;
    if (initial?.id) {
      ({ error } = await supabase.from('clients').update(payload).eq('id', initial.id));
    } else {
      ({ error } = await supabase.from('clients').insert(payload));
    }
    if (error) { alert(error.message); return; }
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-4 w-full max-w-lg space-y-3">
        <div className="text-lg font-semibold">{initial ? 'Edit client' : 'Add client'}</div>
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded p-2 col-span-1" placeholder="Имя"
                 value={form.first_name ?? ''} onChange={e => set('first_name', e.target.value)} />
          <input className="border rounded p-2 col-span-1" placeholder="Фамилия"
                 value={form.last_name ?? ''} onChange={e => set('last_name', e.target.value)} />
          <input className="border rounded p-2 col-span-1" placeholder="Телефон"
                 value={form.phone ?? ''} onChange={e => set('phone', e.target.value)} />
          <select className="border rounded p-2 col-span-1" value={form.channel ?? ''} onChange={e => set('channel', e.target.value || null)}>
            <option value="">Канал</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="instagram">Instagram</option>
          </select>
          <input type="date" className="border rounded p-2 col-span-1" value={form.birth_date ?? ''} onChange={e => set('birth_date', e.target.value)} />
          <input className="border rounded p-2 col-span-1" placeholder="Родитель"
                 value={form.parent_name ?? ''} onChange={e => set('parent_name', e.target.value)} />
          <input type="date" className="border rounded p-2 col-span-1" value={form.start_date ?? ''} onChange={e => set('start_date', e.target.value)} />
          <select className="border rounded p-2 col-span-1" value={form.gender ?? ''} onChange={e => set('gender', e.target.value || null)}>
            <option value="">Пол</option>
            <option value="m">М</option>
            <option value="f">Ж</option>
          </select>
          <select className="border rounded p-2 col-span-1" value={form.payment_status ?? ''} onChange={e => set('payment_status', e.target.value || null)}>
            <option value="">Статус оплаты</option>
            <option value="pending">Ожидает</option>
            <option value="active">Активен</option>
            <option value="debt">Долг</option>
          </select>
          <select className="border rounded p-2 col-span-1" value={form.payment_method ?? ''} onChange={e => set('payment_method', e.target.value || null)}>
            <option value="">Способ оплаты</option>
            <option value="cash">Нал</option>
            <option value="transfer">Перевод</option>
          </select>
          <input className="border rounded p-2 col-span-2" placeholder="Район"
                 value={form.district ?? ''} onChange={e => set('district', e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-2 rounded bg-gray-200" onClick={onClose}>Cancel</button>
          <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
