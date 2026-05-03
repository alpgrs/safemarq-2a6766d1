import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useGarageOwnership() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['garage-ownership', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('garage_owners')
        .select('*')
        .eq('user_id', user!.id);
      if (error) throw error;
      return data || [];
    },
  });
}

export function useGarageReviewsForOwner(garageId: string) {
  return useQuery({
    queryKey: ['owner-reviews', garageId],
    enabled: !!garageId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('garage_id', garageId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useReviewResponses(reviewIds: string[]) {
  return useQuery({
    queryKey: ['review-responses', reviewIds],
    enabled: reviewIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('review_responses')
        .select('*')
        .in('review_id', reviewIds);
      if (error) throw error;
      return data || [];
    },
  });
}
