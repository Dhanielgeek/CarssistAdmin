import type { AcStatus } from '../types/rider';

const STYLES: Record<AcStatus, { dot: string; text: string }> = {
  Active: { dot: 'bg-blue-500', text: 'text-blue-600' },
  Inactive: { dot: 'bg-red-500', text: 'text-red-500' },
  Pending: { dot: 'bg-amber-500', text: 'text-amber-600' },
};

export default function StatusBadge({ status }: { status: AcStatus }) {
  const style = STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${style.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}