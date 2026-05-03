import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { TrendingDown, Sparkles, Wrench, ShieldCheck, Zap } from 'lucide-react';

export type DbGarage = Tables<'garages'>;

const ICON_MAP: Record<string, typeof ShieldCheck> = {
  ShieldCheck,
  TrendingDown,
  Sparkles,
  Wrench,
  Zap,
};

export interface Garage {
  id: string;
  slug: string;
  name: string;
  type: 'dealer' | 'independent';
  specialty: string;
  brand: string;
  rating: number;
  reviews: number;
  priceLevel: string;
  keyInsight: string;
  insightIcon: typeof ShieldCheck;
  quality: { speed: number; cleanliness: number; transparency: number };
  quote: string;
  badges: string[];
  verified: boolean;
  address: string;
  phone: string;
  website: string;
  description: string;
  images: string[];
  hours: { day: string; open: string; close: string }[];
  coords: { lat: number; lng: number };
  vehicleTypes: string[];
  serviceTypes: string[];
}

function mapDbToGarage(db: DbGarage): Garage {
  const quality = db.quality_scores as { speed: number; cleanliness: number; transparency: number };
  const coords = db.coords as { lat: number; lng: number };
  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    type: db.type as 'dealer' | 'independent',
    specialty: db.specialty || '',
    brand: db.brand || '',
    rating: Number(db.rating),
    reviews: db.reviews_count,
    priceLevel: db.price_level,
    keyInsight: db.key_insight || '',
    insightIcon: ICON_MAP[db.insight_icon || 'ShieldCheck'] || ShieldCheck,
    quality,
    quote: db.quote || '',
    badges: (db.badges as string[]) || [],
    verified: db.verified,
    address: db.address,
    phone: db.phone || '',
    website: db.website || '',
    description: db.description || '',
    images: (db.images as string[]) || [],
    hours: (db.hours as { day: string; open: string; close: string }[]) || [],
    coords,
    vehicleTypes: ((db as any).vehicle_types as string[]) || ['voiture'],
    serviceTypes: ((db as any).service_types as string[]) || ['entretien', 'reparation'],
  };
}

export function calculateTrustmarqScore(rating: number, reviewCount: number): number {
  const ratingScore = (rating / 5) * 100;
  const volumeScore = Math.min((Math.log10(reviewCount + 1) / Math.log10(501)) * 100, 100);
  return Math.round(ratingScore * 0.6 + volumeScore * 0.4);
}

export function useGarages() {
  return useQuery({
    queryKey: ['garages'],
    queryFn: async (): Promise<Garage[]> => {
      const { data, error } = await supabase.from('garages').select('*');
      if (error) throw error;
      return (data || []).map(mapDbToGarage);
    },
  });
}

export function useGarage(slug: string) {
  return useQuery({
    queryKey: ['garage', slug],
    queryFn: async (): Promise<Garage | null> => {
      const { data, error } = await supabase.from('garages').select('*').eq('slug', slug).maybeSingle();
      if (error) throw error;
      return data ? mapDbToGarage(data) : null;
    },
  });
}
