import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
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
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  Play, 
  Pause, 
  Settings, 
  BarChart3, 
  Brain,
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  Activity,
  Server,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Scale,
  Heart,
  TrendingUp,
  TrendingDown,
  Cpu,
  HardDrive,
  Network
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  useDeployments, 
  useCreateDeployment, 
  useDeleteDeployment, 
  useScaleDeployment,
  useHealthCheckDeployment,
  useDeploymentMetrics,
  useDeploymentLogs
} from '@/hooks/useMLModels';
import { MLModel, ModelDeployment, DeploymentConfig } from '@/types/mlModels';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const deploymentSchema = z.object({
  modelId: z.string().min(1, 'Model is required'),
  environment: z.enum(['development', 'staging', 'production']),
  region: z.string().min(1, 'Region is required'),
  instanceType: z.string().min(1, 'Instance type is required'),
  minInstances: z.number().min(1).max(100),
  maxInstances: z.number().min(1).max(100),
  targetUtilization: z.number().min(10).max(100),
  healthCheckEnabled: z.boolean(),
  monitoringEnabled: z.boolean(),
});

type DeploymentFormData = z.infer<typeof deploymentSchema>;

interface DeploymentManagementProps {
  models: MLModel[];
}

export const DeploymentManagement = ({ models }: DeploymentManagementProps) => {
  const [activeTab, setActiveTab] = useState('deployments');
  const [selectedDeployment, setSelectedDeployment] = useState<ModelDeployment | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDeploymentForLogs, setSelectedDeploymentForLogs] = useState<string | null>(null);
  const [selectedDeploymentForMetrics, setSelectedDeploymentForMetrics] = useState<string | null>(null);
  
  const { data: deployments, isLoading } = useDeployments();
  const createDeploymentMutation = useCreateDeployment();
  const deleteDeploymentMutation = useDeleteDeployment();
  const scaleDeploymentMutation = useScaleDeployment();
  const healthCheckMutation = useHealthCheckDeployment();
  
  // Get logs for selected deployment
  const { data: deploymentLogs, isLoading: logsLoading } = useDeploymentLogs(selectedDeploymentForLogs || '');
  
  // Get metrics for selected deployment
  const { data: deploymentMetrics, isLoading: metricsLoading } = useDeploymentMetrics(selectedDeploymentForMetrics || '', 24);

  const form = useForm<DeploymentFormData>({
    resolver: zodResolver(deploymentSchema),
    defaultValues: {
      modelId: '',
      environment: 'development',
      region: 'us-east-1',
      instanceType: 'ml.m5.large',
      minInstances: 1,
      maxInstances: 5,
      targetUtilization: 70,
      healthCheckEnabled: true,
      monitoringEnabled: true,
    },
  });

  const onSubmit = async (data: DeploymentFormData) => {
    try {
      const config: DeploymentConfig = {
        modelId: data.modelId,
        environment: data.environment,
        region: data.region,
        instanceType: data.instanceType,
        scalingConfig: {
          minInstances: data.minInstances,
          maxInstances: data.maxInstances,
          targetUtilization: data.targetUtilization,
        },
        healthCheckEnabled: data.healthCheckEnabled,
        monitoringEnabled: data.monitoringEnabled,
      };

      await createDeploymentMutation.mutateAsync(config);
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Failed to create deployment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success border-success/30';
      case 'inactive': return 'bg-muted/20 text-muted-foreground border-muted/30';
      case 'error': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'deploying': return 'bg-warning/20 text-warning border-warning/30';
      case 'scaling': return 'bg-primary/20 text-primary border-primary/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'unhealthy': return 'text-destructive';
      case 'unknown': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const handleDeleteDeployment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this deployment? This action cannot be undone.')) {
      try {
        await deleteDeploymentMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete deployment:', error);
      }
    }
  };

  const handleScaleDeployment = async (id: string, minInstances: number, maxInstances: number) => {
    try {
      await scaleDeploymentMutation.mutateAsync({ id, minInstances, maxInstances });
    } catch (error) {
      console.error('Failed to scale deployment:', error);
    }
  };

  const handleHealthCheck = async (id: string) => {
    try {
      await healthCheckMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to perform health check:', error);
    }
  };

  const handleViewLogs = (deploymentId: string) => {
    setSelectedDeploymentForLogs(deploymentId);
    setActiveTab('logs');
  };

  const handleViewMetrics = (deploymentId: string) => {
    setSelectedDeploymentForMetrics(deploymentId);
    setActiveTab('monitoring');
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'info': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <XCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Server className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Deployment Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="create">Create Deployment</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="deployments" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Active Deployments</h3>
              <p className="text-sm text-muted-foreground">
                Manage and monitor your model deployments
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Deployment
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="space-y-4">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-20 bg-muted rounded"></div>
                    <div className="h-2 bg-muted rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : deployments && deployments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {deployments.map((deployment) => (
                <Card key={deployment.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{deployment.modelName}</h4>
                        <p className="text-sm text-muted-foreground">{deployment.endpoint}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className={getStatusColor(deployment.status)}>
                            {deployment.status}
                          </Badge>
                          <Badge variant="outline">
                            {deployment.environment}
                          </Badge>
                          <Badge variant="outline">
                            {deployment.region}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedDeployment(deployment)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleHealthCheck(deployment.id)}>
                            <Heart className="h-4 w-4 mr-2" />
                            Health Check
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleScaleDeployment(deployment.id, 2, 10)}>
                            <Scale className="h-4 w-4 mr-2" />
                            Scale
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteDeployment(deployment.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Requests:</span>
                        <span className="ml-1 font-medium">{deployment.requestCount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Response:</span>
                        <span className="ml-1 font-medium">{deployment.averageResponseTime}ms</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Health:</span>
                        <span className={`ml-1 font-medium ${getHealthStatusColor(deployment.healthCheck.status)}`}>
                          {deployment.healthCheck.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Instances:</span>
                        <span className="ml-1 font-medium">
                          {deployment.scalingConfig.minInstances}-{deployment.scalingConfig.maxInstances}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU Usage</span>
                        <span>{deployment.metrics.cpuUsage.toFixed(1)}%</span>
                      </div>
                      <Progress value={deployment.metrics.cpuUsage} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Memory Usage</span>
                        <span>{deployment.metrics.memoryUsage.toFixed(1)}%</span>
                      </div>
                      <Progress value={deployment.metrics.memoryUsage} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewMetrics(deployment.id)}
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Metrics
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewLogs(deployment.id)}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Logs
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No deployments found</p>
                  <p className="text-sm text-muted-foreground">
                    Create your first deployment to get started
                  </p>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Create New Deployment</CardTitle>
              <CardDescription>
                Deploy a model to a specific environment with custom configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="modelId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Model</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {models
                                .filter(model => model.status === 'Active')
                                .map((model) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    <div className="flex items-center gap-2">
                                      <span>{model.name}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {model.accuracy}% accuracy
                                      </Badge>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="environment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Environment</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select environment" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="development">Development</SelectItem>
                              <SelectItem value="staging">Staging</SelectItem>
                              <SelectItem value="production">Production</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select region" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                              <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                              <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                              <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instanceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instance Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select instance type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ml.m5.large">ml.m5.large</SelectItem>
                              <SelectItem value="ml.m5.xlarge">ml.m5.xlarge</SelectItem>
                              <SelectItem value="ml.c5.large">ml.c5.large</SelectItem>
                              <SelectItem value="ml.c5.xlarge">ml.c5.xlarge</SelectItem>
                              <SelectItem value="ml.p3.2xlarge">ml.p3.2xlarge</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Scaling Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="minInstances"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min Instances</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="100"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxInstances"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Instances</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="100"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetUtilization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Utilization (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="10"
                                max="100"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Monitoring & Health Checks</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="healthCheckEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Health Check</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Enable automatic health monitoring
                              </p>
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

                      <FormField
                        control={form.control}
                        name="monitoringEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Monitoring</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Enable detailed performance monitoring
                              </p>
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

                  <Button
                    type="submit"
                    disabled={createDeploymentMutation.isPending}
                    className="w-full"
                  >
                    {createDeploymentMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating Deployment...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Create Deployment
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Deployment Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                {selectedDeploymentForMetrics 
                  ? `Viewing metrics for deployment ${selectedDeploymentForMetrics.slice(-8)}`
                  : 'Select a deployment to view its metrics'
                }
              </p>
            </div>
            {selectedDeploymentForMetrics && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedDeploymentForMetrics(null)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Selection
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const metrics = deploymentMetrics || [];
                    const csvContent = [
                      ['Timestamp', 'Requests/sec', 'Response Time (ms)', 'Error Rate (%)', 'CPU Usage (%)', 'Memory Usage (%)', 'Active Instances'],
                      ...metrics.map(metric => [
                        new Date(metric.timestamp).toISOString(),
                        metric.requestsPerSecond,
                        metric.averageResponseTime,
                        metric.errorRate,
                        metric.cpuUsage,
                        metric.memoryUsage,
                        metric.activeInstances
                      ])
                    ].map(row => row.join(',')).join('\n');

                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `deployment-metrics-${selectedDeploymentForMetrics}.csv`;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
              </div>
            )}
          </div>

          {!selectedDeploymentForMetrics ? (
            <Card>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No deployment selected</p>
                  <p className="text-sm text-muted-foreground">
                    Click "Metrics" on a deployment card to view its metrics
                  </p>
                </div>
              </div>
            </Card>
          ) : metricsLoading ? (
            <Card>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground mb-4 animate-spin" />
                  <p className="text-muted-foreground">Loading metrics...</p>
                </div>
              </div>
            </Card>
          ) : deploymentMetrics && deploymentMetrics.length > 0 ? (
            <div className="space-y-6">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">Requests/sec</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">
                      {deploymentMetrics[deploymentMetrics.length - 1]?.requestsPerSecond.toFixed(1) || '0'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Current rate
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Avg Response</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">
                      {deploymentMetrics[deploymentMetrics.length - 1]?.averageResponseTime || '0'}ms
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Response time
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium">CPU Usage</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">
                      {deploymentMetrics[deploymentMetrics.length - 1]?.cpuUsage.toFixed(1) || '0'}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Current usage
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-info" />
                      <span className="text-sm font-medium">Memory</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">
                      {deploymentMetrics[deploymentMetrics.length - 1]?.memoryUsage.toFixed(1) || '0'}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Memory usage
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Request Rate Over Time</CardTitle>
                    <CardDescription>Requests per second over the last 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={deploymentMetrics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="timestamp" 
                            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                          />
                          <YAxis />
                          <Tooltip 
                            labelFormatter={(value) => new Date(value).toLocaleString()}
                            formatter={(value) => [`${value} req/s`, 'Requests/sec']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="requestsPerSecond" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Response Time</CardTitle>
                    <CardDescription>Average response time in milliseconds</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={deploymentMetrics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="timestamp" 
                            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                          />
                          <YAxis />
                          <Tooltip 
                            labelFormatter={(value) => new Date(value).toLocaleString()}
                            formatter={(value) => [`${value}ms`, 'Response Time']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="averageResponseTime" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Resource Usage</CardTitle>
                    <CardDescription>CPU and Memory usage over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={deploymentMetrics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="timestamp" 
                            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                          />
                          <YAxis />
                          <Tooltip 
                            labelFormatter={(value) => new Date(value).toLocaleString()}
                            formatter={(value, name) => [`${value}%`, name === 'cpuUsage' ? 'CPU' : 'Memory']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="cpuUsage" 
                            stroke="#f59e0b" 
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="memoryUsage" 
                            stroke="#8b5cf6" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Error Rate & Instances</CardTitle>
                    <CardDescription>Error rate and active instances</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={deploymentMetrics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="timestamp" 
                            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                          />
                          <YAxis />
                          <Tooltip 
                            labelFormatter={(value) => new Date(value).toLocaleString()}
                            formatter={(value, name) => [
                              name === 'errorRate' ? `${value}%` : value, 
                              name === 'errorRate' ? 'Error Rate' : 'Active Instances'
                            ]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="errorRate" 
                            stroke="#ef4444" 
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="activeInstances" 
                            stroke="#06b6d4" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No metrics found</p>
                  <p className="text-sm text-muted-foreground">
                    This deployment doesn't have any metrics yet
                  </p>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Deployment Logs</h3>
              <p className="text-sm text-muted-foreground">
                {selectedDeploymentForLogs 
                  ? `Viewing logs for deployment ${selectedDeploymentForLogs.slice(-8)}`
                  : 'Select a deployment to view its logs'
                }
              </p>
            </div>
            {selectedDeploymentForLogs && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedDeploymentForLogs(null)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Selection
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const logs = deploymentLogs || [];
                    const logText = logs.map(log => 
                      `[${new Date(log.timestamp).toISOString()}] ${log.level.toUpperCase()}: ${log.message}`
                    ).join('\n');
                    const blob = new Blob([logText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `deployment-logs-${selectedDeploymentForLogs}.txt`;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>

          {!selectedDeploymentForLogs ? (
            <Card>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No deployment selected</p>
                  <p className="text-sm text-muted-foreground">
                    Click "Logs" on a deployment card to view its logs
                  </p>
                </div>
              </div>
            </Card>
          ) : logsLoading ? (
            <Card>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground mb-4 animate-spin" />
                  <p className="text-muted-foreground">Loading logs...</p>
                </div>
              </div>
            </Card>
          ) : deploymentLogs && deploymentLogs.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Deployment Logs</CardTitle>
                <CardDescription>
                  Real-time logs for deployment {selectedDeploymentForLogs.slice(-8)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Info</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span>Warning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                      <span>Error</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg">
                    <div className="max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Level</TableHead>
                            <TableHead className="w-32">Timestamp</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead className="w-20">Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {deploymentLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell>
                                <div className={`flex items-center gap-2 ${getLogLevelColor(log.level)}`}>
                                  {getLogLevelIcon(log.level)}
                                  <span className="text-xs font-medium uppercase">
                                    {log.level}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(log.timestamp).toLocaleString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{log.message}</div>
                                {log.details && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {Object.entries(log.details).map(([key, value]) => (
                                      <div key={key}>
                                        <span className="font-medium">{key}:</span> {String(value)}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const details = JSON.stringify(log.details, null, 2);
                                    alert(details);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No logs found</p>
                  <p className="text-sm text-muted-foreground">
                    This deployment doesn't have any logs yet
                  </p>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Deployment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Deployment</DialogTitle>
            <DialogDescription>
              Deploy a model to a specific environment with custom configuration
            </DialogDescription>
          </DialogHeader>
          {/* Dialog content would be the same as the create tab */}
        </DialogContent>
      </Dialog>
    </div>
  );
};
