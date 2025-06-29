
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useImages = () => {
  const { user } = useAuth();

  const { data: images, isLoading, refetch, error } = useQuery({
    queryKey: ['images', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found, returning empty array');
        return [];
      }
      
      console.log('Fetching images for user:', user.id);
      
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching images:', error);
        throw error;
      }
      
      console.log('Fetched images:', data?.length || 0, 'images');
      console.log('Sample image data:', data?.[0]);
      
      return data || [];
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    images: images || [],
    isLoading,
    refetch,
    error,
  };
};
