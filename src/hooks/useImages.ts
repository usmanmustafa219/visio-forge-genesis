
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useImages = () => {
  const { user } = useAuth();

  const { data: images, isLoading, refetch } = useQuery({
    queryKey: ['images', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching images:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  return {
    images: images || [],
    isLoading,
    refetch,
  };
};
