import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Play, Pause, Settings, BarChart3, Brain } from 'lucide-react';

const models = [
  {
    id: 1,
    name: 'Revenue Prediction Model v2.1',
    type: 'Regression',
    status: 'Active',
    accuracy: 94.2,
    lastTrained: '2 days ago',
    description: 'Predicts monthly revenue based on user behavior and market trends',
    features: ['User engagement', 'Seasonal patterns', 'Market data'],
    performance: {
      precision: 92.1,
      recall: 89.7,
      f1Score: 90.9
    }
  },
  {
    id: 2,
    name: 'Customer Churn Predictor',
    type: 'Classification',
    status: 'Training',
    accuracy: 87.8,
    lastTrained: '6 hours ago',
    description: 'Identifies customers likely to churn within next 30 days',
    features: ['Usage patterns', 'Support tickets', 'Payment history'],
    performance: {
      precision: 85.2,
      recall: 88.1,
      f1Score: 86.6
    }
  },
  {
    id: 3,
    name: 'Demand Forecasting Engine',
    type: 'Time Series',
    status: 'Active',
    accuracy: 91.5,
    lastTrained: '1 week ago',
    description: 'Forecasts product demand for inventory optimization',
    features: ['Historical sales', 'Seasonality', 'External factors'],
    performance: {
      precision: 90.3,
      recall: 92.1,
      f1Score: 91.2
    }
  },
  {
    id: 4,
    name: 'Anomaly Detection System',
    type: 'Unsupervised',
    status: 'Active',
    accuracy: 89.3,
    lastTrained: '3 days ago',
    description: 'Detects unusual patterns in user behavior and system metrics',
    features: ['Behavioral patterns', 'System metrics', 'Transaction data'],
    performance: {
      precision: 88.7,
      recall: 87.9,
      f1Score: 88.3
    }
  }
];

const MLModelsPage = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success/20 text-success border-success/30';
      case 'Training': return 'bg-warning/20 text-warning border-warning/30';
      case 'Paused': return 'bg-muted/20 text-muted-foreground border-muted/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Regression': return 'bg-primary/20 text-primary border-primary/30';
      case 'Classification': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'Time Series': return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
      case 'Unsupervised': return 'bg-chart-4/20 text-chart-4 border-chart-4/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">ML Models</h1>
              <p className="text-muted-foreground">Manage and monitor machine learning models</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Model Analytics
              </Button>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Deploy Model
              </Button>
            </div>
          </div>
        </div>

        {/* ML Pipeline Status */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">ML Pipeline Status</h3>
                <p className="text-sm text-muted-foreground">4 models active • 1 training • Last update: 2 min ago</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                Pipeline Healthy
              </Badge>
            </div>
          </div>
        </Card>

        {/* Models Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {models.map((model, index) => (
            <Card 
              key={model.id} 
              className="p-6 hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{model.name}</h3>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className={getStatusColor(model.status)}>
                        {model.status}
                      </Badge>
                      <Badge variant="outline" className={getTypeColor(model.type)}>
                        {model.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {model.status === 'Active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground">{model.description}</p>

                {/* Accuracy */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Model Accuracy</span>
                    <span className="font-medium text-foreground">{model.accuracy}%</span>
                  </div>
                  <Progress value={model.accuracy} className="h-2" />
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Precision</p>
                    <p className="text-sm font-semibold text-foreground">{model.performance.precision}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Recall</p>
                    <p className="text-sm font-semibold text-foreground">{model.performance.recall}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">F1-Score</p>
                    <p className="text-sm font-semibold text-foreground">{model.performance.f1Score}%</p>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Key Features</p>
                  <div className="flex flex-wrap gap-1">
                    {model.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Last trained: {model.lastTrained}</span>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MLModelsPage;