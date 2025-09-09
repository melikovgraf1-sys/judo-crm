import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Lead } from '../lib/types';
import LeadCard from '../components/LeadCard';

const STAGES = [
  { key: 'queue', title: 'Очередь' },
  { key: 'hold', title: 'Задержка' },
  { key: 'trial', title: 'Пробное' },
  { key: 'awaiting_payment', title: 'Ожидание оплаты' },
  { key: 'paid', title: 'Оплачено' },
  { key: 'canceled', title: 'Отмена' },
] as const;

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('id, created_at, name, phone, source, stage')
      .order('created_at', { ascending: false });
    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leads</h1>
      {loading && <div className="text-gray-500">loading…</div>}
      <div className="flex gap-4 overflow-x-auto">
        {STAGES.map((stage) => (
          <div key={stage.key} className="w-64 shrink-0">
            <h2 className="text-center font-semibold mb-2">{stage.title}</h2>
            {leads.filter((l) => l.stage === stage.key).map((l) => (
              <LeadCard key={l.id} lead={l} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
