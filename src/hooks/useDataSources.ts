import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { dataSourceService, DataSource, CreateDataSourceData } from '@/services/dataSourceService';

export const useDataSources = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<Set<number>>(new Set());
  const [testing, setTesting] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  // Load data sources
  const loadDataSources = useCallback(async () => {
    try {
      setLoading(true);
      const sources = await dataSourceService.getAll();
      setDataSources(sources);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load data sources',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Add new data source
  const addDataSource = useCallback(async (data: CreateDataSourceData) => {
    try {
      const newDataSource = await dataSourceService.create(data);
      setDataSources(prev => [...prev, newDataSource]);
      toast({
        title: 'Success',
        description: 'Data source added successfully',
      });
      return newDataSource;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add data source',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Update data source
  const updateDataSource = useCallback(async (id: number, data: CreateDataSourceData) => {
    try {
      const updatedDataSource = await dataSourceService.update(id, data);
      setDataSources(prev => 
        prev.map(ds => ds.id === id ? updatedDataSource : ds)
      );
      toast({
        title: 'Success',
        description: 'Data source updated successfully',
      });
      return updatedDataSource;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update data source',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Delete data source
  const deleteDataSource = useCallback(async (id: number) => {
    try {
      await dataSourceService.delete(id);
      setDataSources(prev => prev.filter(ds => ds.id !== id));
      toast({
        title: 'Success',
        description: 'Data source deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete data source',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Test connection
  const testConnection = useCallback(async (id: number) => {
    try {
      setTesting(prev => new Set(prev).add(id));
      const result = await dataSourceService.testConnection(id);
      
      if (result.success) {
        toast({
          title: 'Connection Test',
          description: result.message,
        });
      } else {
        toast({
          title: 'Connection Test Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
      
      return result;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to test connection',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setTesting(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }, [toast]);

  // Sync data source
  const syncDataSource = useCallback(async (id: number) => {
    try {
      setSyncing(prev => new Set(prev).add(id));
      const result = await dataSourceService.sync(id);
      
      if (result.success) {
        // Update the data source in the list
        setDataSources(prev => 
          prev.map(ds => {
            if (ds.id === id) {
              return {
                ...ds,
                status: 'connected' as const,
                lastSync: 'Just now',
                health: 'healthy' as const,
                records: result.records ? `${(result.records / 1000).toFixed(1)}K` : ds.records,
              };
            }
            return ds;
          })
        );
        
        toast({
          title: 'Sync Complete',
          description: result.message,
        });
      } else {
        // Update status to error
        setDataSources(prev => 
          prev.map(ds => {
            if (ds.id === id) {
              return {
                ...ds,
                status: 'error' as const,
                health: 'error' as const,
              };
            }
            return ds;
          })
        );
        
        toast({
          title: 'Sync Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
      
      return result;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync data source',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setSyncing(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }, [toast]);

  // Sync all data sources
  const syncAll = useCallback(async () => {
    try {
      setSyncing(prev => new Set(dataSources.map(ds => ds.id)));
      const result = await dataSourceService.syncAll();
      
      // Reload data sources to get updated status
      await loadDataSources();
      
      toast({
        title: 'Sync All Complete',
        description: `Successfully synced ${result.success} of ${result.total} data sources. ${result.failed} failed.`,
      });
      
      return result;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync all data sources',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setSyncing(new Set());
    }
  }, [dataSources, loadDataSources, toast]);

  // Load data sources on mount
  useEffect(() => {
    loadDataSources();
  }, [loadDataSources]);

  return {
    dataSources,
    loading,
    syncing,
    testing,
    loadDataSources,
    addDataSource,
    updateDataSource,
    deleteDataSource,
    testConnection,
    syncDataSource,
    syncAll,
  };
};
