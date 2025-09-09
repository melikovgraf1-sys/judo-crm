import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import GroupCard, { Group } from '../components/GroupCard';
import AddGroupModal from '../components/AddGroupModal';

export default function Home() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [openAdd, setOpenAdd] = useState(false);

  async function loadData() {
    const { data, error } = await supabase
      .from('groups')
      .select('id, district, age_band, capacity')
      .order('district', { ascending: true });
    if (!error && data) setGroups(data as Group[]);
  }
  useEffect(() => { loadData(); }, []);

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

      {/* Список групп */}
      <div className="mt-6 space-y-3 max-w-3xl mx-auto px-4 pb-10">
        {groups.map((g) => (
          <GroupCard key={g.id} group={g} onChanged={loadData} />
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
