
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

      // Validate prompt
      if (!params.prompt || params.prompt.trim().length < 3) {
        throw new Error('Please provide a more detailed prompt (at least 3 characters)');
      }

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
          throw new Error('No response from image generation service');
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
      } catch (err: any) {
        console.error('Image generation error:', err);
        
        // Handle specific error types
        if (err.message?.includes('fetch')) {
          throw new Error('Network error. Please check your connection and try again.');
        }
        
        if (err.message?.includes('timeout')) {
          throw new Error('Request timed out. Please try again.');
        }
        
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
        } else if (error.message.includes('content policy')) {
          message = 'Content policy violation. Please modify your prompt and try again.';
        } else if (error.message.includes('rate limit')) {
          message = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (error.message.includes('Network error')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else if (error.message.includes('Service temporarily unavailable')) {
          message = 'Service temporarily unavailable. Please try again later.';
        } else {
          message = error.message;
        }
      }
      
      toast.error(message);
    },
    // Increase timeout for image generation
    retry: 1,
    retryDelay: 2000,
  });

  return {
    generateImage: generateImageMutation.mutate,
    isGenerating: generateImageMutation.isPending,
  };
};
