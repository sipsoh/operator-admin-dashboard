import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Status = "approved" | "pending" | "non-compliant" | "overdue" | "in-review" | "submitted";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  approved: {
    label: "Approved",
    className: "bg-success-light text-success border-success/20 hover:bg-success-light/80"
  },
  pending: {
    label: "Pending",
    className: "bg-pending-light text-pending border-pending/20 hover:bg-pending-light/80"
  },
  "non-compliant": {
    label: "Non-Compliant",
    className: "bg-danger-light text-danger border-danger/20 hover:bg-danger-light/80"
  },
  overdue: {
    label: "Overdue",
    className: "bg-danger text-danger-foreground border-danger hover:bg-danger/90"
  },
  "in-review": {
    label: "In Review",
    className: "bg-warning-light text-warning border-warning/20 hover:bg-warning-light/80"
  },
  submitted: {
    label: "Submitted",
    className: "bg-primary-glow text-primary border-primary/20 hover:bg-primary-glow/80"
  }
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium px-3 py-1 text-xs transition-smooth",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
};