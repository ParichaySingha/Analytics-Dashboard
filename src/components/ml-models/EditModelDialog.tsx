import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X, Plus, Edit } from 'lucide-react';
import { useUpdateMLModel } from '@/hooks/useMLModels';
import { MLModel } from '@/types/mlModels';

const editModelSchema = z.object({
  name: z.string().min(1, 'Model name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
});

type EditModelFormData = z.infer<typeof editModelSchema>;

interface EditModelDialogProps {
  children?: React.ReactNode;
  model: MLModel;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const EditModelDialog = ({ children, model, open: controlledOpen, onOpenChange }: EditModelDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const updateModelMutation = useUpdateMLModel();
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const form = useForm<EditModelFormData>({
    resolver: zodResolver(editModelSchema),
    defaultValues: {
      name: model.name,
      description: model.description,
      tags: model.tags || [],
      isPublic: model.isPublic,
    },
  });

  const watchedTags = form.watch('tags');

  useEffect(() => {
    if (open) {
      form.reset({
        name: model.name,
        description: model.description,
        tags: model.tags || [],
        isPublic: model.isPublic,
      });
    }
  }, [open, model, form]);

  const onSubmit = async (data: EditModelFormData) => {
    try {
      await updateModelMutation.mutateAsync({ id: model.id, request: data });
      setOpen(false);
    } catch (error) {
      console.error('Failed to update model:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !watchedTags?.includes(newTag.trim())) {
      form.setValue('tags', [...(watchedTags || []), newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    form.setValue('tags', (watchedTags || []).filter(t => t !== tag));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Model
          </DialogTitle>
          <DialogDescription>
            Update the model information and settings.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Model name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Model description..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
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

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Public Model</FormLabel>
                    <FormDescription>
                      Make this model visible to other users in your organization.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateModelMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateModelMutation.isPending}
              >
                {updateModelMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
