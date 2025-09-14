import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
}

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  color = 'primary'
}: MetricCardProps) => {
  const colorClasses = {
    primary: 'from-primary/10 to-primary/5 border-primary/20',
    secondary: 'from-secondary/10 to-secondary/5 border-secondary/20',
    success: 'from-success/10 to-success/5 border-success/20',
    warning: 'from-warning/10 to-warning/5 border-warning/20',
  };

  const iconColorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
  };

  return (
    <Card className={cn(
      "p-6 bg-gradient-to-br border transition-all duration-300 hover:shadow-lg hover:scale-105 animate-slide-up",
      colorClasses[color]
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <div className="flex items-center gap-1">
              <span className={cn(
                "text-xs font-medium",
                trend === 'up' ? 'text-success' : 
                trend === 'down' ? 'text-destructive' : 
                'text-muted-foreground'
              )}>
                {change}
              </span>
              <span className="text-xs text-muted-foreground">vs last week</span>
            </div>
          </div>
        </div>
        <div className={cn(
          "p-3 rounded-lg bg-background/50",
          iconColorClasses[color]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};