import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Filter, X } from "lucide-react";

export const FilterPanel = () => {
  const statusFilters = [
    { value: "approved", label: "Approved", count: 89 },
    { value: "pending", label: "Pending", count: 34 },
    { value: "non-compliant", label: "Non-Compliant", count: 18 },
    { value: "overdue", label: "Overdue", count: 15 },
    { value: "in-review", label: "In Review", count: 12 },
    { value: "submitted", label: "Submitted", count: 8 }
  ];

  const reportTypes = [
    "Monthly Financial",
    "Rent Schedule", 
    "Lease Agreement",
    "Quarterly Review",
    "Insurance Documents",
    "Compliance Report"
  ];

  const priorities = ["High", "Medium", "Low"];

  return (
    <Card className="shadow-card">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Filter className="h-5 w-5 mr-2 text-primary" />
          Filters & Quick Views
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Active Filters */}
        <div>
          <h4 className="font-medium text-sm text-foreground mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              This Month
              <X className="h-3 w-3 ml-1 cursor-pointer" />
            </Badge>
            <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
              High Priority
              <X className="h-3 w-3 ml-1 cursor-pointer" />
            </Badge>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <h4 className="font-medium text-sm text-foreground mb-3">Date Range</h4>
          <Select>
            <SelectTrigger>
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filters */}
        <div>
          <h4 className="font-medium text-sm text-foreground mb-3">Status</h4>
          <div className="space-y-3">
            {statusFilters.map((status) => (
              <div key={status.value} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id={status.value} />
                  <label 
                    htmlFor={status.value} 
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {status.label}
                  </label>
                </div>
                <Badge variant="outline" className="text-xs">
                  {status.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Report Type */}
        <div>
          <h4 className="font-medium text-sm text-foreground mb-3">Report Type</h4>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div>
          <h4 className="font-medium text-sm text-foreground mb-3">Priority</h4>
          <div className="space-y-2">
            {priorities.map((priority) => (
              <div key={priority} className="flex items-center space-x-2">
                <Checkbox id={priority.toLowerCase()} />
                <label 
                  htmlFor={priority.toLowerCase()} 
                  className="text-sm text-foreground cursor-pointer"
                >
                  {priority}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t border-border">
          <Button className="w-full bg-gradient-primary hover:opacity-90">
            Apply Filters
          </Button>
          <Button variant="outline" className="w-full">
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};