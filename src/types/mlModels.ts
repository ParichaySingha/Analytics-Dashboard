export interface MLModel {
  id: string;
  name: string;
  type: ModelType;
  status: ModelStatus;
  accuracy: number;
  lastTrained: string;
  description: string;
  features: string[];
  performance: ModelPerformance;
  version: string;
  createdAt: string;
  updatedAt: string;
  trainingDataSize: number;
  trainingDuration: number;
  deploymentEndpoint?: string;
  tags: string[];
  createdBy: string;
  isPublic: boolean;
}

export type ModelType = 'Regression' | 'Classification' | 'Time Series' | 'Unsupervised' | 'Deep Learning' | 'NLP' | 'Computer Vision';

export type ModelStatus = 'Active' | 'Training' | 'Paused' | 'Failed' | 'Deployed' | 'Retired';

export interface ModelPerformance {
  precision: number;
  recall: number;
  f1Score: number;
  auc?: number;
  mse?: number;
  mae?: number;
  r2Score?: number;
}

export interface ModelTrainingData {
  modelId: string;
  dataSourceId: string;
  features: string[];
  target: string;
  trainSize: number;
  testSize: number;
  validationSize: number;
}

export interface ModelPrediction {
  id: string;
  modelId: string;
  input: Record<string, any>;
  output: Record<string, any>;
  confidence: number;
  timestamp: string;
  status: 'success' | 'error';
  error?: string;
}

export interface ModelDeployment {
  id: string;
  modelId: string;
  endpoint: string;
  status: 'active' | 'inactive' | 'error';
  createdAt: string;
  lastUsed: string;
  requestCount: number;
  averageResponseTime: number;
}

export interface ModelMetrics {
  modelId: string;
  timestamp: string;
  accuracy: number;
  loss: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingTime: number;
  inferenceTime: number;
}

export interface CreateModelRequest {
  name: string;
  type: ModelType;
  description: string;
  features: string[];
  trainingDataId: string;
  tags: string[];
  isPublic: boolean;
}

export interface UpdateModelRequest {
  name?: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface ModelTrainingRequest {
  modelId: string;
  epochs: number;
  batchSize: number;
  learningRate: number;
  validationSplit: number;
}

export interface ModelPredictionRequest {
  modelId: string;
  input: Record<string, any>;
}
