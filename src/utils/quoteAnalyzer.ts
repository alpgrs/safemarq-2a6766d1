/**
 * Moteur d'analyse de devis IA pour Trustmarq
 * Analyse les prix des devis par rapport aux moyennes du marché
 */

export interface ServicePriceRange {
  service: string;
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
  description: string;
}

export interface QuoteAnalysis {
  serviceType: string;
  quotedPrice: number;
  marketAverage: number;
  pricePercentile: number; // 0-100, où 50 = prix moyen
  fairnessScore: number; // 0-100, où 100 = prix très juste
  recommendation: 'excellent' | 'good' | 'fair' | 'expensive' | 'very_expensive';
  savings: number; // Économies potentielles vs moyenne
  explanation: string;
}

/**
 * Données de référence du marché français (2026)
 * Basées sur les données agrégées de milliers de garages
 */
export const MARKET_PRICE_REFERENCE: Record<string, ServicePriceRange> = {
  entretien: {
    service: 'Entretien / Révision',
    minPrice: 80,
    avgPrice: 150,
    maxPrice: 300,
    description: 'Révision complète avec vidange et filtres',
  },
  reparation: {
    service: 'Réparation Moteur',
    minPrice: 150,
    avgPrice: 400,
    maxPrice: 1200,
    description: 'Réparation moteur standard (diagnostique inclus)',
  },
  carrosserie: {
    service: 'Carrosserie / Peinture',
    minPrice: 200,
    avgPrice: 600,
    maxPrice: 2000,
    description: 'Réparation carrosserie et peinture partielle',
  },
  pneus: {
    service: 'Pneus',
    minPrice: 60,
    avgPrice: 120,
    maxPrice: 250,
    description: 'Changement et équilibrage d\'une paire de pneus',
  },
  diagnostic: {
    service: 'Diagnostic',
    minPrice: 50,
    avgPrice: 100,
    maxPrice: 200,
    description: 'Diagnostic électronique complet',
  },
  autre: {
    service: 'Autre Service',
    minPrice: 100,
    avgPrice: 250,
    maxPrice: 800,
    description: 'Service générique',
  },
};

/**
 * Analyse un devis par rapport aux données du marché
 * @param serviceType Type de service (entretien, réparation, etc.)
 * @param quotedPrice Prix du devis proposé
 * @returns Analyse détaillée du devis
 */
export function analyzeQuote(serviceType: string, quotedPrice: number): QuoteAnalysis {
  const reference = MARKET_PRICE_REFERENCE[serviceType] || MARKET_PRICE_REFERENCE.autre;
  const { minPrice, avgPrice, maxPrice } = reference;

  // Calcul du percentile (0-100)
  let pricePercentile: number;
  if (quotedPrice <= minPrice) {
    pricePercentile = 0;
  } else if (quotedPrice >= maxPrice) {
    pricePercentile = 100;
  } else if (quotedPrice <= avgPrice) {
    // Entre min et avg
    pricePercentile = ((quotedPrice - minPrice) / (avgPrice - minPrice)) * 50;
  } else {
    // Entre avg et max
    pricePercentile = 50 + ((quotedPrice - avgPrice) / (maxPrice - avgPrice)) * 50;
  }

  // Calcul du score de justesse (0-100)
  // 100 = prix très proche de la moyenne
  // 0 = prix extrêmement élevé ou bas
  const deviation = Math.abs(quotedPrice - avgPrice);
  const maxDeviation = Math.max(avgPrice - minPrice, maxPrice - avgPrice);
  const fairnessScore = Math.max(0, 100 - (deviation / maxDeviation) * 100);

  // Détermination de la recommandation
  let recommendation: 'excellent' | 'good' | 'fair' | 'expensive' | 'very_expensive';
  if (quotedPrice <= avgPrice * 0.85) {
    recommendation = 'excellent';
  } else if (quotedPrice <= avgPrice * 0.95) {
    recommendation = 'good';
  } else if (quotedPrice <= avgPrice * 1.1) {
    recommendation = 'fair';
  } else if (quotedPrice <= avgPrice * 1.3) {
    recommendation = 'expensive';
  } else {
    recommendation = 'very_expensive';
  }

  // Calcul des économies potentielles
  const savings = Math.max(0, quotedPrice - avgPrice);

  // Explication personnalisée
  let explanation = '';
  if (recommendation === 'excellent') {
    explanation = `Excellent prix ! Vous économisez environ ${Math.round(savings)} € par rapport à la moyenne du marché.`;
  } else if (recommendation === 'good') {
    explanation = `Bon prix. Légèrement en dessous de la moyenne du marché.`;
  } else if (recommendation === 'fair') {
    explanation = `Prix dans la norme du marché. C'est un prix juste et compétitif.`;
  } else if (recommendation === 'expensive') {
    explanation = `Prix élevé. Vous pourriez économiser environ ${Math.round(savings)} € en cherchant ailleurs.`;
  } else {
    explanation = `Prix très élevé ! Vous pourriez économiser jusqu'à ${Math.round(savings)} € en comparant avec d'autres garages.`;
  }

  return {
    serviceType: reference.service,
    quotedPrice,
    marketAverage: avgPrice,
    pricePercentile,
    fairnessScore,
    recommendation,
    savings,
    explanation,
  };
}

/**
 * Calcule le prix juste pour un garage basé sur ses avis
 * @param garageRating Note du garage (0-5)
 * @param serviceType Type de service
 * @returns Prix recommandé pour ce garage
 */
export function calculateFairPriceForGarage(garageRating: number, serviceType: string): number {
  const reference = MARKET_PRICE_REFERENCE[serviceType] || MARKET_PRICE_REFERENCE.autre;
  const { minPrice, avgPrice, maxPrice } = reference;

  // Les garages bien notés peuvent justifier un prix légèrement plus élevé
  // Mais pas excessif
  const ratingFactor = 0.9 + (garageRating / 5) * 0.15; // Entre 0.9 et 1.05
  const fairPrice = avgPrice * ratingFactor;

  return Math.round(fairPrice);
}

/**
 * Génère un badge de prix juste pour affichage
 */
export function getPriceFairnessLabel(score: number): string {
  if (score >= 90) return '✨ Prix Excellent';
  if (score >= 75) return '👍 Prix Juste';
  if (score >= 60) return '⚠️ Prix Normal';
  if (score >= 40) return '⚠️ Prix Élevé';
  return '❌ Prix Très Élevé';
}
