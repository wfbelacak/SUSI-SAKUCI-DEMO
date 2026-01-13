import { cn } from "@/lib/utils";

export type ComplaintStatus = "pending" | "in_progress" | "completed" | "rejected";

interface StatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

const statusConfig: Record<ComplaintStatus, { label: string; className: string }> = {
  pending: {
    label: "Menunggu",
    className: "status-pending",
  },
  in_progress: {
    label: "Diproses",
    className: "status-progress",
  },
  completed: {
    label: "Selesai",
    className: "status-completed",
  },
  rejected: {
    label: "Ditolak",
    className: "status-rejected",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
        config.className,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
      {config.label}
    </span>
  );
}
