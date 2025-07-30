import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, AlertTriangle, FileText, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "primary" | "success" | "warning" | "danger";
  isActive?: boolean;
  onClick?: () => void;
  filterType?: string;
}

const StatCard = ({ title, value, icon, color, isActive, onClick, filterType }: StatCardProps) => {
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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
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
      icon: <FileText className="h-6 w-6" />,
      color: "primary" as const,
      filterType: "all"
    },
    {
      title: "Approved",
      value: "89",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "success" as const,
      filterType: "approved"
    },
    {
      title: "Pending Review",
      value: "34",
      icon: <Clock className="h-6 w-6" />,
      color: "warning" as const,
      filterType: "pending"
    },
    {
      title: "Non-Compliant",
      value: "18",
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "danger" as const,
      filterType: "non-compliant"
    },
    {
      title: "Overdue",
      value: "15",
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "danger" as const,
      filterType: "overdue"
    },
    {
      title: "Active Operators",
      value: "24",
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