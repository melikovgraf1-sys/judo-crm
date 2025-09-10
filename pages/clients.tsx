import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Client } from '../lib/types';
import ClientCard from '../components/ClientCard';
import ClientGroupPicker from '../components/ClientGroupPicker';
import ClientModal from '../components/ClientModal';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  async function loadData() {
    setLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('id, first_name, last_name, phone, district, payment_status')
      .order('created_at', { ascending: false });
    if (!error && data) setClients(data as Client[]);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const openAdd = () => { setEditing(null); setOpenModal(true); };
  const openEdit = (c: Client) => { setEditing(c); setOpenModal(true); };

  const remove = async (id: string) => {
    if (!confirm('Удалить клиента?')) return;
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) alert(error.message); else loadData();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Клиенты</h1>
      <div className="mb-4">
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Добавить клиента
        </button>
      </div>
      {loading && <div className="text-gray-500">Загрузка…</div>}
      <div className="space-y-3">
        {clients.map((c) => (
          <ClientCard key={c.id} client={c} onEdit={openEdit} onDelete={remove}>
            <div>
              <div className="text-xs uppercase text-gray-400 mb-1">Группы</div>
              <ClientGroupPicker clientId={c.id} />
            </div>
          </ClientCard>
        ))}
        {!loading && clients.length === 0 && (
          <div className="text-gray-500">Клиентов нет</div>
        )}
      </div>
      {openModal && (
        <ClientModal
          initial={editing}
          onClose={() => setOpenModal(false)}
          onSaved={() => { setOpenModal(false); loadData(); }}
        />
      )}
    </div>
  );
}
