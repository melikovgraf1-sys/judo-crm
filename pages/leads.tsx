import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { LEAD_STAGES, type Lead, type LeadStage } from '../lib/types';
import LeadCard from '../components/LeadCard';
import LeadModal from '../components/LeadModal';

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
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
      setErrorMsg(error.message);
      setLeads(previous);
    }
  }

  const openAdd = () => {
    setEditing(null);
    setOpenModal(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Лиды</h1>
      <div className="mb-4">
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Добавить лида
        </button>
      </div>
      {errorMsg && <div className="text-red-600 mb-2">{errorMsg}</div>}
      {loading && <div className="text-gray-500">Загрузка…</div>}
      <div className="flex gap-4 overflow-x-auto">
        {LEAD_STAGES.map((stage) => (
          <div
            key={stage.key}
            className="w-64 shrink-0"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = Number(e.dataTransfer.getData('id'));
              if (!Number.isNaN(id)) changeStage(id, stage.key);
            }}
          >
            <h2 className="text-center font-semibold mb-2">{stage.title}</h2>
            {leads[stage.key].map((l) => (
              <LeadCard
                key={l.id}
                lead={l}
                onOpen={(lead) => {
                  setEditing(lead);
                  setOpenModal(true);
                }}
              />
            ))}
          </div>
        ))}
      </div>
      {openModal && (
        <LeadModal
          initial={editing}
          onClose={() => {
            setOpenModal(false);
            setEditing(null);
          }}
          onSaved={(lead) => {
            setOpenModal(false);
            setEditing(null);
            if (!lead.id) {
              loadData();
              return;
            }
            setLeads((prev) => {
              const updated: StageMap = emptyStageMap();
              for (const s of LEAD_STAGES) {
                updated[s.key] = prev[s.key].filter((l) => l.id !== lead.id);
              }
              updated[lead.stage].unshift(lead);
              return updated;
            });
          }}
          onError={(msg) => setErrorMsg(msg)}
        />
      )}
    </div>
  );
}
