import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import AddGroupModal from '../components/AddGroupModal';
import GroupWithClients from '../components/GroupWithClients';
import { Group } from '../components/GroupCard';

const DISTRICTS = ['Центр', 'Джикджилли', 'Махмутлар'];

export default function Home() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDistricts, setOpenDistricts] = useState<Record<string, boolean>>({});

  async function loadData() {
    const { data, error } = await supabase
      .from('groups')
      .select('id, district, age_band, capacity')
      .order('district', { ascending: true });
    if (!error && data) setGroups(data as Group[]);
  }
  useEffect(() => { loadData(); }, []);

  const toggleDistrict = (d: string) => {
    setOpenDistricts((prev) => ({ ...prev, [d]: !prev[d] }));
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 text-center pt-10">Judo CRM</h1>

      {/* Панель действий */}
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Group
        </button>
      </div>

      {/* Список групп по районам */}
      <div className="mt-6 space-y-4 max-w-3xl mx-auto px-4 pb-10">
        {DISTRICTS.map((d) => (
          <div key={d} className="border rounded-xl bg-white/70 shadow">
            <button
              className="w-full text-left px-4 py-2 font-semibold"
              onClick={() => toggleDistrict(d)}
            >
              {d}
            </button>
            {openDistricts[d] && (
              <div className="p-4 space-y-3">
                {groups
                  .filter((g) => g.district === d)
                  .map((g) => (
                    <GroupWithClients key={g.id} group={g} onChanged={loadData} />
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Модалка создания */}
      <AddGroupModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCreated={loadData}
      />
    </main>
  );
}
