import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardStats } from "@/components/DashboardStats";
import { SubmissionTable } from "@/components/SubmissionTable";
import { FilterPanel } from "@/components/FilterPanel";
import { RecentActivity } from "@/components/RecentActivity";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Dashboard Statistics */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Panel */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <FilterPanel />
              <RecentActivity />
            </div>
          </div>

          {/* Main Table */}
          <div className="lg:col-span-3">
            <SubmissionTable />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
