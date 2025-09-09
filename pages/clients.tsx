import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ClientGroupPicker from '../components/ClientGroupPicker';

type Client = {
  id: string;
  first_name: string;
  last_name: string | null;
  district: string | null;
  payment_status: string | null;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, first_name, last_name, district, payment_status')
        .order('created_at', { ascending: false });
      if (!ignore) {
        if (error) console.error(error);
        setClients(data || []);
        setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      {loading && <div className="text-gray-500">loading…</div>}
      <div className="space-y-3">
        {clients.map((c) => (
          <div key={c.id} className="rounded-2xl border bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  {c.first_name} {c.last_name || ''}
                </div>
                <div className="text-sm text-gray-500">
                  {c.district || '—'} • {c.payment_status || '—'}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs uppercase text-gray-400 mb-1">Groups</div>
              <ClientGroupPicker clientId={c.id} />
            </div>
          </div>
        ))}
        {!loading && clients.length === 0 && (
          <div className="text-gray-500">no clients yet</div>
        )}
      </div>
    </div>
  );
}
