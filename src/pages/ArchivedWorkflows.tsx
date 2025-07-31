import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardStats } from "@/components/DashboardStats";
import { SubmissionTable } from "@/components/SubmissionTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ArchivedWorkflows = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [reportType, setReportType] = useState("all");
  const [dateRange, setDateRange] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleReportTypeChange = (value: string) => {
    setReportType(value);
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleNewEntry = () => {
    // Trigger refresh of components that use mock data
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardLayout
      reportType={reportType}
      dateRange={dateRange}
      searchQuery={searchQuery}
      onReportTypeChange={handleReportTypeChange}
      onDateRangeChange={handleDateRangeChange}
      onSearchChange={handleSearchChange}
      onNewEntry={handleNewEntry}
    >
      <div className="space-y-8">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="h-8 px-3 text-xs"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">Archived Workflows</h1>
          </div>
        </div>

        {/* Dashboard Statistics */}
        <DashboardStats 
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          reportTypeFilter={reportType}
          dateRangeFilter={dateRange}
          isArchivedView={true}
        />

        {/* Main Table */}
        <div className="w-full">
          <SubmissionTable 
            statusFilter={activeFilter}
            reportTypeFilter={reportType}
            dateRangeFilter={dateRange}
            searchQuery={searchQuery}
            isArchivedView={true}
            key={refreshTrigger}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArchivedWorkflows;