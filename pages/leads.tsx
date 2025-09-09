import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Lead, LeadStage, LeadSource } from '../lib/types';
import { LEAD_STAGES, LEAD_STAGE_TITLES } from '../lib/types';
import LeadCard from '../components/LeadCard';
import LeadForm from '../components/LeadForm';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('id, created_at, name, phone, source, stage')
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
    } else if (data) {
      setLeads(data as Lead[]);
    }
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function addLead(data: {
    name: string;
    phone: string | null;
    source: LeadSource;
  }) {
    const { error } = await supabase.from('leads').insert({ ...data, stage: 'queue' });
    if (error) {
      console.error(error);
      return;
    }
    await loadData();
  }

  async function changeStage(id: string, stage: LeadStage) {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, stage } : l)));
    const { error } = await supabase
      .from('leads')
      .update({ stage })
      .eq('id', id);
    if (error) {
      console.error(error);
      await loadData();
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leads</h1>
      <LeadForm onAdd={addLead} />
      {loading && <div className="text-gray-500">loading…</div>}
      <div className="flex gap-4 overflow-x-auto">
        {LEAD_STAGES.map((stage) => (
          <div key={stage.key} className="w-64 shrink-0">
            <h2 className="text-center font-semibold mb-2">
              {LEAD_STAGE_TITLES[stage.key]}
            </h2>
            {leads.filter((l) => l.stage === stage.key).map((l) => (
              <LeadCard key={l.id} lead={l} onStageChange={changeStage} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
