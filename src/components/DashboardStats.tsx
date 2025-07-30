import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  color: "primary" | "success" | "warning" | "danger";
  isActive?: boolean;
  onClick?: () => void;
  filterType?: string;
}

const StatCard = ({ title, value, color, isActive, onClick, filterType }: StatCardProps) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    danger: "text-danger bg-danger/10"
  };

  const activeClass = isActive ? "ring-2 ring-primary bg-primary/5" : "";

  return (
    <Card 
      className={cn(
        "shadow-card hover:shadow-elevated transition-smooth cursor-pointer",
        activeClass
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const DashboardStats = ({ activeFilter, onFilterChange }: DashboardStatsProps) => {
  const stats = [
    {
      title: "Total Submissions",
      value: "156",
      color: "primary" as const,
      filterType: "all"
    },
    {
      title: "Open",
      value: "23",
      color: "primary" as const,
      filterType: "open"
    },
    {
      title: "Under Review",
      value: "34",
      color: "warning" as const,
      filterType: "under-review"
    },
    {
      title: "Pending Approval",
      value: "12",
      color: "warning" as const,
      filterType: "pending-approval"
    },
    {
      title: "Approved",
      value: "89",
      color: "success" as const,
      filterType: "approved"
    },
    {
      title: "Compliant",
      value: "67",
      color: "success" as const,
      filterType: "compliant"
    },
    {
      title: "Non-Compliant",
      value: "18",
      color: "danger" as const,
      filterType: "non-compliant"
    },
    {
      title: "Rejected",
      value: "8",
      color: "danger" as const,
      filterType: "rejected"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6 mb-8">
      {stats.map((stat) => (
        <StatCard
          key={stat.filterType}
          title={stat.title}
          value={stat.value}
          color={stat.color}
          isActive={activeFilter === stat.filterType}
          onClick={() => onFilterChange(stat.filterType)}
          filterType={stat.filterType}
        />
      ))}
    </div>
  );
};