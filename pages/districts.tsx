import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import AddGroupModal from '../components/AddGroupModal';
import GroupWithClients from '../components/GroupWithClients';
import { Group } from '../components/GroupCard';
import { DISTRICT_OPTIONS } from '../lib/districts';

export default function DistrictsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [districts, setDistricts] = useState<string[]>([...DISTRICT_OPTIONS]);
  const [openAddGroup, setOpenAddGroup] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
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

  const addDistrict = () => {
    const name = prompt('Название района?')?.trim();
    if (name && !districts.includes(name)) {
      setDistricts([...districts, name]);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 text-center pt-10">Judo CRM</h1>

      {/* Панель действий */}
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <button
          onClick={addDistrict}
          className="bg-blue-200 text-blue-900 px-4 py-2 rounded hover:bg-blue-300"
        >
          + Добавить район
        </button>
      </div>

      {/* Список групп по районам */}
      <div className="mt-6 space-y-4 max-w-3xl mx-auto px-4 pb-10">
        {districts.map((d) => (
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
                    <GroupWithClients key={g.id} group={g} onChanged={loadData} districts={districts} />
                  ))}
                <button
                  onClick={() => { setSelectedDistrict(d); setOpenAddGroup(true); }}
                  className="bg-blue-300 text-blue-900 px-3 py-1 rounded hover:bg-blue-400"
                >
                  + Добавить группу
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Модалка создания группы */}
      <AddGroupModal
        open={openAddGroup}
        onClose={() => setOpenAddGroup(false)}
        onCreated={loadData}
        districts={districts}
        initialDistrict={selectedDistrict ?? undefined}
      />
    </main>
  );
}
