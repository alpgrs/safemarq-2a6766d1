import { Star, Gauge, Eye, BadgeCheck, Phone, FileText, ShieldCheck, ArrowUpDown, MapPin } from 'lucide-react';
import { FILTER_OPTIONS, SERVICE_TYPES } from '@/components/FilterChips';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGarages, calculateTrustmarqScore } from '@/hooks/useGarages';
import QuoteModal from '@/components/QuoteModal';
import FavoriteButton from '@/components/FavoriteButton';
import { Skeleton } from '@/components/ui/skeleton';
import { getDistanceKm } from '@/hooks/useGeolocation';
import PriceFairnessIndicator from '@/components/PriceFairnessIndicator';

const QualityBar = ({ label, value }: { label: string; value: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="font-mono-data text-[11px] text-foreground font-semibold">{value}%</span>
    </div>
    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

type SortMode = 'score' | 'reviews' | 'distance';

interface ReviewCardsProps {
  searchQuery?: string;
  activeFilter?: string;
  userPosition?: { lat: number; lng: number } | null;
  radius?: number | null;
  selectedCity?: string;
  minRating?: number;
}

const ReviewCards = ({ searchQuery = '', activeFilter = 'all', userPosition, radius, selectedCity, minRating = 0 }: ReviewCardsProps) => {
  const [sortBy, setSortBy] = useState<SortMode>('score');
  const [quoteGarage, setQuoteGarage] = useState<{ name: string; id: string } | null>(null);
  const { data: garages, isLoading } = useGarages();

  if (isLoading) {
    return (
      <section className="px-4 py-5 max-w-lg mx-auto lg:max-w-none lg:px-0">
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      </section>
    );
  }

  const garagesWithScore = (garages || []).map(g => ({
    ...g,
    score: calculateTrustmarqScore(g.rating, g.reviews),
  }));

  const filtered = garagesWithScore.filter(g => {
    // City filter
    if (selectedCity) {
      const isMatch = g.address.toLowerCase().includes(selectedCity.toLowerCase());
      if (!isMatch) return false;
    }
    // Rating filter
    if (minRating > 0 && g.rating < minRating) {
      return false;
    }
    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = g.name.toLowerCase().includes(q) ||
        g.brand.toLowerCase().includes(q) ||
        g.address.toLowerCase().includes(q) ||
        g.specialty.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    // Vehicle type filter
    const vehicleFilters = ['voiture', 'moto', 'trottinette', 'camion', 'velo'];
    if (vehicleFilters.includes(activeFilter)) {
      const types = g.vehicleTypes;
      if (!types || !types.includes(activeFilter)) return false;
    } else if ((SERVICE_TYPES as readonly string[]).includes(activeFilter)) {
      // Service type filter
      const services = g.serviceTypes;
      if (!services || !services.includes(activeFilter)) return false;
    } else if (activeFilter !== 'all') {
      // Category filter (specialty)
      const filterOption = FILTER_OPTIONS.find(f => f.id === activeFilter);
      if (filterOption) {
        const haystack = `${g.specialty} ${g.name} ${g.badges.join(' ')} ${g.type} ${g.keyInsight}`.toLowerCase();
        return filterOption.keywords.some(kw => haystack.includes(kw));
      }
    }
    return true;
  }).filter(g => {
    if (userPosition && radius) {
      return getDistanceKm(userPosition.lat, userPosition.lng, g.coords.lat, g.coords.lng) <= radius;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'distance' && userPosition) {
      return getDistanceKm(userPosition.lat, userPosition.lng, a.coords.lat, a.coords.lng) -
             getDistanceKm(userPosition.lat, userPosition.lng, b.coords.lat, b.coords.lng);
    }
    return sortBy === 'reviews' ? b.reviews - a.reviews : b.score - a.score;
  });

  return (
    <section className="px-4 py-5 max-w-lg mx-auto lg:max-w-none lg:px-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base md:text-lg font-bold tracking-tight text-foreground">
          Top Rated {searchQuery && <span className="text-muted-foreground font-normal text-sm">· "{searchQuery}"</span>}
        </h2>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortMode)}>
            <SelectTrigger className="h-8 w-[160px] text-xs bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Meilleur Score</SelectItem>
              <SelectItem value="reviews">Plus d'avis</SelectItem>
              {userPosition && <SelectItem value="distance">Plus proche</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-1 lg:gap-3">
        {sorted.map((garage, index) => {
          const InsightIcon = garage.insightIcon;
          return (
            <motion.div
              key={garage.slug}
              className="surface-card p-4 md:p-5 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: [0.2, 0, 0, 1] }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm md:text-base font-semibold text-foreground leading-tight">{garage.name}</h3>
                    {garage.verified && <BadgeCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" />}
                    <FavoriteButton garageId={garage.id} size="sm" className="ml-auto -mr-2 -mt-1" />
                  </div>
                  <p className="text-muted-foreground text-[11px] md:text-xs mt-0.5">
                    {garage.specialty} · <span className="font-semibold">{garage.priceLevel}</span>
                    {userPosition && (
                      <span className="ml-1.5 inline-flex items-center gap-0.5 text-primary">
                        <MapPin className="w-2.5 h-2.5" />
                        {getDistanceKm(userPosition.lat, userPosition.lng, garage.coords.lat, garage.coords.lng)} km
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-mono-data text-base md:text-lg font-bold text-foreground">{garage.rating}</span>
                  </div>
                  <span className="text-[10px] md:text-xs text-muted-foreground">{garage.reviews} avis</span>
                </div>
              </div>

              <PriceFairnessIndicator garageRating={garage.rating} garageName={garage.name} compact />

              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] md:text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                  <ShieldCheck className="w-3 h-3" />
                  Score: {garage.score}/100
                </span>
                <span className={`text-[10px] md:text-xs font-medium px-2.5 py-1 rounded-full border ${
                  garage.type === 'dealer' 
                    ? 'text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20 bg-[hsl(var(--warning))]/10'
                    : 'text-muted-foreground border-border'
                }`}>
                  {garage.type === 'dealer' ? 'Concession' : 'Indépendant'}
                </span>
                {garage.badges.map(badge => (
                  <span key={badge} className="text-[10px] md:text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-full border border-border">
                    {badge}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[hsl(var(--success))]/8 border border-[hsl(var(--success))]/15">
                <InsightIcon className="w-4 h-4 text-[hsl(var(--success))] shrink-0" />
                <span className="text-xs text-[hsl(var(--success))] font-semibold">{garage.keyInsight}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Gauge className="w-3 h-3 text-muted-foreground" />
                  <span className="label-xs text-muted-foreground">Qualité de service</span>
                </div>
                <QualityBar label="Rapidité" value={garage.quality.speed} />
                <QualityBar label="Propreté" value={garage.quality.cleanliness} />
                <QualityBar label="Transparence" value={garage.quality.transparency} />
              </div>

              <div className="p-2.5 rounded-xl bg-secondary/50 border-l-2 border-primary/40">
                <div className="flex items-start gap-2">
                  <Eye className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] md:text-xs text-foreground/70 italic leading-relaxed">
                    "{garage.quote}"
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <a href={`tel:${garage.phone}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Phone className="w-3.5 h-3.5" />
                    Appeler
                  </Button>
                </a>
                <Button size="sm" className="flex-1 text-xs" onClick={() => setQuoteGarage({ name: garage.name, id: garage.id })}>
                  <FileText className="w-3.5 h-3.5" />
                  Demander un devis
                </Button>
              </div>

              <Link to={`/garage/${garage.slug}`}>
                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-foreground">
                  Voir la fiche complète →
                </Button>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <QuoteModal
        open={!!quoteGarage}
        onClose={() => setQuoteGarage(null)}
        garageName={quoteGarage?.name || ''}
        garageId={quoteGarage?.id}
      />
    </section>
  );
};

export default ReviewCards;
