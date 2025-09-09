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
  district: 'Центр' | 'Махмутлар' | 'Джикджилли' | null;
};

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string | null;
  source: 'instagram' | 'whatsapp' | 'telegram';
  stage: 'queue' | 'hold' | 'trial' | 'awaiting_payment' | 'paid' | 'canceled';
};

export type AttendanceRecord = {
  id: string;
  client_id: string;
  date: string;
  present: boolean;
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  payment_id: string | null;
};
