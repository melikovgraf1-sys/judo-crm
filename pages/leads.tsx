import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Lead } from '../lib/types';
import LeadCard from '../components/LeadCard';
import LeadModal from '../components/LeadModal';
import { LEAD_STAGES } from '../lib/leadStages';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);

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

  const openAdd = () => { setEditing(null); setOpenModal(true); };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leads</h1>
      <div className="mb-4">
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Lead
        </button>
      </div>
      {loading && <div className="text-gray-500">loading…</div>}
      <div className="flex gap-4 overflow-x-auto">
        {LEAD_STAGES.map((stage) => (
          <div key={stage.key} className="w-64 shrink-0">
            <h2 className="text-center font-semibold mb-2">{stage.title}</h2>
            {leads.filter((l) => l.stage === stage.key).map((l) => (
              <LeadCard key={l.id} lead={l} />
            ))}
          </div>
        ))}
      </div>
      {openModal && (
        <LeadModal
          initial={editing}
          onClose={() => setOpenModal(false)}
          onSaved={() => { setOpenModal(false); loadData(); }}
        />
      )}
    </div>
  );
}
