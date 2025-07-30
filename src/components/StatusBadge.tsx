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
    className: "text-success font-medium"
  },
  pending: {
    label: "Pending",
    className: "text-pending font-medium"
  },
  "non-compliant": {
    label: "Non-Compliant",
    className: "text-danger font-medium"
  },
  overdue: {
    label: "Overdue",
    className: "text-danger font-medium"
  },
  "in-review": {
    label: "In Review",
    className: "text-warning font-medium"
  },
  submitted: {
    label: "Submitted",
    className: "text-primary font-medium"
  }
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span 
      className={cn(
        "font-medium text-xs",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};