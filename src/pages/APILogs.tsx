import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Search, Download, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const apiLogs = [
  {
    id: 1,
    timestamp: '2024-01-12 14:23:45',
    method: 'GET',
    endpoint: '/api/analytics/revenue',
    status: 200,
    responseTime: '145ms',
    userAgent: 'Chrome/120.0.0.0',
    ip: '192.168.1.105',
    userId: 'user_123',
    size: '2.4KB'
  },
  {
    id: 2,
    timestamp: '2024-01-12 14:23:42',
    method: 'POST',
    endpoint: '/api/users/create',
    status: 201,
    responseTime: '287ms',
    userAgent: 'Safari/17.0',
    ip: '192.168.1.108',
    userId: 'user_456',
    size: '1.2KB'
  },
  {
    id: 3,
    timestamp: '2024-01-12 14:23:38',
    method: 'GET',
    endpoint: '/api/ml/predictions',
    status: 500,
    responseTime: '3.2s',
    userAgent: 'Firefox/121.0',
    ip: '192.168.1.112',
    userId: 'user_789',
    size: '0.8KB'
  },
  {
    id: 4,
    timestamp: '2024-01-12 14:23:35',
    method: 'PUT',
    endpoint: '/api/dashboard/settings',
    status: 200,
    responseTime: '98ms',
    userAgent: 'Chrome/120.0.0.0',
    ip: '192.168.1.105',
    userId: 'user_123',
    size: '3.1KB'
  },
  {
    id: 5,
    timestamp: '2024-01-12 14:23:30',
    method: 'DELETE',
    endpoint: '/api/data/cleanup',
    status: 204,
    responseTime: '156ms',
    userAgent: 'Postman/10.0',
    ip: '192.168.1.200',
    userId: 'admin_001',
    size: '0B'
  },
  {
    id: 6,
    timestamp: '2024-01-12 14:23:25',
    method: 'GET',
    endpoint: '/api/users/profile',
    status: 404,
    responseTime: '45ms',
    userAgent: 'Chrome/120.0.0.0',
    ip: '192.168.1.115',
    userId: 'user_999',
    size: '0.5KB'
  }
];

const APILogsPage = () => {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-success/20 text-success border-success/30';
    if (status >= 300 && status < 400) return 'bg-warning/20 text-warning border-warning/30';
    if (status >= 400) return 'bg-destructive/20 text-destructive border-destructive/30';
    return 'bg-muted/20 text-muted-foreground border-muted/30';
  };

  const getMethodColor = (method: string) => {
    const colors = {
      'GET': 'bg-primary/20 text-primary border-primary/30',
      'POST': 'bg-success/20 text-success border-success/30',
      'PUT': 'bg-warning/20 text-warning border-warning/30',
      'DELETE': 'bg-destructive/20 text-destructive border-destructive/30',
      'PATCH': 'bg-secondary/20 text-secondary border-secondary/30'
    };
    return colors[method as keyof typeof colors] || 'bg-muted/20 text-muted-foreground border-muted/30';
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return <CheckCircle className="h-4 w-4 text-success" />;
    if (status >= 300 && status < 400) return <Clock className="h-4 w-4 text-warning" />;
    if (status >= 400) return <AlertCircle className="h-4 w-4 text-destructive" />;
    return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">API Logs</h1>
              <p className="text-muted-foreground">Monitor API requests and system activity</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* API Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">847</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
              <Database className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">98.2%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">156ms</p>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">15</p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search logs by endpoint, user, or IP..." 
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">All Methods</Button>
              <Button variant="outline" size="sm">All Status</Button>
              <Button variant="outline" size="sm">Last Hour</Button>
            </div>
          </div>
        </Card>

        {/* Live Status */}
        <Card className="p-4 bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse-glow"></div>
            <h3 className="text-lg font-semibold text-foreground">Live Monitoring Active</h3>
            <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
              Real-time
            </Badge>
            <span className="text-sm text-muted-foreground ml-auto">Refreshing every 5 seconds</span>
          </div>
        </Card>

        {/* API Logs Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent API Activity</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow"></div>
              <span>Live logs</span>
            </div>
          </div>
          
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {apiLogs.map((log, index) => (
                <Card 
                  key={log.id} 
                  className="p-4 hover:shadow-md transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Timestamp & Status */}
                    <div className="lg:col-span-3 flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <div>
                        <p className="text-sm font-medium text-foreground">{log.timestamp}</p>
                        <Badge variant="outline" className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Method & Endpoint */}
                    <div className="lg:col-span-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={getMethodColor(log.method)}>
                          {log.method}
                        </Badge>
                        <span className="text-sm font-mono text-foreground">{log.endpoint}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">User: {log.userId}</p>
                    </div>

                    {/* Performance */}
                    <div className="lg:col-span-2 text-center">
                      <p className="text-sm font-medium text-foreground">{log.responseTime}</p>
                      <p className="text-xs text-muted-foreground">Response Time</p>
                    </div>

                    {/* Client Info */}
                    <div className="lg:col-span-2">
                      <p className="text-sm text-foreground">{log.ip}</p>
                      <p className="text-xs text-muted-foreground truncate">{log.userAgent}</p>
                    </div>

                    {/* Size */}
                    <div className="lg:col-span-1 text-center">
                      <p className="text-sm font-medium text-foreground">{log.size}</p>
                      <p className="text-xs text-muted-foreground">Size</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-4">
            <h4 className="font-semibold text-foreground mb-3">Top Endpoints</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">/api/analytics</span>
                <span className="font-medium text-foreground">234 requests</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">/api/users</span>
                <span className="font-medium text-foreground">189 requests</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">/api/ml</span>
                <span className="font-medium text-foreground">156 requests</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold text-foreground mb-3">Response Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-success">2xx Success</span>
                <span className="font-medium text-foreground">832 (98.2%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-warning">3xx Redirect</span>
                <span className="font-medium text-foreground">0 (0%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-destructive">4xx/5xx Error</span>
                <span className="font-medium text-foreground">15 (1.8%)</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold text-foreground mb-3">Traffic Sources</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Web App</span>
                <span className="font-medium text-foreground">567 requests</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mobile App</span>
                <span className="font-medium text-foreground">234 requests</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">API Clients</span>
                <span className="font-medium text-foreground">46 requests</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default APILogsPage;