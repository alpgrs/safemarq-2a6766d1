import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Star, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useGarages } from '@/hooks/useGarages';
import FavoriteButton from '@/components/FavoriteButton';

const Favorites = () => {
  const { user } = useAuth();
  const { data: favoriteIds = [], isLoading: loadingFavs } = useFavorites();
  const { data: garages = [], isLoading: loadingGarages } = useGarages();

  const favoriteGarages = garages.filter(g => favoriteIds.includes(g.id));

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-lg font-semibold text-foreground">Connectez-vous pour voir vos favoris</p>
          <Link to="/auth">
            <Button>Se connecter</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isLoading = loadingFavs || loadingGarages;

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Retour</span>
          </Link>
          <h1 className="text-base font-bold text-foreground">Mes favoris</h1>
        </div>
      </header>

      <main className="pt-14 pb-24 md:pb-12 max-w-4xl mx-auto px-4">
        {isLoading ? (
          <div className="space-y-3 pt-5">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : favoriteGarages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Heart className="w-10 h-10 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Aucun favori pour le moment</p>
            <Link to="/">
              <Button variant="outline" size="sm">Découvrir des garages</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3 pt-5">
            {favoriteGarages.map((garage, index) => (
              <motion.div
                key={garage.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
              >
                <Link to={`/garage/${garage.slug}`} className="block">
                  <div className="surface-card p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors">
                    <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden shrink-0">
                      {garage.images[0] && (
                        <img src={garage.images[0]} alt={garage.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-semibold text-foreground truncate">{garage.name}</h3>
                        {garage.verified && <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{garage.specialty} · {garage.address}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-foreground">{garage.rating}</span>
                        <span className="text-[10px] text-muted-foreground">({garage.reviews} avis)</span>
                      </div>
                    </div>
                    <FavoriteButton garageId={garage.id} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
