import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Zap } from 'lucide-react';
import { useCreateMLModel } from '@/hooks/useMLModels';
import { ModelType } from '@/types/mlModels';

const createModelSchema = z.object({
  name: z.string().min(1, 'Model name is required').max(100, 'Name must be less than 100 characters'),
  type: z.enum(['Regression', 'Classification', 'Time Series', 'Unsupervised', 'Deep Learning', 'NLP', 'Computer Vision']),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  trainingDataId: z.string().min(1, 'Training data source is required'),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
});

type CreateModelFormData = z.infer<typeof createModelSchema>;

interface CreateModelDialogProps {
  children: React.ReactNode;
}

const mockDataSources = [
  { id: '1', name: 'User Behavior Dataset', description: 'User interaction data from the last 6 months' },
  { id: '2', name: 'Sales Transaction Data', description: 'Historical sales data with product information' },
  { id: '3', name: 'Customer Support Logs', description: 'Support ticket data and resolution metrics' },
  { id: '4', name: 'Website Analytics', description: 'Page views, session data, and user journey information' },
];

export const CreateModelDialog = ({ children }: CreateModelDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const createModelMutation = useCreateMLModel();

  const form = useForm<CreateModelFormData>({
    resolver: zodResolver(createModelSchema),
    defaultValues: {
      name: '',
      type: 'Regression',
      description: '',
      features: [],
      trainingDataId: '',
      tags: [],
      isPublic: false,
    },
  });

  const watchedFeatures = form.watch('features');
  const watchedTags = form.watch('tags');

  const onSubmit = async (data: CreateModelFormData) => {
    try {
      await createModelMutation.mutateAsync({
        name: data.name,
        type: data.type,
        description: data.description,
        features: data.features,
        trainingDataId: data.trainingDataId,
        tags: data.tags || [],
        isPublic: data.isPublic,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Failed to create model:', error);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !watchedFeatures.includes(newFeature.trim())) {
      form.setValue('features', [...watchedFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    form.setValue('features', watchedFeatures.filter(f => f !== feature));
  };

  const addTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      form.setValue('tags', [...(watchedTags || []), newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    form.setValue('tags', (watchedTags || []).filter(t => t !== tag));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Create New ML Model
          </DialogTitle>
          <DialogDescription>
            Create a new machine learning model with your training data and configuration.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Revenue Prediction Model" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select model type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(['Regression', 'Classification', 'Time Series', 'Unsupervised', 'Deep Learning', 'NLP', 'Computer Vision'] as ModelType[]).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this model does and its purpose..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the model's purpose and functionality.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trainingDataId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Training Data Source</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockDataSources.map((source) => (
                        <SelectItem key={source.id} value={source.id}>
                          <div>
                            <div className="font-medium">{source.name}</div>
                            <div className="text-sm text-muted-foreground">{source.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="features"
                render={() => (
                  <FormItem>
                    <FormLabel>Model Features</FormLabel>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a feature..."
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        />
                        <Button type="button" onClick={addFeature} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {watchedFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {watchedFeatures.map((feature) => (
                            <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                              {feature}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() => removeFeature(feature)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      Define the input features that your model will use for predictions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>Tags (Optional)</FormLabel>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" onClick={addTag} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {watchedTags && watchedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {watchedTags.map((tag) => (
                            <Badge key={tag} variant="outline" className="flex items-center gap-1">
                              {tag}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() => removeTag(tag)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      Add tags to help categorize and organize your models.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createModelMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createModelMutation.isPending}
              >
                {createModelMutation.isPending ? 'Creating...' : 'Create Model'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
