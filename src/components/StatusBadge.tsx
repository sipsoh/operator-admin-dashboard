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
    className: "bg-success/10 text-success border-success/30 hover:bg-success/20 font-medium"
  },
  pending: {
    label: "Pending",
    className: "bg-pending/10 text-pending border-pending/30 hover:bg-pending/20 font-medium"
  },
  "non-compliant": {
    label: "Non-Compliant",
    className: "bg-danger/10 text-danger border-danger/30 hover:bg-danger/20 font-medium"
  },
  overdue: {
    label: "Overdue",
    className: "bg-danger text-danger-foreground border-danger hover:bg-danger/90 font-medium"
  },
  "in-review": {
    label: "In Review",
    className: "bg-warning/10 text-warning border-warning/30 hover:bg-warning/20 font-medium"
  },
  submitted: {
    label: "Submitted",
    className: "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 font-medium"
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