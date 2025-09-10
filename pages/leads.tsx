import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  LEAD_STAGES,
  type Lead,
  type LeadStage,
  type LeadSource,
} from '../lib/types';
import LeadCard from '../components/LeadCard';
import LeadModal from '../components/LeadModal';
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
  const [openModal, setOpenModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await supabase
      .from('leads')
      .select('id, created_at, name, phone, source, stage, birth_date, district, group_id')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setErrorMsg(error.message);
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

  async function addLead({
    name,
    phone,
    source,
  }: {
    name: string;
    phone: string | null;
    source: LeadSource;
  }) {
    setErrorMsg(null);
    const { data, error } = await supabase
      .from('leads')
      .insert({ name, phone, source, stage: 'queue' })
      .select(
        'id, created_at, name, phone, source, stage, birth_date, district, group_id'
      )
      .single();
    if (error) {
      console.error(error);
      setErrorMsg(error.message);
      await loadData();
      return;
    }

    if (data) {
      setLeads((prev) => ({
        ...prev,
        queue: [data as Lead, ...prev.queue],
      }));
      return;
    }

    // If Supabase didn't return the inserted row, reload the list
    await loadData();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Лиды</h1>
      <LeadForm onAdd={addLead} />
      {errorMsg && <div className="text-red-600 mb-2">{errorMsg}</div>}
      {loading && <div className="text-gray-500">Загрузка…</div>}
      <div className="flex gap-4 overflow-x-auto">
        {LEAD_STAGES.map((stage) => (
          <div key={stage.key} className="w-64 shrink-0">
            <h2 className="text-center font-semibold mb-2">{stage.title}</h2>
            {leads[stage.key].map((l) => (
              <LeadCard key={l.id} lead={l} onStageChange={changeStage} />
            ))}
          </div>
        ))}
      </div>
      {openModal && (
        <LeadModal
          onClose={() => setOpenModal(false)}
          onSaved={() => {
            setOpenModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
