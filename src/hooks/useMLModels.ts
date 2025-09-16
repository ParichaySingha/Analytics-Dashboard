import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mlModelService } from '@/services/mlModelService';
import { MLModel, CreateModelRequest, UpdateModelRequest, ModelTrainingRequest, ModelPredictionRequest, ModelPrediction, ModelDeployment, ModelMetrics } from '@/types/mlModels';

// Query keys
export const mlModelKeys = {
  all: ['mlModels'] as const,
  lists: () => [...mlModelKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...mlModelKeys.lists(), { filters }] as const,
  details: () => [...mlModelKeys.all, 'detail'] as const,
  detail: (id: string) => [...mlModelKeys.details(), id] as const,
  metrics: (id: string, days: number) => [...mlModelKeys.detail(id), 'metrics', days] as const,
  search: (query: string) => [...mlModelKeys.all, 'search', query] as const,
};

// Custom hook for ML models
export const useMLModels = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: mlModelKeys.list(filters || {}),
    queryFn: () => mlModelService.getModels(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for single model
export const useMLModel = (id: string) => {
  return useQuery({
    queryKey: mlModelKeys.detail(id),
    queryFn: () => mlModelService.getModelById(id),
    enabled: !!id,
  });
};

// Hook for model metrics
export const useMLModelMetrics = (id: string, days: number = 7) => {
  return useQuery({
    queryKey: mlModelKeys.metrics(id, days),
    queryFn: () => mlModelService.getModelMetrics(id, days),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for searching models
export const useMLModelSearch = (query: string) => {
  return useQuery({
    queryKey: mlModelKeys.search(query),
    queryFn: () => mlModelService.searchModels(query),
    enabled: query.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Hook for creating models
export const useCreateMLModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: CreateModelRequest) => mlModelService.createModel(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mlModelKeys.lists() });
    },
  });
};

// Hook for updating models
export const useUpdateMLModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateModelRequest }) => 
      mlModelService.updateModel(id, request),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: mlModelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: mlModelKeys.detail(variables.id) });
    },
  });
};

// Hook for deleting models
export const useDeleteMLModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => mlModelService.deleteModel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mlModelKeys.lists() });
    },
  });
};

// Hook for training models
export const useTrainMLModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: ModelTrainingRequest) => mlModelService.startTraining(request),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: mlModelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: mlModelKeys.detail(variables.modelId) });
    },
  });
};

// Hook for toggling model status
export const useToggleMLModelStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => mlModelService.toggleModelStatus(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: mlModelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: mlModelKeys.detail(id) });
    },
  });
};

// Hook for deploying models
export const useDeployMLModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => mlModelService.deployModel(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: mlModelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: mlModelKeys.detail(id) });
    },
  });
};

// Hook for making predictions
export const useMLModelPrediction = () => {
  return useMutation({
    mutationFn: (request: ModelPredictionRequest) => mlModelService.makePrediction(request),
  });
};

// Hook for real-time model status updates
export const useMLModelStatus = () => {
  const [statusUpdates, setStatusUpdates] = useState<Record<string, ModelStatus>>({});
  
  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStatusUpdates(prev => {
        const updates = { ...prev };
        // Randomly update some model statuses
        if (Math.random() > 0.7) {
          const modelId = Math.floor(Math.random() * 4) + 1;
          const statuses: ModelStatus[] = ['Active', 'Training', 'Paused'];
          updates[modelId.toString()] = statuses[Math.floor(Math.random() * statuses.length)];
        }
        return updates;
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return statusUpdates;
};

// Hook for model statistics
export const useMLModelStats = () => {
  const { data: models } = useMLModels();
  
  const stats = models ? {
    total: models.length,
    active: models.filter(m => m.status === 'Active').length,
    training: models.filter(m => m.status === 'Training').length,
    paused: models.filter(m => m.status === 'Paused').length,
    deployed: models.filter(m => m.status === 'Deployed').length,
    averageAccuracy: models.reduce((acc, model) => acc + model.accuracy, 0) / models.length,
    totalTrainingData: models.reduce((acc, model) => acc + model.trainingDataSize, 0),
  } : null;

  return { stats, isLoading: !models };
};
