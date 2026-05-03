import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

export type Review = Tables<'reviews'>;

export function useGarageReviews(garageId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', garageId],
    enabled: !!garageId,
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('garage_id', garageId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: { garage_id: string; user_id: string; author_name: string; rating: number; text: string }) => {
      const { data, error } = await supabase.from('reviews').insert(review).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', data.garage_id] });
    },
  });
}

export function useHelpfulVotes(reviewIds: string[]) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['helpful_votes', user?.id, reviewIds],
    enabled: !!user && reviewIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('helpful_votes')
        .select('review_id')
        .eq('user_id', user!.id)
        .in('review_id', reviewIds);
      if (error) throw error;
      return new Set((data || []).map(v => v.review_id));
    },
  });
}

export function useToggleHelpful() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, hasVoted }: { reviewId: string; hasVoted: boolean }) => {
      if (!user) throw new Error('Not authenticated');
      if (hasVoted) {
        const { error } = await supabase
          .from('helpful_votes')
          .delete()
          .eq('user_id', user.id)
          .eq('review_id', reviewId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('helpful_votes')
          .insert({ user_id: user.id, review_id: reviewId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['helpful_votes'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
