import { Star, TrendingDown, BadgeCheck, Calendar, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGarages, calculateTrustmarqScore, Garage } from '@/hooks/useGarages';
import { Skeleton } from '@/components/ui/skeleton';

type ViewMode = 'side' | 'dealer' | 'specialist';

const ComparisonEngine = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('side');
  const { data: garages, isLoading } = useGarages();

  if (isLoading) {
    return (
      <section className="px-4 py-5 max-w-lg mx-auto lg:max-w-none lg:px-0">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </section>
    );
  }

  if (!garages?.length) return null;

  const dealer = garages.find(g => g.type === 'dealer')!;
  const independent = garages.filter(g => g.type === 'independent').sort((a, b) => b.rating - a.rating)[0];

  if (!dealer || !independent) return null;

  const dealerScore = calculateTrustmarqScore(dealer.rating, dealer.reviews);
  const indepScore = calculateTrustmarqScore(independent.rating, independent.reviews);

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i <= Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : i <= rating
                ? 'fill-amber-400/40 text-amber-400/40'
                : 'text-border'
          }`}
        />
      ))}
    </div>
  );

  const renderCard = (garage: Garage, score: number, isHighlighted: boolean) => (
    <motion.div
      className={`surface-card p-4 relative transition-all duration-200 ${isHighlighted ? 'border-primary/30' : ''}`}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: isHighlighted ? 0.1 : 0.05 }}
    >
      {isHighlighted && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
          <BadgeCheck className="w-3 h-3" />
          Vérifié
        </div>
      )}

      <div className={`flex items-center justify-between mb-3 ${isHighlighted ? 'mt-1' : ''}`}>
        <div className={`w-8 h-8 rounded-lg ${isHighlighted ? 'bg-primary/10' : 'bg-secondary'} flex items-center justify-center`}>
          <span className={`${isHighlighted ? 'text-primary' : 'text-muted-foreground'} font-bold text-[9px]`}>
            {garage.brand.slice(0, 4).toUpperCase()}
          </span>
        </div>
        {renderStars(garage.rating)}
      </div>

      <h3 className="text-sm font-semibold text-foreground leading-tight">{garage.name}</h3>
      <p className="text-muted-foreground text-[11px] mt-0.5 mb-2">{garage.specialty}</p>

      <div className="space-y-1.5 mb-3">
        <div className="flex justify-between text-[11px]">
          <span className="text-muted-foreground">Note Google</span>
          <span className="text-foreground font-semibold">{garage.rating} / 5</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-muted-foreground">Score Trustmarq</span>
          <span className={`font-bold inline-flex items-center gap-1 ${isHighlighted ? 'text-primary' : 'text-foreground'}`}>
            <ShieldCheck className="w-3 h-3" />
            {score} / 100
          </span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-muted-foreground">Niveau de prix</span>
          <span className={`font-semibold ${garage.priceLevel === '€€€' ? 'text-destructive' : 'text-[hsl(var(--success))]'}`}>
            {garage.priceLevel}
          </span>
        </div>
      </div>

      {isHighlighted && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20 mb-3">
          <TrendingDown className="w-3.5 h-3.5 text-[hsl(var(--success))] shrink-0" />
          <span className="text-[11px] text-[hsl(var(--success))] font-semibold">{garage.keyInsight}</span>
        </div>
      )}

      <div className="p-2 rounded-lg bg-secondary/60 mb-3">
        <p className="text-[11px] text-muted-foreground italic leading-relaxed">
          "{garage.quote}"
        </p>
      </div>

      <Button variant={isHighlighted ? 'default' : 'outline'} size="sm" className="w-full text-xs">
        <Calendar className="w-3 h-3" />
        Voir les dispos
      </Button>
    </motion.div>
  );

  return (
    <section className="px-4 py-5 max-w-lg mx-auto lg:max-w-none lg:px-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base md:text-lg font-bold tracking-tight text-foreground">Concession vs Indépendant</h2>
          <p className="text-muted-foreground text-xs md:text-sm mt-0.5">Basé sur les avis Google vérifiés</p>
        </div>
        <div className="flex bg-card rounded-full p-0.5 border border-border">
          {(['side', 'dealer', 'specialist'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-150 ${
                viewMode === mode
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {mode === 'side' ? 'VS' : mode === 'dealer' ? 'Concess.' : 'Indép.'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          className={`grid gap-3 ${viewMode === 'side' ? 'grid-cols-2' : 'grid-cols-1'}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        >
          {(viewMode === 'side' || viewMode === 'dealer') && renderCard(dealer, dealerScore, false)}
          {(viewMode === 'side' || viewMode === 'specialist') && renderCard(independent, indepScore, true)}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default ComparisonEngine;
