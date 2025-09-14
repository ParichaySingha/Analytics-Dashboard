import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { TrendingUp, Calendar, Target, AlertCircle, CheckCircle } from 'lucide-react';

const predictions = [
  {
    id: 1,
    title: 'Q2 Revenue Forecast',
    prediction: '$847,500',
    confidence: 94,
    timeframe: 'Next 3 months',
    trend: 'upward',
    change: '+23%',
    status: 'high_confidence',
    description: 'Revenue expected to grow significantly based on current user acquisition trends'
  },
  {
    id: 2,
    title: 'User Churn Risk',
    prediction: '12.3%',
    confidence: 87,
    timeframe: 'Next 30 days',
    trend: 'downward',
    change: '-2.1%',
    status: 'medium_confidence',
    description: 'Slight improvement in retention rates due to recent product updates'
  },
  {
    id: 3,
    title: 'Server Load Peak',
    prediction: '85% capacity',
    confidence: 91,
    timeframe: 'Next week',
    trend: 'upward',
    change: '+15%',
    status: 'high_confidence',
    description: 'Expected traffic surge during product launch requires scaling preparation'
  },
  {
    id: 4,
    title: 'Customer Acquisition',
    prediction: '2,847 new users',
    confidence: 78,
    timeframe: 'This month',
    trend: 'upward',
    change: '+8%',
    status: 'medium_confidence',
    description: 'Marketing campaigns showing positive impact on user acquisition'
  }
];

const forecastData = [
  { month: 'Jan', actual: 65000, predicted: 64200 },
  { month: 'Feb', actual: 72000, predicted: 71800 },
  { month: 'Mar', actual: 68000, predicted: 69200 },
  { month: 'Apr', actual: 78000, predicted: 77500 },
  { month: 'May', actual: null, predicted: 82000 },
  { month: 'Jun', actual: null, predicted: 87000 },
  { month: 'Jul', actual: null, predicted: 91000 },
];

const PredictionsPage = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high_confidence': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'medium_confidence': return <AlertCircle className="h-4 w-4 text-warning" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high_confidence': return 'bg-success/20 text-success border-success/30';
      case 'medium_confidence': return 'bg-warning/20 text-warning border-warning/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Predictions</h1>
              <p className="text-muted-foreground">AI-powered forecasts and predictive analytics</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Analysis
              </Button>
              <Button size="sm">
                <Target className="h-4 w-4 mr-2" />
                New Prediction
              </Button>
            </div>
          </div>
        </div>

        {/* Prediction Accuracy Overview */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Prediction Engine</h3>
                <p className="text-sm text-muted-foreground">Average accuracy: 89.2% • 4 active models</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
              High Performance
            </Badge>
          </div>
        </Card>

        {/* Forecast Chart */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Revenue Forecast vs Actual</h3>
            <p className="text-sm text-muted-foreground">Predicted revenue compared to actual performance</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#actualGradient)"
                  name="Actual Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Predictions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {predictions.map((prediction, index) => (
            <Card 
              key={prediction.id} 
              className="p-6 hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{prediction.title}</h3>
                      {getStatusIcon(prediction.status)}
                    </div>
                    <Badge variant="outline" className={getStatusColor(prediction.status)}>
                      {prediction.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{prediction.prediction}</p>
                    <p className={`text-sm font-medium ${
                      prediction.trend === 'upward' ? 'text-success' : 'text-destructive'
                    }`}>
                      {prediction.change}
                    </p>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prediction Confidence</span>
                    <span className="font-medium text-foreground">{prediction.confidence}%</span>
                  </div>
                  <Progress value={prediction.confidence} className="h-2" />
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground">{prediction.description}</p>

                {/* Footer */}
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{prediction.timeframe}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Model Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Prediction Model Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">89.2%</div>
              <p className="text-sm text-muted-foreground">Average Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">94.7%</div>
              <p className="text-sm text-muted-foreground">Best Model</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">2.3 days</div>
              <p className="text-sm text-muted-foreground">Avg Forecast Lead</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PredictionsPage;