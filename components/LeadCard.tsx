import type { Lead } from '../lib/types';
import { LEAD_SOURCE_TITLES } from '../lib/types';
import { cn } from '../lib/utils';

export type LeadCardProps = {
  lead: Lead;
  onOpen: (lead: Lead) => void;
  className?: string;
};

export default function LeadCard({ lead, onOpen, className }: LeadCardProps) {
  const createdAt = lead.created_at ? new Date(lead.created_at) : null;
  const createdLabel =
    createdAt && !Number.isNaN(createdAt.getTime())
      ? new Intl.DateTimeFormat('ru-RU').format(createdAt)
      : null;

  return (
    <div
      className={cn('bg-white rounded shadow p-2 mb-2 cursor-move', className)}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('id', String(lead.id))}
    >
      <div>
        <div
          className="font-medium cursor-pointer"
          onClick={() => onOpen(lead)}
        >
          {lead.name}
        </div>
        {lead.phone && <div className="text-sm text-gray-500">{lead.phone}</div>}
        {createdLabel && <div className="text-xs text-gray-400">{createdLabel}</div>}
      </div>
      <div className="text-xs text-gray-400 mt-1">{LEAD_SOURCE_TITLES[lead.source]}</div>
    </div>
  );
}
