import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Lead, LeadStage, LeadSource } from '../lib/types';
import { LEAD_STAGES, LEAD_STAGE_TITLES } from '../lib/types';
import LeadCard from '../components/LeadCard';
import LeadForm from '../components/LeadForm';

type StageMap = Record<LeadStage, Lead[]>;

function emptyStageMap(): StageMap {
  return LEAD_STAGES.reduce((acc, s) => {
    acc[s.key] = [];
    return acc;
  }, {} as StageMap);
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<StageMap>(emptyStageMap());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);


  async function loadData() {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('id, created_at, name, phone, source, stage')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const grouped: StageMap = emptyStageMap();
    for (const lead of data as Lead[]) {
      grouped[lead.stage].push(lead);
    }
    setLeads(grouped);
    setLoading(false);
  }

  async function addLead(data: { name: string; phone: string | null; source: LeadSource }) {
    const { error } = await supabase.from('leads').insert({ ...data, stage: 'queue' });
    if (error) {
      console.error(error);
      return;
    }
    await loadData();
  }

  async function changeStage(id: number, stage: LeadStage) {
    const previous = leads;
    setLeads((prev) => {
      const updated: StageMap = emptyStageMap();
      for (const s of LEAD_STAGES) {
        updated[s.key] = prev[s.key].filter((l) => l.id !== id);
      }
      const current = Object.values(prev).flat().find((l) => l.id === id);
      if (current) {
        updated[stage] = [{ ...current, stage }, ...updated[stage]];
      }
      return updated;
    });

    const { error } = await supabase.from('leads').update({ stage }).eq('id', id);
    if (error) {
      console.error(error);
      setLeads(previous);
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
            <h2 className="text-center font-semibold mb-2">{LEAD_STAGE_TITLES[stage.key]}</h2>
            {leads[stage.key].map((l) => (
              <LeadCard key={l.id} lead={l} onStageChange={changeStage} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
