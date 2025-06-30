
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePromptEnhancer = () => {
  const enhancePromptMutation = useMutation({
    mutationFn: async (prompt: string) => {
      console.log('Enhancing prompt:', prompt);

      const { data, error } = await supabase.functions.invoke('enhance-prompt', {
        body: { prompt },
      });

      console.log('Enhancement response:', { data, error });

      if (error) {
        console.error('Enhancement error:', error);
        throw new Error(error.message || 'Failed to enhance prompt');
      }

      if (!data || !data.success) {
        throw new Error('Failed to enhance prompt');
      }

      return data.enhancedPrompt;
    },
    onSuccess: () => {
      toast.success('Prompt enhanced successfully!');
    },
    onError: (error: any) => {
      console.error('Enhancement mutation error:', error);
      toast.error(error.message || 'Failed to enhance prompt');
    },
  });

  return {
    enhancePrompt: enhancePromptMutation.mutate,
    isEnhancing: enhancePromptMutation.isPending,
  };
};
