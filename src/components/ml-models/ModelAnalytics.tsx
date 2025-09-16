import { useMLModelMetrics } from '@/hooks/useMLModels';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock, Target } from 'lucide-react';

interface ModelAnalyticsProps {
  modelId: string;
  modelName: string;
}

export const ModelAnalytics = ({ modelId, modelName }: ModelAnalyticsProps) => {
  const { data: metrics, isLoading } = useMLModelMetrics(modelId, 30);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-2 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics || metrics.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No metrics data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestMetrics = metrics[metrics.length - 1];
  const previousMetrics = metrics[metrics.length - 2];

  const calculateTrend = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const accuracyTrend = calculateTrend(latestMetrics.accuracy, previousMetrics?.accuracy || 0);
  const lossTrend = calculateTrend(latestMetrics.loss, previousMetrics?.loss || 0);
  const f1Trend = calculateTrend(latestMetrics.f1Score, previousMetrics?.f1Score || 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = metrics.map(metric => ({
    date: formatDate(metric.timestamp),
    accuracy: metric.accuracy,
    loss: metric.loss,
    f1Score: metric.f1Score,
    precision: metric.precision,
    recall: metric.recall,
    trainingTime: metric.trainingTime,
    inferenceTime: metric.inferenceTime,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Model Analytics</h3>
          <p className="text-sm text-muted-foreground">{modelName}</p>
        </div>
        <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
          Last 30 days
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{latestMetrics.accuracy.toFixed(1)}%</span>
                <div className="flex items-center gap-1">
                  {accuracyTrend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={`text-sm ${accuracyTrend > 0 ? 'text-success' : 'text-destructive'}`}>
                    {Math.abs(accuracyTrend).toFixed(1)}%
                  </span>
                </div>
              </div>
              <Progress value={latestMetrics.accuracy} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Loss
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{latestMetrics.loss.toFixed(4)}</span>
                <div className="flex items-center gap-1">
                  {lossTrend < 0 ? (
                    <TrendingDown className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-destructive" />
                  )}
                  <span className={`text-sm ${lossTrend < 0 ? 'text-success' : 'text-destructive'}`}>
                    {Math.abs(lossTrend).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Lower is better
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              F1-Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{latestMetrics.f1Score.toFixed(1)}%</span>
                <div className="flex items-center gap-1">
                  {f1Trend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={`text-sm ${f1Trend > 0 ? 'text-success' : 'text-destructive'}`}>
                    {Math.abs(f1Trend).toFixed(1)}%
                  </span>
                </div>
              </div>
              <Progress value={latestMetrics.f1Score} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="inference">Inference</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Model Performance Over Time</CardTitle>
              <CardDescription>
                Track accuracy, precision, recall, and F1-score trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Accuracy"
                    />
                    <Line
                      type="monotone"
                      dataKey="precision"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Precision"
                    />
                    <Line
                      type="monotone"
                      dataKey="recall"
                      stroke="#ffc658"
                      strokeWidth={2}
                      name="Recall"
                    />
                    <Line
                      type="monotone"
                      dataKey="f1Score"
                      stroke="#ff7300"
                      strokeWidth={2}
                      name="F1-Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Training Loss</CardTitle>
                <CardDescription>
                  Model loss during training iterations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="loss"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Training Time</CardTitle>
                <CardDescription>
                  Time spent on training per day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="trainingTime" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inference" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Inference Performance</CardTitle>
              <CardDescription>
                Model inference time and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Inference Time</span>
                    <span className="text-lg font-semibold flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {latestMetrics.inferenceTime.toFixed(2)}ms
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: {formatDate(latestMetrics.timestamp)}
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="inferenceTime"
                        stroke="#8884d8"
                        strokeWidth={2}
                        name="Inference Time (ms)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
