"use client";

type Status = "available" | "busy" | "high-demand";

interface LiveStatusBadgeProps {
  status: Status;
  showLabel?: boolean;
}

const statusConfig: Record<Status, { color: string; bgColor: string; label: string }> = {
  available: {
    color: "bg-green-500",
    bgColor: "bg-green-100",
    label: "Available",
  },
  busy: {
    color: "bg-yellow-500",
    bgColor: "bg-yellow-100",
    label: "Busy",
  },
  "high-demand": {
    color: "bg-red-500",
    bgColor: "bg-red-100",
    label: "High Demand",
  },
};

export function LiveStatusBadge({ status, showLabel = true }: LiveStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bgColor}`}>
      <span className={`h-2 w-2 rounded-full ${config.color} animate-pulse`} />
      {showLabel && (
        <span className="text-xs font-medium text-foreground">{config.label}</span>
      )}
    </div>
  );
}
