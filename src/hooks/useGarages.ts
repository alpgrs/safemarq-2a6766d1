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

export type GarageTier = 'free' | 'pro' | 'premium';

export interface TeamMember {
  name: string;
  role: string;
  photo_url?: string;
  bio?: string;
}

export interface Certification {
  name: string;
  icon?: string;
  description?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ServiceDetail {
  name: string;
  price_from?: number;
  description?: string;
}

export interface PromoBanner {
  text: string;
  cta?: string;
  cta_url?: string;
  active_until?: string;
}

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
  // Premium content (optionnel selon tier)
  tier: GarageTier;
  logoUrl: string | null;
  coverImageUrl: string | null;
  videoUrl: string | null;
  longDescription: string | null;
  team: TeamMember[];
  certifications: Certification[];
  faq: FaqItem[];
  servicesDetail: ServiceDetail[];
  promoBanner: PromoBanner | null;
}

function mapDbToGarage(db: DbGarage): Garage {
  const quality = db.quality_scores as { speed: number; cleanliness: number; transparency: number };
  const coords = db.coords as { lat: number; lng: number };
  const ext = db as unknown as Record<string, unknown>;
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
    vehicleTypes: (ext.vehicle_types as string[]) || ['voiture'],
    serviceTypes: (ext.service_types as string[]) || ['entretien', 'reparation'],
    tier: (ext.tier as GarageTier) || 'free',
    logoUrl: (ext.logo_url as string | null) ?? null,
    coverImageUrl: (ext.cover_image_url as string | null) ?? null,
    videoUrl: (ext.video_url as string | null) ?? null,
    longDescription: (ext.long_description as string | null) ?? null,
    team: (ext.team as TeamMember[]) || [],
    certifications: (ext.certifications as Certification[]) || [],
    faq: (ext.faq as FaqItem[]) || [],
    servicesDetail: (ext.services_detail as ServiceDetail[]) || [],
    promoBanner: (ext.promo_banner as PromoBanner | null) ?? null,
  };
}

export function calculateSAFEMARQScore(rating: number, reviewCount: number): number {
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
