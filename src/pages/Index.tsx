import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardStats } from "@/components/DashboardStats";
import { SubmissionTable } from "@/components/SubmissionTable";

const Index = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [reportType, setReportType] = useState("all");
  const [dateRange, setDateRange] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <DashboardLayout
      reportType={reportType}
      dateRange={dateRange}
      searchQuery={searchQuery}
      onReportTypeChange={handleReportTypeChange}
      onDateRangeChange={handleDateRangeChange}
      onSearchChange={handleSearchChange}
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
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
