import { Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const insights = [
  {
    id: 1,
    type: 'prediction',
    title: 'Revenue Forecast',
    description: 'Based on current trends, revenue is predicted to increase by 23% next quarter.',
    confidence: 94,
    icon: TrendingUp,
    color: 'success',
  },
  {
    id: 2,
    type: 'anomaly',
    title: 'User Behavior Anomaly',
    description: 'Detected unusual spike in mobile app usage during late hours.',
    confidence: 87,
    icon: AlertTriangle,
    color: 'warning',
  },
  {
    id: 3,
    type: 'optimization',
    title: 'Performance Optimization',
    description: 'ML model suggests reducing API calls by 15% for better efficiency.',
    confidence: 91,
    icon: CheckCircle,
    color: 'primary',
  },
];

export const AIInsightsPanel = () => {
  return (
    <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-secondary/20">
          <Brain className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
          <p className="text-sm text-muted-foreground">Machine learning predictions and recommendations</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div 
              key={insight.id}
              className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-secondary/50 transition-all duration-200 animate-fade-in"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  insight.color === 'success' ? 'bg-success/20 text-success' :
                  insight.color === 'warning' ? 'bg-warning/20 text-warning' :
                  'bg-primary/20 text-primary'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};