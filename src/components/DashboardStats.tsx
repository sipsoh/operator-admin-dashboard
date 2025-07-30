import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mockData, calculateStats } from "@/lib/data";

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
  searchQuery?: string;
  reportTypeFilter?: string;
  dateRangeFilter?: string;
}

export const DashboardStats = ({ 
  activeFilter, 
  onFilterChange, 
  searchQuery = "",
  reportTypeFilter = "all",
  dateRangeFilter = "all"
}: DashboardStatsProps) => {
  const stats = calculateStats(mockData, { searchQuery, reportTypeFilter, dateRangeFilter });
  
  const statCards = [
    {
      title: "Total Submissions",
      value: stats.total,
      color: "primary" as const,
      filterType: "all"
    },
    {
      title: "Approved",
      value: stats.approved,
      color: "success" as const,
      filterType: "approved"
    },
    {
      title: "Pending",
      value: stats.pending,
      color: "warning" as const,
      filterType: "pending"
    },
    {
      title: "In Review",
      value: stats.inReview,
      color: "warning" as const,
      filterType: "in-review"
    },
    {
      title: "Submitted",
      value: stats.submitted,
      color: "primary" as const,
      filterType: "submitted"
    },
    {
      title: "Non-Compliant",
      value: stats.nonCompliant,
      color: "danger" as const,
      filterType: "non-compliant"
    },
    {
      title: "Overdue",
      value: stats.overdue,
      color: "danger" as const,
      filterType: "overdue"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
      {statCards.map((stat) => (
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