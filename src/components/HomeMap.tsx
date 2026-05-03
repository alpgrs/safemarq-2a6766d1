import { motion } from 'framer-motion';
import { MapPin, Navigation, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Garage } from '@/hooks/useGarages';
import { getDistanceKm } from '@/hooks/useGeolocation';
import { Link } from 'react-router-dom';
import LeafletMapView, { garageMarkerIcon, userLocationIcon } from '@/components/maps/LeafletMapView';

interface HomeMapProps {
  garages: Garage[];
  userPosition: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
  onRequestLocation: () => void;
  onClearLocation: () => void;
  radius: number | null;
  onRadiusChange: (r: number | null) => void;
  selectedCity?: string;
  minRating?: number;
}

const RADIUS_OPTIONS = [5, 10, 25, 50] as const;

const escapeHtml = (value: string) =>
  value
    .split('&').join('&amp;')
    .split('<').join('&lt;')
    .split('>').join('&gt;')
    .split('"').join('&quot;')
    .split("'").join('&#39;');

const HomeMap = ({ garages, userPosition, loading, error, onRequestLocation, onClearLocation, radius, onRadiusChange, selectedCity, minRating = 0 }: HomeMapProps) => {
  const defaultCenter: [number, number] = [46.6, 2.5];

  const visibleGarages = garages.filter(g => {
    if (selectedCity && !g.address.toLowerCase().includes(selectedCity.toLowerCase())) {
      return false;
    }
    if (minRating > 0 && g.rating < minRating) {
      return false;
    }
    if (userPosition && radius) {
      return getDistanceKm(userPosition.lat, userPosition.lng, g.coords.lat, g.coords.lng) <= radius;
    }
    return true;
  });

  const markers = [
    ...(userPosition
      ? [{
          id: 'user-location',
          position: userPosition,
          popupHtml: '<span style="font-size:12px;font-weight:600">Votre position</span>',
          icon: userLocationIcon,
        }]
      : []),
    ...visibleGarages.map((garage) => ({
      id: garage.id,
      position: garage.coords,
      icon: garageMarkerIcon,
      popupHtml: `
        <div style="min-width:160px">
          <p style="font-size:12px;font-weight:700;margin:0 0 2px 0">${escapeHtml(garage.name)}</p>
          <p style="font-size:10px;color:#6b7280;margin:0">${escapeHtml(garage.specialty)}</p>
          ${userPosition ? `<p style="font-size:10px;color:#2563eb;font-weight:600;margin:2px 0 0 0">${getDistanceKm(userPosition.lat, userPosition.lng, garage.coords.lat, garage.coords.lng)} km</p>` : ''}
          <a href="/garage/${garage.slug}" style="font-size:10px;color:#3b82f6;font-weight:600;margin-top:4px;display:block;text-decoration:none">Voir la fiche →</a>
        </div>
      `,
    })),
  ];

  const fitPoints = markers.map((marker) => [marker.position.lat, marker.position.lng] as [number, number]);

  return (
    <motion.div
      className="surface-card overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      <div className="p-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Carte des garages</span>
          {userPosition && radius && (
            <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {visibleGarages.length} garage{visibleGarages.length !== 1 ? 's' : ''} dans {radius} km
            </span>
          )}
          {userPosition && !radius && (
            <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              Autour de vous
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {userPosition && (
            <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2" onClick={onClearLocation}>
              <X className="w-3 h-3 mr-1" />
              Réinitialiser
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] px-2.5"
            onClick={onRequestLocation}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Navigation className="w-3 h-3 mr-1" />
            )}
            {userPosition ? 'Actualiser' : 'Me localiser'}
          </Button>
        </div>
      </div>

      {userPosition && (
        <div className="px-3 py-2 flex items-center gap-2 border-b border-border overflow-x-auto scrollbar-hide">
          <span className="text-[10px] text-muted-foreground font-semibold shrink-0">Rayon :</span>
          {([null, ...RADIUS_OPTIONS] as const).map((r) => (
            <button
              key={r ?? 'all'}
              onClick={() => onRadiusChange(r)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors ${
                radius === r
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent text-muted-foreground border-border hover:border-foreground/20'
              }`}
            >
              {r === null ? 'Tous' : `${r} km`}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="px-3 py-2 text-[11px] text-destructive bg-destructive/10 border-b border-destructive/20">
          {error}
        </div>
      )}

      <div className="relative aspect-[16/9] md:aspect-[21/9] z-0">
        <LeafletMapView
          center={defaultCenter}
          zoom={6}
          markers={markers}
          fitPoints={fitPoints}
          className="w-full h-full"
          style={{ background: 'hsl(217 33% 17%)' }}
          maxFitZoom={12}
          scrollWheelZoom={false}
        />
      </div>

      {userPosition && visibleGarages.length > 0 && (
        <div className="p-3 border-t border-border">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
            {radius ? `Garages dans ${radius} km` : 'Distance depuis votre position'}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[...visibleGarages]
              .sort((a, b) =>
                getDistanceKm(userPosition.lat, userPosition.lng, a.coords.lat, a.coords.lng) -
                getDistanceKm(userPosition.lat, userPosition.lng, b.coords.lat, b.coords.lng)
              )
              .map((g) => (
                <Link
                  key={g.id}
                  to={`/garage/${g.slug}`}
                  className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
                >
                  <div>
                    <p className="text-[11px] font-semibold text-foreground whitespace-nowrap">{g.name}</p>
                    <p className="text-[10px] text-primary font-bold">
                      {getDistanceKm(userPosition.lat, userPosition.lng, g.coords.lat, g.coords.lng)} km
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HomeMap;
