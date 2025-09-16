import { MLModel, CreateModelRequest, UpdateModelRequest, ModelTrainingRequest, ModelPredictionRequest, ModelPrediction, ModelDeployment, ModelMetrics } from '@/types/mlModels';

// Mock data for development
const mockModels: MLModel[] = [
  {
    id: '1',
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
      f1Score: 90.9,
      mse: 0.15,
      mae: 0.08,
      r2Score: 0.94
    },
    version: '2.1.0',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    trainingDataSize: 50000,
    trainingDuration: 120,
    deploymentEndpoint: 'https://api.example.com/models/revenue-prediction',
    tags: ['revenue', 'prediction', 'business'],
    createdBy: 'user1',
    isPublic: true
  },
  {
    id: '2',
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
      f1Score: 86.6,
      auc: 0.89
    },
    version: '1.3.0',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-20T08:00:00Z',
    trainingDataSize: 25000,
    trainingDuration: 90,
    tags: ['churn', 'classification', 'customer'],
    createdBy: 'user2',
    isPublic: false
  },
  {
    id: '3',
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
      f1Score: 91.2,
      mse: 0.12,
      mae: 0.06
    },
    version: '3.0.0',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    trainingDataSize: 100000,
    trainingDuration: 180,
    deploymentEndpoint: 'https://api.example.com/models/demand-forecasting',
    tags: ['forecasting', 'inventory', 'time-series'],
    createdBy: 'user1',
    isPublic: true
  },
  {
    id: '4',
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
    },
    version: '1.5.0',
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-17T10:20:00Z',
    trainingDataSize: 75000,
    trainingDuration: 150,
    deploymentEndpoint: 'https://api.example.com/models/anomaly-detection',
    tags: ['anomaly', 'detection', 'security'],
    createdBy: 'user3',
    isPublic: false
  }
];

class MLModelService {
  private models: MLModel[] = [...mockModels];

  // Get all models
  async getModels(): Promise<MLModel[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.models];
  }

  // Get model by ID
  async getModelById(id: string): Promise<MLModel | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.models.find(model => model.id === id) || null;
  }

  // Create new model
  async createModel(request: CreateModelRequest): Promise<MLModel> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newModel: MLModel = {
      id: Date.now().toString(),
      name: request.name,
      type: request.type,
      status: 'Training',
      accuracy: 0,
      lastTrained: 'Just now',
      description: request.description,
      features: request.features,
      performance: {
        precision: 0,
        recall: 0,
        f1Score: 0
      },
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trainingDataSize: 0,
      trainingDuration: 0,
      tags: request.tags,
      createdBy: 'current-user',
      isPublic: request.isPublic
    };

    this.models.push(newModel);
    return newModel;
  }

  // Update model
  async updateModel(id: string, request: UpdateModelRequest): Promise<MLModel | null> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const modelIndex = this.models.findIndex(model => model.id === id);
    if (modelIndex === -1) return null;

    const updatedModel = {
      ...this.models[modelIndex],
      ...request,
      updatedAt: new Date().toISOString()
    };

    this.models[modelIndex] = updatedModel;
    return updatedModel;
  }

  // Delete model
  async deleteModel(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const modelIndex = this.models.findIndex(model => model.id === id);
    if (modelIndex === -1) return false;

    this.models.splice(modelIndex, 1);
    return true;
  }

  // Start model training
  async startTraining(request: ModelTrainingRequest): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const model = this.models.find(m => m.id === request.modelId);
    if (!model) return false;

    model.status = 'Training';
    model.updatedAt = new Date().toISOString();
    
    // Simulate training completion after some time
    setTimeout(() => {
      model.status = 'Active';
      model.accuracy = Math.random() * 20 + 80; // Random accuracy between 80-100
      model.lastTrained = 'Just now';
      model.updatedAt = new Date().toISOString();
    }, 10000); // 10 seconds

    return true;
  }

  // Pause/Resume model
  async toggleModelStatus(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const model = this.models.find(m => m.id === id);
    if (!model) return false;

    if (model.status === 'Active') {
      model.status = 'Paused';
    } else if (model.status === 'Paused') {
      model.status = 'Active';
    }
    
    model.updatedAt = new Date().toISOString();
    return true;
  }

  // Deploy model
  async deployModel(id: string): Promise<ModelDeployment | null> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const model = this.models.find(m => m.id === id);
    if (!model) return null;

    const deployment: ModelDeployment = {
      id: `deploy-${Date.now()}`,
      modelId: id,
      endpoint: `https://api.example.com/models/${model.name.toLowerCase().replace(/\s+/g, '-')}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      requestCount: 0,
      averageResponseTime: 0
    };

    model.deploymentEndpoint = deployment.endpoint;
    model.status = 'Deployed';
    model.updatedAt = new Date().toISOString();

    return deployment;
  }

  // Make prediction
  async makePrediction(request: ModelPredictionRequest): Promise<ModelPrediction | null> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const model = this.models.find(m => m.id === request.modelId);
    if (!model || (model.status !== 'Active' && model.status !== 'Deployed')) {
      return {
        id: `pred-${Date.now()}`,
        modelId: request.modelId,
        input: request.input,
        output: {},
        confidence: 0,
        timestamp: new Date().toISOString(),
        status: 'error',
        error: 'Model is not available for predictions'
      };
    }

    // Simulate different prediction types based on model type
    let prediction: any;
    let confidence: number;

    switch (model.type) {
      case 'Regression':
        // Simulate regression prediction (continuous value)
        const regressionValue = Math.random() * 1000 + 100; // 100-1100 range
        prediction = {
          prediction: regressionValue,
          range: {
            min: regressionValue * 0.8,
            max: regressionValue * 1.2
          },
          units: 'units'
        };
        confidence = Math.random() * 0.2 + 0.8; // 80-100%
        break;

      case 'Classification':
        // Simulate classification prediction
        const classes = ['Class A', 'Class B', 'Class C', 'Class D'];
        const predictedClass = classes[Math.floor(Math.random() * classes.length)];
        const probabilities = classes.reduce((acc, cls) => {
          acc[cls] = cls === predictedClass ? Math.random() * 0.4 + 0.6 : Math.random() * 0.3;
          return acc;
        }, {} as Record<string, number>);
        
        prediction = {
          prediction: predictedClass,
          probabilities,
          topClass: predictedClass
        };
        confidence = Math.random() * 0.3 + 0.7; // 70-100%
        break;

      case 'Time Series':
        // Simulate time series prediction
        const baseValue = Math.random() * 100 + 50;
        const trend = Math.random() > 0.5 ? 1 : -1;
        prediction = {
          prediction: baseValue,
          forecast: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            value: baseValue + (i + 1) * trend * Math.random() * 10
          })),
          trend: trend > 0 ? 'increasing' : 'decreasing'
        };
        confidence = Math.random() * 0.25 + 0.75; // 75-100%
        break;

      case 'Unsupervised':
        // Simulate anomaly detection
        const isAnomaly = Math.random() > 0.8; // 20% chance of anomaly
        prediction = {
          prediction: isAnomaly ? 'anomaly' : 'normal',
          anomalyScore: Math.random(),
          isAnomaly,
          explanation: isAnomaly ? 'Unusual pattern detected' : 'Normal pattern'
        };
        confidence = Math.random() * 0.2 + 0.8; // 80-100%
        break;

      case 'NLP':
        // Simulate NLP prediction
        const sentiment = ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)];
        prediction = {
          prediction: sentiment,
          sentiment,
          confidence: Math.random() * 0.3 + 0.7,
          keywords: ['keyword1', 'keyword2', 'keyword3'].slice(0, Math.floor(Math.random() * 3) + 1)
        };
        confidence = Math.random() * 0.3 + 0.7; // 70-100%
        break;

      case 'Computer Vision':
        // Simulate computer vision prediction
        const objects = ['person', 'car', 'building', 'tree', 'dog'];
        const detectedObjects = objects.slice(0, Math.floor(Math.random() * 3) + 1);
        prediction = {
          prediction: detectedObjects,
          objects: detectedObjects.map(obj => ({
            name: obj,
            confidence: Math.random() * 0.3 + 0.7,
            bbox: {
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 50 + 10,
              height: Math.random() * 50 + 10
            }
          })),
          imageAnalysis: {
            brightness: Math.random(),
            contrast: Math.random(),
            sharpness: Math.random()
          }
        };
        confidence = Math.random() * 0.2 + 0.8; // 80-100%
        break;

      default:
        prediction = {
          prediction: Math.random() * 100,
          confidence: Math.random() * 0.3 + 0.7
        };
        confidence = Math.random() * 0.3 + 0.7;
    }

    const result: ModelPrediction = {
      id: `pred-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      modelId: request.modelId,
      input: request.input,
      output: prediction,
      confidence,
      timestamp: new Date().toISOString(),
      status: 'success'
    };

    return result;
  }

  // Get model metrics
  async getModelMetrics(modelId: string, days: number = 7): Promise<ModelMetrics[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const metrics: ModelMetrics[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      metrics.push({
        modelId,
        timestamp: date.toISOString(),
        accuracy: Math.random() * 10 + 85, // 85-95%
        loss: Math.random() * 0.5 + 0.1, // 0.1-0.6
        precision: Math.random() * 10 + 85,
        recall: Math.random() * 10 + 85,
        f1Score: Math.random() * 10 + 85,
        trainingTime: Math.random() * 100 + 50, // 50-150 minutes
        inferenceTime: Math.random() * 10 + 5 // 5-15ms
      });
    }

    return metrics;
  }

  // Search models
  async searchModels(query: string): Promise<MLModel[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lowercaseQuery = query.toLowerCase();
    return this.models.filter(model => 
      model.name.toLowerCase().includes(lowercaseQuery) ||
      model.description.toLowerCase().includes(lowercaseQuery) ||
      model.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      model.type.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const mlModelService = new MLModelService();
