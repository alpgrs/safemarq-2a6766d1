import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useLandingStats() {
  return useQuery({
    queryKey: ['landing-stats'],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const [garagesRes, reviewsRes, ratingsRes] = await Promise.all([
        supabase.from('garages').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('garages').select('rating'),
      ]);
      const ratings = (ratingsRes.data || []).map((r: any) => Number(r.rating)).filter((n) => !isNaN(n) && n > 0);
      const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      return {
        garages: garagesRes.count ?? 0,
        reviews: reviewsRes.count ?? 0,
        avgRating: Math.round(avg * 10) / 10,
      };
    },
  });
}
