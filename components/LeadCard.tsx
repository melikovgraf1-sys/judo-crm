import type { Lead, LeadStage } from '../lib/types';
import { LEAD_STAGES } from '../lib/types';

export default function LeadCard({
  lead,
  onStageChange,
}: {
  lead: Lead;
  onStageChange: (id: string, stage: LeadStage) => void;
}) {
  return (
    <div className="bg-white rounded shadow p-2 mb-2">
      <div className="font-medium">{lead.name}</div>
      {lead.phone && (
        <div className="text-sm text-gray-500">{lead.phone}</div>
      )}
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
      <div className="text-xs text-gray-400 mt-1">{lead.source}</div>
    </div>
  );
}
