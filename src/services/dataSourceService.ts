export interface DataSource {
  id: number;
  name: string;
  type: string;
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  lastSync: string;
  records: string;
  description: string;
  health: 'healthy' | 'warning' | 'error';
  host?: string;
  port?: string;
  database?: string;
  username?: string;
  password?: string;
  apiUrl?: string;
  apiKey?: string;
  syncInterval?: string;
  autoSync?: boolean;
  sslEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDataSourceData {
  name: string;
  type: string;
  description?: string;
  host?: string;
  port?: string;
  database?: string;
  username?: string;
  password?: string;
  apiUrl?: string;
  apiKey?: string;
  syncInterval?: string;
  autoSync?: boolean;
  sslEnabled?: boolean;
}

export interface UpdateDataSourceData extends CreateDataSourceData {
  id: number;
}

// Mock data - in a real app, this would be API calls
const mockDataSources: DataSource[] = [
  {
    id: 1,
    name: 'PostgreSQL Database',
    type: 'Database',
    status: 'connected',
    lastSync: '2 minutes ago',
    records: '2.4M',
    description: 'Primary application database with user and transaction data',
    health: 'healthy',
    host: 'localhost',
    port: '5432',
    database: 'app_db',
    username: 'postgres',
    syncInterval: '30',
    autoSync: true,
    sslEnabled: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'Google Analytics',
    type: 'Analytics',
    status: 'connected',
    lastSync: '5 minutes ago',
    records: '847K',
    description: 'Website traffic and user behavior analytics',
    health: 'healthy',
    apiUrl: 'https://analytics.google.com',
    syncInterval: '60',
    autoSync: true,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: 3,
    name: 'Stripe Payments',
    type: 'API',
    status: 'connected',
    lastSync: '1 hour ago',
    records: '156K',
    description: 'Payment processing and transaction data',
    health: 'warning',
    apiUrl: 'https://api.stripe.com',
    syncInterval: '240',
    autoSync: true,
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-01-08T09:15:00Z',
  },
  {
    id: 4,
    name: 'Salesforce CRM',
    type: 'CRM',
    status: 'syncing',
    lastSync: '30 minutes ago',
    records: '89K',
    description: 'Customer relationship management data',
    health: 'healthy',
    apiUrl: 'https://api.salesforce.com',
    syncInterval: '60',
    autoSync: true,
    createdAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-05T16:45:00Z',
  },
  {
    id: 5,
    name: 'AWS CloudWatch',
    type: 'Monitoring',
    status: 'connected',
    lastSync: '3 minutes ago',
    records: '1.2M',
    description: 'Infrastructure monitoring and log data',
    health: 'healthy',
    apiUrl: 'https://monitoring.amazonaws.com',
    syncInterval: '15',
    autoSync: true,
    createdAt: '2024-01-12T11:20:00Z',
    updatedAt: '2024-01-12T11:20:00Z',
  },
  {
    id: 6,
    name: 'Slack Workspace',
    type: 'Communication',
    status: 'error',
    lastSync: '2 days ago',
    records: '45K',
    description: 'Team communication and activity data',
    health: 'error',
    apiUrl: 'https://slack.com/api',
    syncInterval: '1440',
    autoSync: false,
    createdAt: '2024-01-03T13:10:00Z',
    updatedAt: '2024-01-03T13:10:00Z',
  }
];

let dataSources = [...mockDataSources];
let nextId = Math.max(...dataSources.map(ds => ds.id)) + 1;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dataSourceService = {
  // Get all data sources
  async getAll(): Promise<DataSource[]> {
    await delay(300);
    return [...dataSources];
  },

  // Get data source by ID
  async getById(id: number): Promise<DataSource | null> {
    await delay(200);
    return dataSources.find(ds => ds.id === id) || null;
  },

  // Create new data source
  async create(data: CreateDataSourceData): Promise<DataSource> {
    await delay(500);
    
    const newDataSource: DataSource = {
      id: nextId++,
      name: data.name,
      type: data.type,
      status: 'disconnected',
      lastSync: 'Never',
      records: '0',
      description: data.description || '',
      health: 'healthy',
      host: data.host,
      port: data.port,
      database: data.database,
      username: data.username,
      password: data.password,
      apiUrl: data.apiUrl,
      apiKey: data.apiKey,
      syncInterval: data.syncInterval || '30',
      autoSync: data.autoSync ?? true,
      sslEnabled: data.sslEnabled ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dataSources.push(newDataSource);
    return newDataSource;
  },

  // Update data source
  async update(id: number, data: CreateDataSourceData): Promise<DataSource> {
    await delay(500);
    
    const index = dataSources.findIndex(ds => ds.id === id);
    if (index === -1) {
      throw new Error('Data source not found');
    }

    const updatedDataSource: DataSource = {
      ...dataSources[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };

    dataSources[index] = updatedDataSource;
    return updatedDataSource;
  },

  // Delete data source
  async delete(id: number): Promise<void> {
    await delay(300);
    
    const index = dataSources.findIndex(ds => ds.id === id);
    if (index === -1) {
      throw new Error('Data source not found');
    }

    dataSources.splice(index, 1);
  },

  // Test connection
  async testConnection(id: number): Promise<{ success: boolean; message: string }> {
    await delay(1000);
    
    const dataSource = dataSources.find(ds => ds.id === id);
    if (!dataSource) {
      return { success: false, message: 'Data source not found' };
    }

    // Simulate connection test
    const success = Math.random() > 0.2; // 80% success rate
    return {
      success,
      message: success 
        ? 'Connection successful' 
        : 'Connection failed: Invalid credentials or network error'
    };
  },

  // Sync data source
  async sync(id: number): Promise<{ success: boolean; message: string; records?: number }> {
    await delay(2000);
    
    const dataSource = dataSources.find(ds => ds.id === id);
    if (!dataSource) {
      return { success: false, message: 'Data source not found' };
    }

    // Simulate sync
    const success = Math.random() > 0.1; // 90% success rate
    const records = Math.floor(Math.random() * 10000) + 1000;

    if (success) {
      // Update the data source
      dataSource.status = 'connected';
      dataSource.lastSync = 'Just now';
      dataSource.records = `${(records / 1000).toFixed(1)}K`;
      dataSource.health = 'healthy';
    } else {
      dataSource.status = 'error';
      dataSource.health = 'error';
    }

    return {
      success,
      message: success 
        ? `Sync completed successfully. ${records} records processed.`
        : 'Sync failed: Connection timeout',
      records: success ? records : undefined
    };
  },

  // Sync all data sources
  async syncAll(): Promise<{ success: number; failed: number; total: number }> {
    await delay(3000);
    
    const results = await Promise.allSettled(
      dataSources.map(ds => this.sync(ds.id))
    );

    const success = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - success;

    return { success, failed, total: results.length };
  },

  // Get statistics
  async getStats(): Promise<{
    total: number;
    connected: number;
    syncing: number;
    error: number;
    totalRecords: string;
  }> {
    await delay(200);
    
    const total = dataSources.length;
    const connected = dataSources.filter(ds => ds.status === 'connected').length;
    const syncing = dataSources.filter(ds => ds.status === 'syncing').length;
    const error = dataSources.filter(ds => ds.status === 'error').length;
    
    // Calculate total records
    const totalRecords = dataSources.reduce((sum, ds) => {
      const records = parseFloat(ds.records.replace(/[KM]/g, match => 
        match === 'K' ? '000' : '000000'
      ));
      return sum + records;
    }, 0);

    return {
      total,
      connected,
      syncing,
      error,
      totalRecords: totalRecords >= 1000000 
        ? `${(totalRecords / 1000000).toFixed(1)}M`
        : `${(totalRecords / 1000).toFixed(1)}K`
    };
  }
};
