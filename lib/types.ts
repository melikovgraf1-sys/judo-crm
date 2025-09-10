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
  district: 'Центр' | 'Джикджилли' | 'Махмутлар' | null;
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

export const LEAD_SOURCES = [
  { key: 'instagram', title: 'Instagram' },
  { key: 'whatsapp', title: 'WhatsApp' },
  { key: 'telegram', title: 'Telegram' },
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number]['key'];
export const LEAD_SOURCE_TITLES: Record<LeadSource, string> = Object.fromEntries(
  LEAD_SOURCES.map((s) => [s.key, s.title])
) as Record<LeadSource, string>;

export const LEAD_STAGES = [
  { key: 'queue', title: 'Очередь' },
  { key: 'hold', title: 'Задержка' },
  { key: 'trial', title: 'Пробное' },
  { key: 'awaiting_payment', title: 'Ожидание оплаты' },
  { key: 'paid', title: 'Оплачено' },
  { key: 'canceled', title: 'Отмена' },
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number]['key'];
export const LEAD_STAGE_TITLES: Record<LeadStage, string> = Object.fromEntries(
  LEAD_STAGES.map((s) => [s.key, s.title])
) as Record<LeadStage, string>;

export type Lead = {
  id: number;
  created_at: string;
  updated_at?: string | null;
  name: string;
  phone: string | null;
  source: LeadSource;
  stage: LeadStage;
  birth_date: string | null;
  district: 'Центр' | 'Джикджилли' | 'Махмутлар' | null;
  group_id: string | null;
};
