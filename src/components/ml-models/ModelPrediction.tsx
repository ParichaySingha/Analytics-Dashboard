import React, { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Brain,
  TrendingUp,
  AlertTriangle,
  Download,
  Share2,
  Copy,
  RefreshCw,
  BarChart3,
  Target,
  Activity,
  FileText,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useMLModelPrediction } from '@/hooks/useMLModels';
import { MLModel } from '@/types/mlModels';

const predictionSchema = z.object({
  modelId: z.string().min(1, 'Model is required'),
  input: z.record(z.any()),
});

type PredictionFormData = z.infer<typeof predictionSchema>;

interface ModelPredictionProps {
  models: MLModel[];
}

interface PredictionResult {
  id: string;
  modelId: string;
  modelName: string;
  input: Record<string, any>;
  output: Record<string, any>;
  confidence: number;
  timestamp: string;
  status: 'success' | 'error';
  error?: string;
  processingTime: number;
}


export const ModelPrediction = ({ models }: ModelPredictionProps) => {
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionResult[]>([]);
  const [activeTab, setActiveTab] = useState('single');
  
  const predictionMutation = useMLModelPrediction();

  const form = useForm<PredictionFormData>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      modelId: '',
      input: {},
    },
  });

  const watchedModelId = form.watch('modelId');

  // Update selected model when form changes
  useEffect(() => {
    if (watchedModelId) {
      const model = models.find(m => m.id === watchedModelId);
      setSelectedModel(model || null);
    }
  }, [watchedModelId, models]);

  // Load prediction history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('ml-prediction-history');
    if (savedHistory) {
      try {
        setPredictionHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load prediction history:', error);
      }
    }

  }, []);

  // Save prediction history to localStorage
  const savePredictionHistory = (newPrediction: PredictionResult) => {
    const updatedHistory = [newPrediction, ...predictionHistory.slice(0, 49)]; // Keep last 50
    setPredictionHistory(updatedHistory);
    localStorage.setItem('ml-prediction-history', JSON.stringify(updatedHistory));
  };


  const onSubmit = async (data: PredictionFormData) => {
    if (!selectedModel) return;

    const startTime = Date.now();
    try {
      const result = await predictionMutation.mutateAsync(data);
      const processingTime = Date.now() - startTime;
      
      const predictionResult: PredictionResult = {
        id: result.id,
        modelId: result.modelId,
        modelName: selectedModel.name,
        input: result.input,
        output: result.output,
        confidence: result.confidence,
        timestamp: result.timestamp,
        status: result.status,
        error: result.error,
        processingTime,
      };

      setPredictionResult(predictionResult);
      savePredictionHistory(predictionResult);
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };


  const getModelTypeColor = (type: string) => {
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

  const renderInputFields = () => {
    if (!selectedModel) return null;

    return selectedModel.features.map((feature, index) => (
      <FormField
        key={feature}
        control={form.control}
        name={`input.${feature.toLowerCase().replace(/\s+/g, '_')}`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{feature}</FormLabel>
            <FormControl>
              <Input
                placeholder={`Enter ${feature.toLowerCase()}`}
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  // Try to parse as number if it looks like a number
                  const numValue = parseFloat(value);
                  field.onChange(isNaN(numValue) ? value : numValue);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ));
  };

  const renderPredictionResult = () => {
    if (!predictionResult) return null;

    const isSuccess = predictionResult.status === 'success';
    const confidence = predictionResult.confidence * 100;

    return (
      <Card className={isSuccess ? 'border-success/30' : 'border-destructive/30'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isSuccess ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            Prediction Result
          </CardTitle>
          <CardDescription>
            {isSuccess ? 'Prediction completed successfully' : 'Prediction failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSuccess ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Prediction</h4>
                  <div className="text-2xl font-bold text-primary">
                    {typeof predictionResult.output.prediction === 'number' 
                      ? predictionResult.output.prediction.toFixed(2)
                      : predictionResult.output.prediction
                    }
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Confidence</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{confidence.toFixed(1)}%</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Processing Time</h4>
                  <div className="text-lg font-semibold text-muted-foreground">
                    {predictionResult.processingTime}ms
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Input Data</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(predictionResult.input, null, 2)}
                    </pre>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Output Data</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(predictionResult.output, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(predictionResult.output, null, 2))}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Result
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const dataStr = JSON.stringify(predictionResult, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `prediction-${predictionResult.id}.json`;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                Predicted at: {new Date(predictionResult.timestamp).toLocaleString()}
              </div>
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {predictionResult.error || 'An unknown error occurred during prediction'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Model Predictions</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="single">Single Prediction</TabsTrigger>
          <TabsTrigger value="history">Prediction History</TabsTrigger>
          <TabsTrigger value="analytics">Prediction Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Select Model & Input Data</CardTitle>
              <CardDescription>
                Choose a model and provide input data to make predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                              .filter(model => model.status === 'Active' || model.status === 'Deployed')
                              .map((model) => (
                                <SelectItem key={model.id} value={model.id}>
                                  <div className="flex items-center gap-2">
                                    <span>{model.name}</span>
                                    <Badge variant="outline" className={getModelTypeColor(model.type)}>
                                      {model.type}
                                    </Badge>
                                    <Badge variant="outline">
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

                  {selectedModel && (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">{selectedModel.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {selectedModel.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getModelTypeColor(selectedModel.type)}>
                            {selectedModel.type}
                          </Badge>
                          <Badge variant="outline">
                            {selectedModel.accuracy}% accuracy
                          </Badge>
                          <Badge variant="outline">
                            {selectedModel.features.length} features
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInputFields()}
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={predictionMutation.isPending || !selectedModel}
                    className="w-full"
                  >
                    {predictionMutation.isPending ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Making Prediction...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Make Prediction
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {renderPredictionResult()}
        </TabsContent>


        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Predictions</CardTitle>
              <CardDescription>
                View your recent model predictions and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictionHistory.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No predictions made yet</p>
                  <p className="text-sm text-muted-foreground">
                    Make your first prediction using the "Single Prediction" tab
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {predictionHistory.map((prediction, index) => (
                    <Card key={prediction.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {prediction.status === 'success' ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <XCircle className="h-4 w-4 text-destructive" />
                            )}
                            <span className="font-medium">
                              {prediction.modelName}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              #{predictionHistory.length - index}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(prediction.timestamp).toLocaleString()}
                          </span>
                        </div>
                        
                        {prediction.status === 'success' ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Prediction</p>
                              <p className="font-semibold">
                                {typeof prediction.output.prediction === 'number' 
                                  ? prediction.output.prediction.toFixed(2)
                                  : prediction.output.prediction
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Confidence</p>
                              <p className="font-semibold">
                                {(prediction.confidence * 100).toFixed(1)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Processing Time</p>
                              <p className="font-semibold">
                                {prediction.processingTime}ms
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-destructive">
                            Error: {prediction.error || 'Unknown error'}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Prediction Analytics</CardTitle>
              <CardDescription>
                Insights and statistics about your predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictionHistory.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No prediction data available</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Total Predictions</span>
                        </div>
                        <p className="text-2xl font-bold">{predictionHistory.length}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="text-sm text-muted-foreground">Success Rate</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {((predictionHistory.filter(p => p.status === 'success').length / predictionHistory.length) * 100).toFixed(1)}%
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-chart-3" />
                          <span className="text-sm text-muted-foreground">Avg Confidence</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {(predictionHistory
                            .filter(p => p.status === 'success')
                            .reduce((acc, p) => acc + p.confidence, 0) / 
                            predictionHistory.filter(p => p.status === 'success').length * 100).toFixed(1)}%
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-chart-4" />
                          <span className="text-sm text-muted-foreground">Avg Processing Time</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {Math.round(predictionHistory
                            .filter(p => p.status === 'success')
                            .reduce((acc, p) => acc + p.processingTime, 0) / 
                            predictionHistory.filter(p => p.status === 'success').length)}ms
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Model Usage Distribution</h4>
                    <div className="space-y-2">
                      {Object.entries(
                        predictionHistory.reduce((acc, p) => {
                          acc[p.modelName] = (acc[p.modelName] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([modelName, count]) => (
                        <div key={modelName} className="flex items-center justify-between">
                          <span className="text-sm">{modelName}</span>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={(count / predictionHistory.length) * 100} 
                              className="w-24 h-2" 
                            />
                            <span className="text-sm text-muted-foreground">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};