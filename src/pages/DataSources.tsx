import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Plus, Settings, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

const dataSources = [
  {
    id: 1,
    name: 'PostgreSQL Database',
    type: 'Database',
    status: 'connected',
    lastSync: '2 minutes ago',
    records: '2.4M',
    description: 'Primary application database with user and transaction data',
    health: 'healthy'
  },
  {
    id: 2,
    name: 'Google Analytics',
    type: 'Analytics',
    status: 'connected',
    lastSync: '5 minutes ago',
    records: '847K',
    description: 'Website traffic and user behavior analytics',
    health: 'healthy'
  },
  {
    id: 3,
    name: 'Stripe Payments',
    type: 'API',
    status: 'connected',
    lastSync: '1 hour ago',
    records: '156K',
    description: 'Payment processing and transaction data',
    health: 'warning'
  },
  {
    id: 4,
    name: 'Salesforce CRM',
    type: 'CRM',
    status: 'syncing',
    lastSync: '30 minutes ago',
    records: '89K',
    description: 'Customer relationship management data',
    health: 'healthy'
  },
  {
    id: 5,
    name: 'AWS CloudWatch',
    type: 'Monitoring',
    status: 'connected',
    lastSync: '3 minutes ago',
    records: '1.2M',
    description: 'Infrastructure monitoring and log data',
    health: 'healthy'
  },
  {
    id: 6,
    name: 'Slack Workspace',
    type: 'Communication',
    status: 'error',
    lastSync: '2 days ago',
    records: '45K',
    description: 'Team communication and activity data',
    health: 'error'
  }
];

const DataSourcesPage = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-success/20 text-success border-success/30';
      case 'syncing': return 'bg-warning/20 text-warning border-warning/30';
      case 'error': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Database': 'bg-primary/20 text-primary border-primary/30',
      'Analytics': 'bg-secondary/20 text-secondary border-secondary/30',
      'API': 'bg-chart-3/20 text-chart-3 border-chart-3/30',
      'CRM': 'bg-chart-4/20 text-chart-4 border-chart-4/30',
      'Monitoring': 'bg-chart-5/20 text-chart-5 border-chart-5/30',
      'Communication': 'bg-chart-6/20 text-chart-6 border-chart-6/30'
    };
    return colors[type as keyof typeof colors] || 'bg-muted/20 text-muted-foreground border-muted/30';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Data Sources</h1>
              <p className="text-muted-foreground">Manage and monitor your data connections</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync All
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Source
              </Button>
            </div>
          </div>
        </div>

        {/* Data Sources Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">Connected</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">1</p>
                <p className="text-sm text-muted-foreground">Syncing</p>
              </div>
              <RefreshCw className="h-8 w-8 text-warning animate-spin" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">1</p>
                <p className="text-sm text-muted-foreground">Error</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">4.8M</p>
                <p className="text-sm text-muted-foreground">Total Records</p>
              </div>
              <Database className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Data Sources Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dataSources.map((source, index) => (
            <Card 
              key={source.id} 
              className="p-6 hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{source.name}</h3>
                      {getHealthIcon(source.health)}
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className={getStatusColor(source.status)}>
                        {source.status}
                      </Badge>
                      <Badge variant="outline" className={getTypeColor(source.type)}>
                        {source.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground">{source.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Records</p>
                    <p className="text-lg font-semibold text-foreground">{source.records}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Sync</p>
                    <p className="text-sm text-foreground">{source.lastSync}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <div className="flex gap-2">
                    {source.status === 'error' && (
                      <Button variant="destructive" size="sm">
                        Reconnect
                      </Button>
                    )}
                    {source.status === 'connected' && (
                      <Button variant="outline" size="sm">
                        Test Connection
                      </Button>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Setup</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="text-center">
                <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium text-foreground mb-1">Database</h4>
                <p className="text-xs text-muted-foreground">Connect SQL/NoSQL databases</p>
              </div>
            </Card>
            <Card className="p-4 border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium text-foreground mb-1">API</h4>
                <p className="text-xs text-muted-foreground">Integrate REST/GraphQL APIs</p>
              </div>
            </Card>
            <Card className="p-4 border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="text-center">
                <Settings className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium text-foreground mb-1">File Upload</h4>
                <p className="text-xs text-muted-foreground">Upload CSV, JSON files</p>
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DataSourcesPage;