import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Play, 
  Pause, 
  Settings, 
  BarChart3, 
  Clock, 
  Database, 
  Zap,
  Eye,
  Download,
  Share2
} from 'lucide-react';
import { useTrainMLModel, useToggleMLModelStatus, useDeployMLModel } from '@/hooks/useMLModels';
import { MLModel } from '@/types/mlModels';

const trainingSchema = z.object({
  epochs: z.number().min(1).max(1000),
  batchSize: z.number().min(1).max(1024),
  learningRate: z.number().min(0.0001).max(1),
  validationSplit: z.number().min(0.1).max(0.9),
});

type TrainingFormData = z.infer<typeof trainingSchema>;

interface ModelDetailsDialogProps {
  children?: React.ReactNode;
  model: MLModel;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ModelDetailsDialog = ({ children, model, open: controlledOpen, onOpenChange }: ModelDetailsDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  
  const trainModelMutation = useTrainMLModel();
  const toggleStatusMutation = useToggleMLModelStatus();
  const deployModelMutation = useDeployMLModel();

  const trainingForm = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      epochs: 100,
      batchSize: 32,
      learningRate: 0.001,
      validationSplit: 0.2,
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success/20 text-success border-success/30';
      case 'Training': return 'bg-warning/20 text-warning border-warning/30';
      case 'Paused': return 'bg-muted/20 text-muted-foreground border-muted/30';
      case 'Deployed': return 'bg-primary/20 text-primary border-primary/30';
      case 'Failed': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Regression': return 'bg-primary/20 text-primary border-primary/30';
      case 'Classification': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'Time Series': return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
      case 'Unsupervised': return 'bg-chart-4/20 text-chart-4 border-chart-4/30';
      case 'Deep Learning': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'NLP': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'Computer Vision': return 'bg-green-500/20 text-green-500 border-green-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const handleToggleStatus = async () => {
    try {
      await toggleStatusMutation.mutateAsync(model.id);
    } catch (error) {
      console.error('Failed to toggle model status:', error);
    }
  };

  const handleDeploy = async () => {
    try {
      await deployModelMutation.mutateAsync(model.id);
    } catch (error) {
      console.error('Failed to deploy model:', error);
    }
  };

  const handleStartTraining = async (data: TrainingFormData) => {
    try {
      await trainModelMutation.mutateAsync({
        modelId: model.id,
        ...data,
      });
    } catch (error) {
      console.error('Failed to start training:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {model.name}
          </DialogTitle>
          <DialogDescription>
            Detailed view and management options for your ML model.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Model Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <Badge variant="outline" className={getTypeColor(model.type)}>
                      {model.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="outline" className={getStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <span className="text-sm font-medium">{model.version}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm font-medium">
                      {new Date(model.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Training Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Data Size</span>
                    <span className="text-sm font-medium">
                      {model.trainingDataSize.toLocaleString()} records
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Training Time</span>
                    <span className="text-sm font-medium">{model.trainingDuration} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Trained</span>
                    <span className="text-sm font-medium">{model.lastTrained}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Features</span>
                    <span className="text-sm font-medium">{model.features.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{model.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {model.features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {model.tags && model.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {model.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="training" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Training Configuration</CardTitle>
                <CardDescription>
                  Configure training parameters for your model.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...trainingForm}>
                  <form onSubmit={trainingForm.handleSubmit(handleStartTraining)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={trainingForm.control}
                        name="epochs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Epochs</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="1000"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={trainingForm.control}
                        name="batchSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Batch Size</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="1024"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={trainingForm.control}
                        name="learningRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Learning Rate</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.0001"
                                min="0.0001"
                                max="1"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={trainingForm.control}
                        name="validationSplit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Validation Split</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                min="0.1"
                                max="0.9"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={trainModelMutation.isPending || model.status === 'Training'}
                      >
                        {trainModelMutation.isPending ? 'Starting...' : 'Start Training'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleToggleStatus}
                        disabled={toggleStatusMutation.isPending}
                      >
                        {model.status === 'Active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Model Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-medium">{model.accuracy}%</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Precision</span>
                    <span className="text-sm font-medium">{model.performance.precision}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Recall</span>
                    <span className="text-sm font-medium">{model.performance.recall}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">F1-Score</span>
                    <span className="text-sm font-medium">{model.performance.f1Score}%</span>
                  </div>
                  {model.performance.auc && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">AUC</span>
                      <span className="text-sm font-medium">{model.performance.auc}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Deployment Status</CardTitle>
                <CardDescription>
                  Manage model deployment and API endpoints.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {model.deploymentEndpoint ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Endpoint</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {model.deploymentEndpoint}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                        Deployed
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View API Docs
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Model
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      This model is not deployed yet.
                    </p>
                    <Button
                      onClick={handleDeploy}
                      disabled={deployModelMutation.isPending || model.status !== 'Active'}
                    >
                      {deployModelMutation.isPending ? 'Deploying...' : 'Deploy Model'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
