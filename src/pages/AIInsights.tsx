import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Zap, Target } from 'lucide-react';

const insights = [
  {
    category: 'Revenue Prediction',
    confidence: 94,
    impact: 'High',
    description: 'Revenue forecast shows 23% increase next quarter based on current trends and seasonal patterns.',
    recommendation: 'Increase inventory and marketing budget by 15%',
    icon: TrendingUp,
    color: 'success'
  },
  {
    category: 'User Behavior',
    confidence: 87,
    impact: 'Medium',
    description: 'Unusual spike in mobile app usage during late hours detected in user segments 18-24.',
    recommendation: 'Consider launching targeted late-night campaigns',
    icon: AlertTriangle,
    color: 'warning'
  },
  {
    category: 'Performance Optimization',
    confidence: 91,
    impact: 'High',
    description: 'API response times can be improved by 35% with query optimization and caching strategies.',
    recommendation: 'Implement Redis caching for frequently accessed data',
    icon: Zap,
    color: 'primary'
  }
];

const aiModels = [
  { name: 'Revenue Predictor', accuracy: '94.2%', status: 'active', lastTrained: '2 days ago' },
  { name: 'User Churn Model', accuracy: '87.8%', status: 'active', lastTrained: '1 week ago' },
  { name: 'Demand Forecasting', accuracy: '91.5%', status: 'training', lastTrained: '3 hours ago' },
  { name: 'Anomaly Detection', accuracy: '89.3%', status: 'active', lastTrained: '5 days ago' }
];

const AIInsightsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground mb-2">AI Insights</h1>
          <p className="text-muted-foreground">Machine learning predictions and intelligent recommendations</p>
        </div>

        {/* AI Status */}
        <Card className="p-6 bg-gradient-to-r from-secondary/10 to-primary/10 border-secondary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/20">
                <Brain className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">AI Engine Status</h3>
                <p className="text-sm text-muted-foreground">4 models active • Processing 847 data points/min</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
              All Systems Operational
            </Badge>
          </div>
        </Card>

        {/* Main Insights Panel */}
        <AIInsightsPanel />

        {/* Detailed Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Detailed AI Analysis</h3>
          <div className="space-y-6">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <Card 
                  key={insight.category} 
                  className="p-6 bg-gradient-to-br from-card to-muted/20 hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className={`p-3 rounded-lg shrink-0 ${
                      insight.color === 'success' ? 'bg-success/20 text-success' :
                      insight.color === 'warning' ? 'bg-warning/20 text-warning' :
                      'bg-primary/20 text-primary'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h4 className="text-lg font-semibold text-foreground">{insight.category}</h4>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {insight.confidence}% confidence
                          </Badge>
                          <Badge variant={insight.impact === 'High' ? 'destructive' : insight.impact === 'Medium' ? 'default' : 'secondary'} className="text-xs">
                            {insight.impact} Impact
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground">{insight.description}</p>
                      
                      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Recommendation</p>
                            <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>

        {/* AI Models Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Active AI Models</h3>
            <Button variant="outline" size="sm">
              <Brain className="h-4 w-4 mr-2" />
              Manage Models
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiModels.map((model, index) => (
              <Card 
                key={model.name} 
                className="p-4 hover:shadow-md transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{model.name}</h4>
                  <Badge variant={model.status === 'active' ? 'secondary' : 'outline'} className={
                    model.status === 'active' ? 'bg-success/20 text-success border-success/30' : 
                    'bg-warning/20 text-warning border-warning/30'
                  }>
                    {model.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className="font-medium text-foreground">{model.accuracy}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Trained</span>
                    <span className="text-foreground">{model.lastTrained}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIInsightsPage;