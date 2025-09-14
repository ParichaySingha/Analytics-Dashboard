import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, Filter, Plus } from 'lucide-react';

const reports = [
  {
    id: 1,
    name: 'Monthly Revenue Report',
    description: 'Comprehensive revenue analysis for the current month',
    status: 'completed',
    lastGenerated: '2 hours ago',
    format: 'PDF',
    size: '2.4 MB'
  },
  {
    id: 2,
    name: 'User Engagement Analysis',
    description: 'Detailed user behavior and engagement metrics',
    status: 'processing',
    lastGenerated: '1 day ago',
    format: 'Excel',
    size: '1.8 MB'
  },
  {
    id: 3,
    name: 'Performance Metrics',
    description: 'System performance and optimization insights',
    status: 'completed',
    lastGenerated: '3 hours ago',
    format: 'PDF',
    size: '3.1 MB'
  },
  {
    id: 4,
    name: 'Marketing Campaign ROI',
    description: 'Return on investment analysis for marketing campaigns',
    status: 'scheduled',
    lastGenerated: '1 week ago',
    format: 'Excel',
    size: '2.7 MB'
  }
];

const templates = [
  { name: 'Sales Report', description: 'Track sales performance and trends' },
  { name: 'User Activity', description: 'Monitor user engagement patterns' },
  { name: 'Revenue Analysis', description: 'Analyze revenue streams and growth' },
  { name: 'Custom Metrics', description: 'Create your own custom report' }
];

const CustomReportsPage = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/20 text-success border-success/30';
      case 'processing': return 'bg-warning/20 text-warning border-warning/30';
      case 'scheduled': return 'bg-primary/20 text-primary border-primary/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Custom Reports</h1>
              <p className="text-muted-foreground">Generate and manage custom analytics reports</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>
        </div>

        {/* Report Templates */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Report Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template, index) => (
              <Card 
                key={template.name} 
                className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-dashed border-2 hover:border-primary/50 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Generated Reports */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Generated Reports</h3>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
          
          <div className="space-y-4">
            {reports.map((report, index) => (
              <Card 
                key={report.id} 
                className="p-4 hover:shadow-md transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">{report.name}</h4>
                      <Badge variant="outline" className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>Last generated: {report.lastGenerated}</span>
                      <span>Format: {report.format}</span>
                      <span>Size: {report.size}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={report.status === 'processing'}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
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

export default CustomReportsPage;