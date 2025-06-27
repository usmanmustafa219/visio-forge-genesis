
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

      console.log('Starting image generation with params:', params);

      try {
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: {
            ...params,
            user_id: user.id,
          },
        });

        console.log('Supabase function response:', { data, error });

        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(error.message || 'Failed to generate image');
        }

        if (!data) {
          throw new Error('No data returned from image generation');
        }

        if (data.error) {
          console.error('Function returned error:', data.error);
          throw new Error(data.error);
        }

        if (!data.success) {
          throw new Error('Image generation was not successful');
        }

        console.log('Image generation successful:', data);
        return data;
      } catch (err) {
        console.error('Image generation error:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast.success('Image generated successfully!');
      console.log('Image generation completed successfully');
    },
    onError: (error: any) => {
      console.error('Image generation mutation error:', error);
      
      let message = 'Failed to generate image';
      if (error.message) {
        if (error.message.includes('Insufficient credits')) {
          message = error.message;
        } else if (error.message.includes('API key')) {
          message = 'Service temporarily unavailable. Please try again later.';
        } else if (error.message.includes('rate limit')) {
          message = 'Rate limit exceeded. Please wait a moment and try again.';
        } else {
          message = error.message;
        }
      }
      
      toast.error(message);
    },
  });

  return {
    generateImage: generateImageMutation.mutate,
    isGenerating: generateImageMutation.isPending,
  };
};
