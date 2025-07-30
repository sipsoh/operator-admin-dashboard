import { Search, Bell, Settings, Filter, Download, Plus, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import sabraLogo from "@/assets/sabra-logo.png";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardLayoutProps {
  children: React.ReactNode;
  reportType: string;
  dateRange: string;
  searchQuery?: string;
  onReportTypeChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
  onSearchChange?: (query: string) => void;
}

export const DashboardLayout = ({ 
  children, 
  reportType, 
  dateRange,
  searchQuery = "",
  onReportTypeChange, 
  onDateRangeChange,
  onSearchChange 
}: DashboardLayoutProps) => {
  const reportTypes = [
    { value: "all", label: "All Report Types" },
    { value: "monthly-financial", label: "Monthly Financial" },
    { value: "rent-schedule", label: "Rent Schedule" },
    { value: "lease-agreement", label: "Lease Agreement" },
    { value: "quarterly-review", label: "Quarterly Review" },
    { value: "insurance-documents", label: "Insurance Documents" },
    { value: "compliance-report", label: "Compliance Report" }
  ];

  const dateRanges = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="bg-card border-b border-border shadow-card sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img src={sabraLogo} alt="Sabra Logo" className="h-8 w-auto" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Operator Workflow</h1>
                  <p className="text-xs text-muted-foreground">Tracking Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search submissions, operators..."
                  className="pl-10 w-80 bg-muted/50"
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
              </div>
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
              
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
};