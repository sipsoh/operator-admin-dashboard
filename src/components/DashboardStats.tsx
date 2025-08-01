import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mockData, calculateStats } from "@/lib/data";

interface StatCardProps {
  title: string;
  value: string | number;
  color: "primary" | "success" | "warning" | "danger" | "sabra-green" | "sabra-blue" | "sabra-red" | "sabra-orange" | "sabra-purple";
  isActive?: boolean;
  onClick?: () => void;
  filterType?: string;
}

const StatCard = ({ title, value, color, isActive, onClick, filterType }: StatCardProps) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    danger: "text-danger bg-danger/10",
    "sabra-green": "text-sabra-green bg-sabra-green/10 border-sabra-green/20",
    "sabra-blue": "text-sabra-blue bg-sabra-blue/10 border-sabra-blue/20",
    "sabra-red": "text-sabra-red bg-sabra-red/10 border-sabra-red/20",
    "sabra-orange": "text-sabra-orange bg-sabra-orange/10 border-sabra-orange/20",
    "sabra-purple": "text-sabra-purple bg-sabra-purple/10 border-sabra-purple/20"
  };

  const activeClass = isActive ? "ring-2 ring-primary bg-primary/5" : "";

  return (
    <Card 
      className={cn(
        "shadow-card hover:shadow-elevated transition-smooth cursor-pointer border-2",
        colorClasses[color],
        activeClass
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <div className={cn(
            "inline-flex items-center justify-center w-16 h-16 rounded-lg mt-2",
            color === "sabra-blue" && "bg-sabra-blue",
            color === "sabra-red" && "bg-sabra-red", 
            color === "sabra-green" && "bg-sabra-green",
            color === "sabra-orange" && "bg-sabra-orange",
            color === "sabra-purple" && "bg-sabra-purple",
            color === "primary" && "bg-primary",
            color === "warning" && "bg-warning",
            color === "danger" && "bg-danger"
          )}>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
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
  isArchivedView?: boolean;
}

export const DashboardStats = ({ 
  activeFilter, 
  onFilterChange, 
  searchQuery = "",
  reportTypeFilter = "all",
  dateRangeFilter = "all",
  isArchivedView = false
}: DashboardStatsProps) => {
  // Use archived data if in archived view
  const [dataSource, setDataSource] = React.useState(mockData);
  
  React.useEffect(() => {
    if (isArchivedView) {
      import("@/lib/mockBackend").then(({ mockArchivedWorkflows }) => {
        setDataSource(mockArchivedWorkflows);
      });
    } else {
      setDataSource(mockData);
    }
  }, [isArchivedView]);

  const stats = calculateStats(dataSource, { searchQuery, reportTypeFilter, dateRangeFilter });
  
  const statCards = [
    {
      title: "Total Submissions",
      value: stats.total,
      color: "sabra-blue" as const,
      filterType: "all"
    },
    {
      title: "Approved / Compliant",
      value: stats.approved,
      color: "sabra-green" as const,
      filterType: "approved"
    },
    {
      title: "Non-Compliant",
      value: stats.nonCompliant,
      color: "warning" as const,
      filterType: "non-compliant"
    },
    {
      title: "Pending Approval",
      value: stats.pending,
      color: "sabra-orange" as const,
      filterType: "pending"
    },
    {
      title: "Under Review",
      value: stats.inReview,
      color: "sabra-purple" as const,
      filterType: "in-review"
    },
    {
      title: "Rejected",
      value: stats.submitted,
      color: "danger" as const,
      filterType: "submitted"
    },
    {
      title: "Open / Past Due",
      value: stats.overdue,
      color: "primary" as const,
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