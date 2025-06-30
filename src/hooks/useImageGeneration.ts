
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface GenerateContentParams {
  prompt: string;
  quality?: string;
  size?: string;
  category?: string;
  style?: string;
  contentType?: 'image' | 'video';
}

export const useImageGeneration = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const generateContentMutation = useMutation({
    mutationFn: async (params: GenerateContentParams) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Starting content generation with params:', params);

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
          throw new Error(error.message || `Failed to generate ${params.contentType || 'image'}`);
        }

        if (!data) {
          throw new Error(`No response from ${params.contentType || 'image'} generation service`);
        }

        if (data.error) {
          console.error('Function returned error:', data.error);
          throw new Error(data.error);
        }

        if (!data.success) {
          throw new Error(`${params.contentType || 'Image'} generation was not successful`);
        }

        console.log('Content generation successful:', data);
        return data;
      } catch (err: any) {
        console.error('Content generation error:', err);
        
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      
      const contentType = variables.contentType || 'image';
      toast.success(`${contentType === 'video' ? 'Video' : 'Image'} generated successfully!`);
      console.log('Content generation completed successfully');
    },
    onError: (error: any, variables) => {
      console.error('Content generation mutation error:', error);
      
      const contentType = variables.contentType || 'image';
      let message = `Failed to generate ${contentType}`;
      
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
    // Increase timeout for content generation
    retry: 1,
    retryDelay: 2000,
  });

  return {
    generateImage: generateContentMutation.mutate,
    isGenerating: generateContentMutation.isPending,
  };
};
