import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertTriangle, FileText, MessageSquare } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "submission" | "approval" | "comment" | "overdue";
  title: string;
  description: string;
  timestamp: string;
  user: string;
  priority?: "high" | "medium" | "low";
}

const mockActivity: ActivityItem[] = [
  {
    id: "1",
    type: "submission",
    title: "New Financial Report Submitted",
    description: "Metro Properties LLC submitted monthly financial report for Building A Complex",
    timestamp: "2 minutes ago",
    user: "Metro Properties LLC"
  },
  {
    id: "2", 
    type: "approval",
    title: "Rent Schedule Approved",
    description: "Sarah Johnson approved rent schedule from Eastside Management",
    timestamp: "15 minutes ago",
    user: "Sarah Johnson"
  },
  {
    id: "3",
    type: "overdue",
    title: "Report Overdue Alert",
    description: "Quarterly Review from Northgate Associates is 3 days overdue",
    timestamp: "1 hour ago",
    user: "System",
    priority: "high"
  },
  {
    id: "4",
    type: "comment",
    title: "Comment Added",
    description: "Lisa Wong added feedback on Harbor Point Group lease agreement",
    timestamp: "2 hours ago",
    user: "Lisa Wong"
  },
  {
    id: "5",
    type: "submission",
    title: "Insurance Documents Submitted",
    description: "Central Business Park submitted updated insurance documentation",
    timestamp: "4 hours ago",
    user: "Central Business Park"
  }
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "submission":
      return <FileText className="h-4 w-4 text-primary" />;
    case "approval":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "overdue":
      return <AlertTriangle className="h-4 w-4 text-danger" />;
    case "comment":
      return <MessageSquare className="h-4 w-4 text-warning" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getActivityBadge = (type: string) => {
  switch (type) {
    case "submission":
      return <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">New</Badge>;
    case "approval":
      return <Badge variant="outline" className="bg-success-light text-success border-success/20 text-xs">Approved</Badge>;
    case "overdue":
      return <Badge variant="outline" className="bg-danger-light text-danger border-danger/20 text-xs">Overdue</Badge>;
    case "comment":
      return <Badge variant="outline" className="bg-warning-light text-warning border-warning/20 text-xs">Comment</Badge>;
    default:
      return null;
  }
};

export const RecentActivity = () => {
  return (
    <Card className="shadow-card">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {mockActivity.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-smooth cursor-pointer ${
                index !== mockActivity.length - 1 ? 'border-b border-border/50' : ''
              }`}
            >
              <div className="flex-shrink-0 p-2 rounded-full bg-muted/50">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </p>
                  {getActivityBadge(activity.type)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    by {activity.user}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
                {activity.priority === "high" && (
                  <Badge variant="outline" className="bg-danger-light text-danger border-danger/20 text-xs mt-2">
                    High Priority
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};