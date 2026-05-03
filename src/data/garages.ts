import { TrendingDown, Sparkles, Wrench, ShieldCheck, Zap } from 'lucide-react';

export type GarageType = 'dealer' | 'independent';
export type PriceLevel = '€' | '€€' | '€€€';

export interface Garage {
  slug: string;
  name: string;
  type: GarageType;
  specialty: string;
  brand: string;
  rating: number;
  reviews: number;
  priceLevel: PriceLevel;
  keyInsight: string;
  insightIcon: typeof TrendingDown;
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
}

/**
 * Calculates the Trustmarq Score (0–100).
 * 60% weighted on Google rating (normalized to 100), 40% on review volume (log-scaled, capped at 500).
 */
export function calculateTrustmarqScore(rating: number, reviewCount: number): number {
  const ratingScore = (rating / 5) * 100;
  const volumeScore = Math.min((Math.log10(reviewCount + 1) / Math.log10(501)) * 100, 100);
  return Math.round(ratingScore * 0.6 + volumeScore * 0.4);
}

export const GARAGES: Garage[] = [
  {
    slug: 'concession-peugeot-lyon',
    name: 'Concession Officielle Peugeot Lyon',
    type: 'dealer',
    specialty: 'Peugeot & Citroën',
    brand: 'Peugeot',
    rating: 3.4,
    reviews: 210,
    priceLevel: '€€€',
    keyInsight: 'Pièces d\'origine garanties',
    insightIcon: ShieldCheck,
    quality: { speed: 52, cleanliness: 78, transparency: 45 },
    quote: "Délais longs et factures salées pour un simple entretien. Service correct mais impersonnel.",
    badges: ['Pièces OEM', 'Garantie Constructeur'],
    verified: false,
    address: '120 Avenue Jean Jaurès, 69007 Lyon',
    phone: '+33 4 72 00 11 22',
    website: 'peugeot-lyon.fr',
    description: 'Concession officielle Peugeot avec atelier agréé. Service après-vente et véhicules neufs.',
    images: [
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop',
    ],
    hours: [
      { day: 'Lundi', open: '08:30', close: '18:00' },
      { day: 'Mardi', open: '08:30', close: '18:00' },
      { day: 'Mercredi', open: '08:30', close: '18:00' },
      { day: 'Jeudi', open: '08:30', close: '18:00' },
      { day: 'Vendredi', open: '08:30', close: '17:30' },
      { day: 'Samedi', open: '09:00', close: '12:30' },
      { day: 'Dimanche', open: '', close: '' },
    ],
    coords: { lat: 45.7484, lng: 4.8357 },
  },
  {
    slug: 'garage-dupont-peugeot',
    name: 'Garage Dupont — Spécialiste Peugeot',
    type: 'independent',
    specialty: 'Peugeot & PSA Group',
    brand: 'Peugeot',
    rating: 4.8,
    reviews: 185,
    priceLevel: '€',
    keyInsight: 'Économisez 45% vs concession',
    insightIcon: TrendingDown,
    quality: { speed: 94, cleanliness: 91, transparency: 97 },
    quote: "Travail impeccable, prix imbattable. Mon mécanicien depuis 6 ans, jamais déçu.",
    badges: ['Spécialiste PSA', 'Devis gratuit'],
    verified: true,
    address: '8 Rue de la République, 69002 Lyon',
    phone: '+33 4 78 00 33 44',
    website: 'garage-dupont.fr',
    description: 'Spécialiste Peugeot indépendant depuis 2012. Diagnostics précis, tarifs transparents.',
    images: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop',
    ],
    hours: [
      { day: 'Lundi', open: '07:30', close: '19:00' },
      { day: 'Mardi', open: '07:30', close: '19:00' },
      { day: 'Mercredi', open: '07:30', close: '19:00' },
      { day: 'Jeudi', open: '07:30', close: '19:00' },
      { day: 'Vendredi', open: '07:30', close: '18:00' },
      { day: 'Samedi', open: '08:00', close: '14:00' },
      { day: 'Dimanche', open: '', close: '' },
    ],
    coords: { lat: 45.7640, lng: 4.8357 },
  },
  {
    slug: 'autoprecision-paris',
    name: 'AutoPrecision Paris 16',
    type: 'independent',
    specialty: 'Porsche & VW Group',
    brand: 'Porsche',
    rating: 4.9,
    reviews: 127,
    priceLevel: '€€',
    keyInsight: 'Économisez 40% vs concession',
    insightIcon: TrendingDown,
    quality: { speed: 92, cleanliness: 95, transparency: 98 },
    quote: "Diagnostics ultra-précis en 20 min. Suivi exceptionnel.",
    badges: ['Porsche Specialist', 'Pièces OEM'],
    verified: true,
    address: '42 Avenue Foch, 75016 Paris',
    phone: '+33 1 45 00 12 34',
    website: 'autoprecision.fr',
    description: 'Spécialiste Porsche et VW Group depuis 2008. Diagnostics de pointe et suivi personnalisé.',
    images: [
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop',
    ],
    hours: [
      { day: 'Lundi', open: '08:00', close: '18:30' },
      { day: 'Mardi', open: '08:00', close: '18:30' },
      { day: 'Mercredi', open: '08:00', close: '18:30' },
      { day: 'Jeudi', open: '08:00', close: '18:30' },
      { day: 'Vendredi', open: '08:00', close: '17:00' },
      { day: 'Samedi', open: '09:00', close: '13:00' },
      { day: 'Dimanche', open: '', close: '' },
    ],
    coords: { lat: 48.8706, lng: 2.2862 },
  },
  {
    slug: 'electrodrive-bordeaux',
    name: 'ElectroDrive Bordeaux',
    type: 'independent',
    specialty: 'Tesla & EV Specialist',
    brand: 'Tesla',
    rating: 4.7,
    reviews: 84,
    priceLevel: '€€',
    keyInsight: '#1 Véhicules Électriques',
    insightIcon: Zap,
    quality: { speed: 88, cleanliness: 94, transparency: 96 },
    quote: "Le seul garage qui comprend vraiment Tesla. Calibration parfaite.",
    badges: ['EV Certifié', 'Urgence 24h'],
    verified: true,
    address: '15 Quai des Chartrons, 33000 Bordeaux',
    phone: '+33 5 56 00 67 89',
    website: 'electrodrive.fr',
    description: 'Centre certifié véhicules électriques. Expertise Tesla et calibration batteries.',
    images: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=500&fit=crop',
    ],
    hours: [
      { day: 'Lundi', open: '07:30', close: '19:00' },
      { day: 'Mardi', open: '07:30', close: '19:00' },
      { day: 'Mercredi', open: '07:30', close: '19:00' },
      { day: 'Jeudi', open: '07:30', close: '19:00' },
      { day: 'Vendredi', open: '07:30', close: '18:00' },
      { day: 'Samedi', open: '08:00', close: '14:00' },
      { day: 'Dimanche', open: '', close: '' },
    ],
    coords: { lat: 44.8551, lng: -0.5696 },
  },
  {
    slug: 'mecanique-martin-marseille',
    name: 'Mécanique Martin Marseille',
    type: 'independent',
    specialty: 'BMW & Mercedes',
    brand: 'BMW',
    rating: 4.6,
    reviews: 312,
    priceLevel: '€',
    keyInsight: 'Plus de 300 avis vérifiés',
    insightIcon: Sparkles,
    quality: { speed: 90, cleanliness: 87, transparency: 93 },
    quote: "Excellent rapport qualité-prix pour l'entretien de ma Série 3. Très pro.",
    badges: ['BMW Specialist', 'Mercedes Expert'],
    verified: true,
    address: '34 Boulevard Michelet, 13008 Marseille',
    phone: '+33 4 91 00 55 66',
    website: 'mecanique-martin.fr',
    description: 'Expert BMW et Mercedes depuis 2005. Mécanique de précision et tarifs compétitifs.',
    images: [
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop',
    ],
    hours: [
      { day: 'Lundi', open: '08:00', close: '18:00' },
      { day: 'Mardi', open: '08:00', close: '18:00' },
      { day: 'Mercredi', open: '08:00', close: '18:00' },
      { day: 'Jeudi', open: '08:00', close: '18:00' },
      { day: 'Vendredi', open: '08:00', close: '17:00' },
      { day: 'Samedi', open: '09:00', close: '13:00' },
      { day: 'Dimanche', open: '', close: '' },
    ],
    coords: { lat: 43.2765, lng: 5.3698 },
  },
];
