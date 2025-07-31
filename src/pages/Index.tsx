import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardStats } from "@/components/DashboardStats";
import { SubmissionTable } from "@/components/SubmissionTable";

const Index = () => {
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
        {/* Dashboard Statistics */}
        <DashboardStats 
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          reportTypeFilter={reportType}
          dateRangeFilter={dateRange}
        />

        {/* Main Table */}
        <div className="w-full">
          <SubmissionTable 
            statusFilter={activeFilter}
            reportTypeFilter={reportType}
            dateRangeFilter={dateRange}
            searchQuery={searchQuery}
            key={refreshTrigger}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
