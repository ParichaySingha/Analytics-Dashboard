import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Database, Globe, FileText, Zap, Users, BarChart3 } from 'lucide-react';

const dataSourceTypes = [
  { value: 'database', label: 'Database', icon: Database, description: 'SQL/NoSQL databases' },
  { value: 'api', label: 'API', icon: Globe, description: 'REST/GraphQL APIs' },
  { value: 'file', label: 'File Upload', icon: FileText, description: 'CSV, JSON, Excel files' },
  { value: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Google Analytics, Mixpanel' },
  { value: 'crm', label: 'CRM', icon: Users, description: 'Salesforce, HubSpot' },
  { value: 'monitoring', label: 'Monitoring', icon: Zap, description: 'CloudWatch, DataDog' },
];

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().optional(),
  host: z.string().optional(),
  port: z.string().optional(),
  database: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  apiUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  apiKey: z.string().optional(),
  syncInterval: z.string().optional(),
  autoSync: z.boolean().default(true),
  sslEnabled: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface DataSource {
  id: number;
  name: string;
  type: string;
  status: string;
  lastSync: string;
  records: string;
  description: string;
  health: string;
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

interface EditDataSourceDialogProps {
  dataSource: DataSource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: number, data: FormData) => void;
  isLoading?: boolean;
}

export const EditDataSourceDialog = ({ 
  dataSource, 
  open, 
  onOpenChange, 
  onUpdate, 
  isLoading = false 
}: EditDataSourceDialogProps) => {
  const [selectedType, setSelectedType] = useState<string>('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: '',
      description: '',
      host: '',
      port: '',
      database: '',
      username: '',
      password: '',
      apiUrl: '',
      apiKey: '',
      syncInterval: '30',
      autoSync: true,
      sslEnabled: false,
    },
  });

  useEffect(() => {
    if (dataSource) {
      form.reset({
        name: dataSource.name,
        type: dataSource.type.toLowerCase(),
        description: dataSource.description || '',
        host: dataSource.host || '',
        port: dataSource.port || '',
        database: dataSource.database || '',
        username: dataSource.username || '',
        password: dataSource.password || '',
        apiUrl: dataSource.apiUrl || '',
        apiKey: dataSource.apiKey || '',
        syncInterval: dataSource.syncInterval || '30',
        autoSync: dataSource.autoSync ?? true,
        sslEnabled: dataSource.sslEnabled ?? false,
      });
      setSelectedType(dataSource.type.toLowerCase());
    }
  }, [dataSource, form]);

  const onSubmit = (data: FormData) => {
    if (dataSource) {
      onUpdate(dataSource.id, data);
      onOpenChange(false);
    }
  };

  const selectedTypeConfig = dataSourceTypes.find(type => type.value === selectedType);

  const renderTypeSpecificFields = () => {
    switch (selectedType) {
      case 'database':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host</FormLabel>
                    <FormControl>
                      <Input placeholder="localhost" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input placeholder="5432" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="database"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Name</FormLabel>
                  <FormControl>
                    <Input placeholder="my_database" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="sslEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable SSL</FormLabel>
                    <FormDescription>
                      Use SSL connection for database security
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        );
      case 'api':
        return (
          <>
            <FormField
              control={form.control}
              name="apiUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://api.example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    The base URL for the API endpoint
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="your-api-key" {...field} />
                  </FormControl>
                  <FormDescription>
                    Authentication key for the API
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 'file':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                File upload configuration
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: CSV, JSON, Excel, Parquet
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Configuration options will appear after selecting a type
            </p>
          </div>
        );
    }
  };

  if (!dataSource) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle>Edit Data Source</DialogTitle>
          <DialogDescription>
            Update the configuration for {dataSource.name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Data Source" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for this data source
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedType(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a data source type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataSourceTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">{type.label}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {type.description}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of this data source..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedType && (
                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      {selectedTypeConfig && (
                        <>
                          <selectedTypeConfig.icon className="h-4 w-4" />
                          {selectedTypeConfig.label} Configuration
                        </>
                      )}
                    </h4>
                    {renderTypeSpecificFields()}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="syncInterval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sync Interval (minutes)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select interval" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                          <SelectItem value="1440">24 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="autoSync"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Auto Sync</FormLabel>
                        <FormDescription>
                          Automatically sync data at intervals
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Data Source'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
