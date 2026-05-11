import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type GarageTier = 'free' | 'pro' | 'premium';

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'trialing'
  | 'unpaid'
  | 'incomplete_expired';

export interface GarageSubscription {
  id: string;
  garage_id: string;
  tier: GarageTier;
  status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export type PremiumFeature =
  | 'logo'
  | 'cover'
  | 'gallery_extended'
  | 'services_detail'
  | 'long_description'
  | 'analytics'
  | 'booking'
  | 'video'
  | 'team'
  | 'certifications'
  | 'faq'
  | 'promo'
  | 'multi_site'
  | 'export_csv';

const PRO_FEATURES: PremiumFeature[] = [
  'logo',
  'cover',
  'gallery_extended',
  'services_detail',
  'long_description',
  'analytics',
  'booking',
];

const PREMIUM_ONLY_FEATURES: PremiumFeature[] = [
  'video',
  'team',
  'certifications',
  'faq',
  'promo',
  'multi_site',
  'export_csv',
];

export function tierAllows(tier: GarageTier, feature: PremiumFeature): boolean {
  if (tier === 'premium') return true;
  if (tier === 'pro') return PRO_FEATURES.includes(feature);
  return false;
}

export function requiredTierFor(feature: PremiumFeature): 'pro' | 'premium' {
  return PREMIUM_ONLY_FEATURES.includes(feature) ? 'premium' : 'pro';
}

export function useGarageSubscription(garageId: string | undefined) {
  return useQuery({
    queryKey: ['garage_subscription', garageId],
    queryFn: async (): Promise<GarageSubscription | null> => {
      if (!garageId) return null;
      const { data, error } = await (supabase as unknown as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => {
              maybeSingle: () => Promise<{ data: GarageSubscription | null; error: Error | null }>;
            };
          };
        };
      })
        .from('garage_subscriptions')
        .select('*')
        .eq('garage_id', garageId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!garageId,
  });
}

export const TIER_LABEL: Record<GarageTier, string> = {
  free: 'Free',
  pro: 'Pro',
  premium: 'Premium',
};

export const TIER_PRICE: Record<GarageTier, string> = {
  free: 'Gratuit',
  pro: '39 €/mois',
  premium: '99 €/mois',
};

export const TIER_COLOR: Record<GarageTier, string> = {
  free: 'text-muted-foreground bg-muted',
  pro: 'text-primary bg-primary/10',
  premium: 'text-amber-700 bg-amber-500/15',
};
