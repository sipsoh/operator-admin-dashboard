import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, CheckCircle, AlertTriangle, FileText, Users } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  color: "primary" | "success" | "warning" | "danger";
}

const StatCard = ({ title, value, change, trend, icon, color }: StatCardProps) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success-light",
    warning: "text-warning bg-warning-light",
    danger: "text-danger bg-danger-light"
  };

  const trendColors = {
    up: "text-success",
    down: "text-danger",
    neutral: "text-muted-foreground"
  };

  return (
    <Card className="shadow-card hover:shadow-elevated transition-smooth">
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

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
      <StatCard
        title="Total Submissions"
        value="156"
        change="+12% this month"
        trend="up"
        icon={<FileText className="h-6 w-6" />}
        color="primary"
      />
      <StatCard
        title="Approved"
        value="89"
        change="+8% this month"
        trend="up"
        icon={<CheckCircle className="h-6 w-6" />}
        color="success"
      />
      <StatCard
        title="Pending Review"
        value="34"
        change="+3 today"
        trend="up"
        icon={<Clock className="h-6 w-6" />}
        color="warning"
      />
      <StatCard
        title="Non-Compliant"
        value="18"
        change="-5% this month"
        trend="down"
        icon={<AlertTriangle className="h-6 w-6" />}
        color="danger"
      />
      <StatCard
        title="Overdue"
        value="15"
        change="Critical"
        trend="neutral"
        icon={<AlertTriangle className="h-6 w-6" />}
        color="danger"
      />
      <StatCard
        title="Active Operators"
        value="24"
        change="All entities"
        trend="neutral"
        icon={<Users className="h-6 w-6" />}
        color="primary"
      />
    </div>
  );
};