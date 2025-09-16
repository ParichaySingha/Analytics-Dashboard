import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Play, 
  Pause, 
  Settings, 
  BarChart3, 
  Brain, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMLModels, useMLModelStats, useDeleteMLModel, useToggleMLModelStatus } from '@/hooks/useMLModels';
import { CreateModelDialog } from '@/components/ml-models/CreateModelDialog';
import { EditModelDialog } from '@/components/ml-models/EditModelDialog';
import { ModelDetailsDialog } from '@/components/ml-models/ModelDetailsDialog';
import { ModelAnalytics } from '@/components/ml-models/ModelAnalytics';
import { ModelPrediction } from '@/components/ml-models/ModelPrediction';
import { ModelFilters } from '@/components/ml-models/ModelFilters';
import { DeploymentManagement } from '@/components/ml-models/DeploymentManagement';
import { ModelType, ModelStatus } from '@/types/mlModels';

const MLModelsPage = () => {
  const [activeTab, setActiveTab] = useState('models');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<ModelType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ModelStatus[]>([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data: models, isLoading, error } = useMLModels();
  const { stats } = useMLModelStats();
  const deleteModelMutation = useDeleteMLModel();
  const toggleStatusMutation = useToggleMLModelStatus();

  // Filter and sort models
  const filteredAndSortedModels = useMemo(() => {
    if (!models) return [];

    let filtered = models.filter(model => {
      const matchesSearch = searchQuery === '' || 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(model.type);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(model.status);

      return matchesSearch && matchesType && matchesStatus;
    });

    // Sort models
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'accuracy':
          aValue = a.accuracy;
          bValue = b.accuracy;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'lastTrained':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case 'trainingDataSize':
          aValue = a.trainingDataSize;
          bValue = b.trainingDataSize;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [models, searchQuery, selectedTypes, selectedStatuses, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success/20 text-success border-success/30';
      case 'Training': return 'bg-warning/20 text-warning border-warning/30';
      case 'Paused': return 'bg-muted/20 text-muted-foreground border-muted/30';
      case 'Deployed': return 'bg-primary/20 text-primary border-primary/30';
      case 'Failed': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'Retired': return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
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

  const handleDeleteModel = async (modelId: string) => {
    if (window.confirm('Are you sure you want to delete this model? This action cannot be undone.')) {
      try {
        await deleteModelMutation.mutateAsync(modelId);
      } catch (error) {
        console.error('Failed to delete model:', error);
      }
    }
  };

  const handleToggleStatus = async (modelId: string) => {
    try {
      await toggleStatusMutation.mutateAsync(modelId);
    } catch (error) {
      console.error('Failed to toggle model status:', error);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSortBy('name');
    setSortOrder('asc');
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Failed to load models</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
              <CreateModelDialog>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Model
                </Button>
              </CreateModelDialog>
            </div>
          </div>
        </div>

        {/* ML Pipeline Status */}
        {stats && (
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">ML Pipeline Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.active} active • {stats.training} training • {stats.paused} paused • 
                    Last update: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                  Pipeline Healthy
                </Badge>
                <Badge variant="outline">
                  Avg: {stats.averageAccuracy.toFixed(1)}% accuracy
                </Badge>
              </div>
            </div>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="space-y-6">
            {/* Filters */}
            <ModelFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTypes={selectedTypes}
              onTypesChange={setSelectedTypes}
              selectedStatuses={selectedStatuses}
              onStatusesChange={setSelectedStatuses}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              onClearFilters={clearFilters}
            />

            {/* Models Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="space-y-4">
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-20 bg-muted rounded"></div>
                      <div className="h-2 bg-muted rounded"></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-8 bg-muted rounded"></div>
                        <div className="h-8 bg-muted rounded"></div>
                        <div className="h-8 bg-muted rounded"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredAndSortedModels.length === 0 ? (
              <Card>
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">No models found</p>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery || selectedTypes.length > 0 || selectedStatuses.length > 0
                        ? 'Try adjusting your filters'
                        : 'Create your first ML model to get started'
                      }
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAndSortedModels.map((model, index) => (
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
                            <Badge variant="outline" className="text-xs">
                              v{model.version}
                            </Badge>
                          </div>
                          <div className="flex gap-2 mb-3">
                            <Badge variant="outline" className={getStatusColor(model.status)}>
                              {model.status}
                            </Badge>
                            <Badge variant="outline" className={getTypeColor(model.type)}>
                              {model.type}
                            </Badge>
                            {model.isPublic && (
                              <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500/30">
                                Public
                              </Badge>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <ModelDetailsDialog model={model}>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </ModelDetailsDialog>
                            <EditModelDialog model={model}>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Model
                              </DropdownMenuItem>
                            </EditModelDialog>
                            <DropdownMenuItem onClick={() => handleToggleStatus(model.id)}>
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
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteModel(model.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">{model.description}</p>

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
                          {model.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {model.features.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{model.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">Last trained: {model.lastTrained}</span>
                        <div className="flex gap-1">
                          <ModelDetailsDialog model={model}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </ModelDetailsDialog>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {filteredAndSortedModels.length > 0 ? (
              <div className="space-y-6">
                {filteredAndSortedModels.map((model) => (
                  <Card key={model.id}>
                    <CardContent className="p-6">
                      <ModelAnalytics modelId={model.id} modelName={model.name} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No models available for analytics</p>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <ModelPrediction models={filteredAndSortedModels} />
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <DeploymentManagement models={models || []} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MLModelsPage;