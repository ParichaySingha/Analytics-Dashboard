import { useEffect, useState } from 'react';
import { Activity, Users, DollarSign, TrendingUp } from 'lucide-react';
import { MetricCard } from './MetricCard';

// Simulate real-time data updates
const useRealTimeMetrics = () => {
  const [metrics, setMetrics] = useState({
    revenue: 75420,
    users: 2847,
    conversions: 12.4,
    growth: 23.7,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        revenue: prev.revenue + Math.floor(Math.random() * 100 - 50),
        users: prev.users + Math.floor(Math.random() * 10 - 5),
        conversions: Math.max(0, prev.conversions + (Math.random() * 0.2 - 0.1)),
        growth: Math.max(0, prev.growth + (Math.random() * 0.4 - 0.2)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
};

export const RealTimeMetrics = () => {
  const metrics = useRealTimeMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Revenue"
        value={`$${metrics.revenue.toLocaleString()}`}
        change="+12.5%"
        trend="up"
        icon={DollarSign}
        color="primary"
      />
      <MetricCard
        title="Active Users"
        value={metrics.users.toLocaleString()}
        change="+8.3%"
        trend="up"
        icon={Users}
        color="success"
      />
      <MetricCard
        title="Conversion Rate"
        value={`${metrics.conversions.toFixed(1)}%`}
        change="-2.1%"
        trend="down"
        icon={TrendingUp}
        color="warning"
      />
      <MetricCard
        title="Growth Rate"
        value={`${metrics.growth.toFixed(1)}%`}
        change="+15.8%"
        trend="up"
        icon={Activity}
        color="secondary"
      />
    </div>
  );
};