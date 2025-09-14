import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RealTimeMetrics } from '@/components/dashboard/RealTimeMetrics';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel';

const OverviewPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Complete analytics overview with real-time insights</p>
        </div>
        
        {/* Real-time metrics cards */}
        <RealTimeMetrics />
        
        {/* Main analytics section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart />
          </div>
          <div className="lg:col-span-1">
            <AIInsightsPanel />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OverviewPage;