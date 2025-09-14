import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Database, Plus, Settings, RefreshCw, AlertCircle, CheckCircle, Trash2, Edit } from 'lucide-react';
import { AddDataSourceDialog } from '@/components/data-sources/AddDataSourceDialog';
import { EditDataSourceDialog } from '@/components/data-sources/EditDataSourceDialog';
import { useDataSources } from '@/hooks/useDataSources';
import { DataSource } from '@/services/dataSourceService';

const DataSourcesPage = () => {
  const {
    dataSources,
    loading,
    syncing,
    testing,
    addDataSource,
    updateDataSource,
    deleteDataSource,
    testConnection,
    syncDataSource,
    syncAll,
  } = useDataSources();

  const [editingDataSource, setEditingDataSource] = useState<DataSource | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dataSourceToDelete, setDataSourceToDelete] = useState<DataSource | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-success/20 text-success border-success/30';
      case 'syncing': return 'bg-warning/20 text-warning border-warning/30';
      case 'error': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'disconnected': return 'bg-muted/20 text-muted-foreground border-muted/30';
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
      'Communication': 'bg-chart-6/20 text-chart-6 border-chart-6/30',
      'File Upload': 'bg-chart-7/20 text-chart-7 border-chart-7/30'
    };
    return colors[type as keyof typeof colors] || 'bg-muted/20 text-muted-foreground border-muted/30';
  };

  const handleAddDataSource = async (data: any) => {
    try {
      await addDataSource(data);
    } catch (error) {
      console.error('Failed to add data source:', error);
    }
  };

  const handleUpdateDataSource = async (id: number, data: any) => {
    try {
      await updateDataSource(id, data);
      setEditingDataSource(null);
    } catch (error) {
      console.error('Failed to update data source:', error);
    }
  };

  const handleDeleteDataSource = async () => {
    if (dataSourceToDelete) {
      try {
        await deleteDataSource(dataSourceToDelete.id);
        setDeleteDialogOpen(false);
        setDataSourceToDelete(null);
      } catch (error) {
        console.error('Failed to delete data source:', error);
      }
    }
  };

  const handleTestConnection = async (id: number) => {
    try {
      await testConnection(id);
    } catch (error) {
      console.error('Failed to test connection:', error);
    }
  };

  const handleSyncDataSource = async (id: number) => {
    try {
      await syncDataSource(id);
    } catch (error) {
      console.error('Failed to sync data source:', error);
    }
  };

  const handleSyncAll = async () => {
    try {
      await syncAll();
    } catch (error) {
      console.error('Failed to sync all data sources:', error);
    }
  };

  const openDeleteDialog = (dataSource: DataSource) => {
    setDataSourceToDelete(dataSource);
    setDeleteDialogOpen(true);
  };

  // Calculate statistics
  const stats = {
    connected: dataSources.filter(ds => ds.status === 'connected').length,
    syncing: dataSources.filter(ds => ds.status === 'syncing').length,
    error: dataSources.filter(ds => ds.status === 'error').length,
    total: dataSources.length,
    totalRecords: dataSources.reduce((sum, ds) => {
      const records = parseFloat(ds.records.replace(/[KM]/g, match => 
        match === 'K' ? '000' : '000000'
      ));
      return sum + records;
    }, 0)
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSyncAll}
                disabled={syncing.size > 0}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing.size > 0 ? 'animate-spin' : ''}`} />
                {syncing.size > 0 ? 'Syncing...' : 'Sync All'}
              </Button>
              <AddDataSourceDialog onAdd={handleAddDataSource} />
            </div>
          </div>
        </div>

        {/* Data Sources Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.connected}</p>
                <p className="text-sm text-muted-foreground">Connected</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.syncing}</p>
                <p className="text-sm text-muted-foreground">Syncing</p>
              </div>
              <RefreshCw className={`h-8 w-8 text-warning ${stats.syncing > 0 ? 'animate-spin' : ''}`} />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.error}</p>
                <p className="text-sm text-muted-foreground">Error</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalRecords >= 1000000 
                    ? `${(stats.totalRecords / 1000000).toFixed(1)}M`
                    : `${(stats.totalRecords / 1000).toFixed(1)}K`
                  }
                </p>
                <p className="text-sm text-muted-foreground">Total Records</p>
              </div>
              <Database className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Data Sources Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
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
                  <div className="flex gap-1 flex-wrap">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleSyncDataSource(source.id)}
                      disabled={syncing.has(source.id)}
                      title="Sync data source"
                    >
                      <RefreshCw className={`h-4 w-4 ${syncing.has(source.id) ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setEditingDataSource(source)}
                      title="Edit data source"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(source)}
                      title="Delete data source"
                    >
                      <Trash2 className="h-4 w-4" />
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2 border-t border-border">
                  <div className="flex gap-2 flex-wrap">
                    {source.status === 'error' && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleTestConnection(source.id)}
                        disabled={testing.has(source.id)}
                        className="text-xs"
                      >
                        {testing.has(source.id) ? 'Testing...' : 'Reconnect'}
                      </Button>
                    )}
                    {source.status === 'connected' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTestConnection(source.id)}
                        disabled={testing.has(source.id)}
                        className="text-xs"
                      >
                        {testing.has(source.id) ? 'Testing...' : 'Test Connection'}
                      </Button>
                    )}
                    {source.status === 'disconnected' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSyncDataSource(source.id)}
                        disabled={syncing.has(source.id)}
                        className="text-xs"
                      >
                        {syncing.has(source.id) ? 'Connecting...' : 'Connect'}
                      </Button>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingDataSource(source)}
                    className="text-xs self-start sm:self-auto"
                  >
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

        {/* Edit Data Source Dialog */}
        <EditDataSourceDialog
          dataSource={editingDataSource}
          open={!!editingDataSource}
          onOpenChange={(open) => !open && setEditingDataSource(null)}
          onUpdate={handleUpdateDataSource}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Data Source</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{dataSourceToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteDataSource}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default DataSourcesPage;