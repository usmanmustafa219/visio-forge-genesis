
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface GenerateImageParams {
  prompt: string;
  quality?: string;
  size?: string;
  category?: string;
  style?: string;
}

export const useImageGeneration = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const generateImageMutation = useMutation({
    mutationFn: async (params: GenerateImageParams) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Calling image generation function with params:', params);

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          ...params,
          user_id: user.id,
        },
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate image');
      }

      if (!data) {
        throw new Error('No data returned from image generation');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast.success('Image generated successfully!');
      console.log('Image generation successful:', data);
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to generate image';
      toast.error(message);
      console.error('Image generation error:', error);
    },
  });

  return {
    generateImage: generateImageMutation.mutate,
    isGenerating: generateImageMutation.isPending,
  };
};
