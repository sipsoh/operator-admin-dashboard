import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, CheckCircle, AlertTriangle, FileText, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  color: "primary" | "success" | "warning" | "danger";
  isActive?: boolean;
  onClick?: () => void;
  filterType?: string;
}

const StatCard = ({ title, value, change, trend, icon, color, isActive, onClick, filterType }: StatCardProps) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    danger: "text-danger bg-danger/10"
  };

  const trendColors = {
    up: "text-success",
    down: "text-danger",
    neutral: "text-muted-foreground"
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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className={`text-sm font-medium ${trend ? trendColors[trend] : 'text-muted-foreground'}`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
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
      change: "+12% this month",
      trend: "up" as const,
      icon: <FileText className="h-6 w-6" />,
      color: "primary" as const,
      filterType: "all"
    },
    {
      title: "Approved",
      value: "89",
      change: "+8% this month", 
      trend: "up" as const,
      icon: <CheckCircle className="h-6 w-6" />,
      color: "success" as const,
      filterType: "approved"
    },
    {
      title: "Pending Review",
      value: "34",
      change: "+3 today",
      trend: "up" as const,
      icon: <Clock className="h-6 w-6" />,
      color: "warning" as const,
      filterType: "pending"
    },
    {
      title: "Non-Compliant",
      value: "18",
      change: "-5% this month",
      trend: "down" as const,
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "danger" as const,
      filterType: "non-compliant"
    },
    {
      title: "Overdue",
      value: "15",
      change: "Critical",
      trend: "neutral" as const,
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "danger" as const,
      filterType: "overdue"
    },
    {
      title: "Active Operators",
      value: "24",
      change: "All entities",
      trend: "neutral" as const,
      icon: <Users className="h-6 w-6" />,
      color: "primary" as const,
      filterType: "operators"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
      {stats.map((stat) => (
        <StatCard
          key={stat.filterType}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
          icon={stat.icon}
          color={stat.color}
          isActive={activeFilter === stat.filterType}
          onClick={() => onFilterChange(stat.filterType)}
          filterType={stat.filterType}
        />
      ))}
    </div>
  );
};