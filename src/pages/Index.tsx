import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardStats } from "@/components/DashboardStats";
import { SubmissionTable } from "@/components/SubmissionTable";

const Index = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [reportType, setReportType] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleReportTypeChange = (value: string) => {
    setReportType(value);
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
  };

  return (
    <DashboardLayout
      reportType={reportType}
      dateRange={dateRange}
      onReportTypeChange={handleReportTypeChange}
      onDateRangeChange={handleDateRangeChange}
    >
      <div className="space-y-8">
        {/* Dashboard Statistics */}
        <DashboardStats 
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        {/* Main Table */}
        <div className="w-full">
          <SubmissionTable 
            statusFilter={activeFilter}
            reportTypeFilter={reportType}
            dateRangeFilter={dateRange}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
