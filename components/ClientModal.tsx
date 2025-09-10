import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Client } from '../lib/types';
import { DISTRICT_OPTIONS } from '../lib/districts';

export default function ClientModal({
  initial,
  onClose,
  onSaved,
  groupId,
  districts = [...DISTRICT_OPTIONS],
}: {
  initial?: Partial<Client> | null;
  onClose: () => void;
  onSaved: (client?: Client) => void;
  groupId?: string;
  districts?: string[];
}) {
  const [form, setForm] = useState<Partial<Client>>({});

  useEffect(() => { setForm(initial ?? {}); }, [initial]);

  const set = (k: keyof Client, v: Client[keyof Client]) =>
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
    let data;
    if (initial?.id) {
      ({ error } = await supabase
        .from('clients')
        .update(payload, { returning: 'minimal' })
        .eq('id', initial.id));
    } else {
      ({ error } = await supabase
        .from('clients')
        .insert(payload, { returning: 'minimal' }));
    }
    if (error) { alert(error.message); return; }
    onSaved(data as Client | undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-4 w-full max-w-lg space-y-3">
        <div className="text-lg font-semibold">
          {initial ? 'Edit client' : 'Add client'}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-1 flex flex-col">
            <span className="text-sm text-gray-700">Имя</span>
            <input
              className="border rounded p-2"
              value={form.first_name ?? ''}
              onChange={e => set('first_name', e.target.value)}
            />
          </label>
          <label className="col-span-1 flex flex-col">
            <span className="text-sm text-gray-700">Фамилия</span>
            <input
              className="border rounded p-2"
              value={form.last_name ?? ''}
              onChange={e => set('last_name', e.target.value)}
            />
          </label>
          <label className="col-span-1 flex flex-col">
            <span className="text-sm text-gray-700">Телефон</span>
            <input
              className="border rounded p-2"
              value={form.phone ?? ''}
              onChange={e => set('phone', e.target.value)}
            />
          </label>
          <label className="col-span-1 flex flex-col">
            <span className="text-sm text-gray-700">Канал</span>
            <select
              className="border rounded p-2"
              value={form.channel ?? ''}
              onChange={e => set('channel', e.target.value || null)}
            >
              <option value="">Не выбран</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="telegram">Telegram</option>
              <option value="instagram">Instagram</option>
            </select>
          </label>
          <label className="col-span-1 flex flex-col">
            <span className="text-sm text-gray-700">Дата рождения</span>
            <input
              type="date"
              className="border rounded p-2"
              aria-label="Дата рождения"
              value={form.birth_date ?? ''}
              onChange={e => set('birth_date', e.target.value)}
            />
          </label>
          <label className="col-span-1 flex flex-col">
            <span className="text-sm text-gray-700">Родитель</span>
            <input
              className="border rounded p-2"
              value={form.parent_name ?? ''}
              onChange={e => set('parent_name', e.target.value)}
            />
          </label>
          <label className="col-span-1 flex flex-col">
            <span className="text-sm text-gray-700">Начало посещения</span>
            <input
              type="date"
              className="border rounded p-2"
              aria-label="Начало посещения"
              value={form.start_date ?? ''}
              onChange={e => set('start_date', e.target.value)}
            />
          </label>
          <label className="col-span-1 flex flex-col">
            <span className="text-sm text-gray-700">Пол</span>
            <select
              className="border rounded p-2"
              value={form.gender ?? ''}
              onChange={e => set('gender', e.target.value || null)}
            >
              <option value="">Не выбран</option>
              <option value="m">М</option>
              <option value="f">Ж</option>
            </select>
          </label>
          <label className="col-span-1 flex flex-col">
            <span className="text-sm text-gray-700">Статус оплаты</span>
            <select
              className="border rounded p-2"
              value={form.payment_status ?? ''}
              onChange={e => set('payment_status', e.target.value || null)}
            >
              <option value="">Не выбран</option>
              <option value="pending">Ожидает</option>
              <option value="active">Активен</option>
              <option value="debt">Долг</option>
            </select>
          </label>
          <label className="col-span-1 flex flex-col">
            <span className="text-sm text-gray-700">Способ оплаты</span>
            <select
              className="border rounded p-2"
              value={form.payment_method ?? ''}
              onChange={e => set('payment_method', e.target.value || null)}
            >
              <option value="">Не выбран</option>
              <option value="cash">Нал</option>
              <option value="transfer">Перевод</option>
            </select>
          </label>
          <label className="col-span-2 flex flex-col">
            <span className="text-sm text-gray-700">Район</span>
            <select
              className="border rounded p-2"
              value={form.district ?? ''}
              onChange={e => set('district', e.target.value || null)}
            >
              <option value="">Не выбран</option>
              <option value="Центр">Центр</option>
              <option value="Джикджилли">Джикджилли</option>
              <option value="Махмутлар">Махмутлар</option>
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-2 rounded bg-gray-200" onClick={onClose}>Cancel</button>
          <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
