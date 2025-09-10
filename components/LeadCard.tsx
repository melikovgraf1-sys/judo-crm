import Link from 'next/link';
import type { Lead, LeadStage } from '../lib/types';
import { LEAD_STAGES, LEAD_SOURCE_TITLES } from '../lib/types';
import { cn } from '../lib/utils';

export type LeadCardProps = {
  lead: Lead;
  onStageChange: (id: number, stage: LeadStage) => void;
  className?: string;
};

export default function LeadCard({ lead, onStageChange, className }: LeadCardProps) {
  const createdAt = lead.created_at ? new Date(lead.created_at) : null;
  const createdLabel =
    createdAt && !Number.isNaN(createdAt.getTime())
      ? new Intl.DateTimeFormat('ru-RU').format(createdAt)
      : null;

  return (
    <div className={cn('bg-white rounded shadow p-2 mb-2', className)}>
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium">{lead.name}</div>
          {lead.phone && <div className="text-sm text-gray-500">{lead.phone}</div>}
          {createdLabel && <div className="text-xs text-gray-400">{createdLabel}</div>}
        </div>
        <Link href={`/leads/${lead.id}`} className="text-xs text-blue-500">
          View
        </Link>
      </div>
      <select
        className="mt-2 w-full border rounded text-sm"
        value={lead.stage}
        onChange={(e) => onStageChange(lead.id, e.target.value as LeadStage)}
      >
        {LEAD_STAGES.map((s) => (
          <option key={s.key} value={s.key}>
            {s.title}
          </option>
        ))}
      </select>
      <div className="text-xs text-gray-400 mt-1">{LEAD_SOURCE_TITLES[lead.source]}</div>
    </div>
  );
}
