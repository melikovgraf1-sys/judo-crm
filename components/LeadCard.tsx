import type { Lead } from '../lib/types';

export default function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="bg-white rounded shadow p-2 mb-2">
      <div className="font-medium">{lead.name}</div>
      {lead.phone && (
        <div className="text-sm text-gray-500">{lead.phone}</div>
      )}
      <div className="text-xs text-gray-400 mt-1">{lead.source}</div>
    </div>
  );
}
