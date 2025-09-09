export type Client = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  channel: 'telegram' | 'whatsapp' | 'instagram' | null;
  birth_date: string | null;
  parent_name: string | null;
  start_date: string | null;
  gender: 'm' | 'f' | null;
  payment_status: 'pending' | 'active' | 'debt' | null;
  payment_method: 'cash' | 'transfer' | null;
  district: string | null;
};
