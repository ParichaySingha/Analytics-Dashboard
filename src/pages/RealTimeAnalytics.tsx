import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { Activity, Users, Eye, Clock } from 'lucide-react';
import { RealTimeClock } from '@/components/dashboard/RealTimeClock';

const realTimeData = [
  { time: '12:00', visitors: 145, pageViews: 423, events: 78 },
  { time: '12:15', visitors: 162, pageViews: 478, events: 92 },
  { time: '12:30', visitors: 187, pageViews: 521, events: 105 },
  { time: '12:45', visitors: 201, pageViews: 594, events: 118 },
  { time: '13:00', visitors: 178, pageViews: 506, events: 96 },
];

const liveMetrics = [
  { label: 'Current Visitors', value: '1,247', icon: Users, trend: '+12%' },
  { label: 'Page Views/min', value: '89', icon: Eye, trend: '+5%' },
  { label: 'Events/min', value: '34', icon: Activity, trend: '+18%' },
  { label: 'Avg Session', value: '4:32', icon: Clock, trend: '+8%' },
];

const RealTimeAnalyticsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Real-time Analytics</h1>
              <p className="text-muted-foreground">Live data streams and user activity monitoring</p>
            </div>
            <div className="hidden lg:block">
              <RealTimeClock />
            </div>
          </div>
          {/* Mobile clock - shows below title on smaller screens */}
          <div className="lg:hidden mt-4">
            <RealTimeClock />
          </div>
        </div>

        {/* Live Status */}
        <Card className="p-6 bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse-glow"></div>
            <h3 className="text-lg font-semibold text-foreground">Live Monitoring Active</h3>
            <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
              Real-time
            </Badge>
          </div>
        </Card>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {liveMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className="p-6 bg-gradient-to-br from-card to-muted/20 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <Badge variant="outline" className="text-xs text-success border-success/50">
                    {metric.trend}
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Live Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Live Visitors</h3>
              <p className="text-sm text-muted-foreground">Active users on your platform</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={realTimeData}>
                  <defs>
                    <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#visitorsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Live Events</h3>
              <p className="text-sm text-muted-foreground">User interactions in real-time</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={realTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="events"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RealTimeAnalyticsPage;