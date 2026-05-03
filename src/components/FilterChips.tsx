import { Zap, Wrench, PaintBucket, AlertTriangle, Cog, Car, Bike, Truck, BatteryCharging, Eye, MapPin, Star } from 'lucide-react';
import { useGarages } from '@/hooks/useGarages';
import { useMemo } from 'react';

export const FILTER_OPTIONS = [
  { id: 'all', label: 'Tous', icon: null, keywords: [] as string[] },
  { id: 'voiture', label: 'Voiture', icon: Car, keywords: ['voiture', 'car', 'auto'] },
  { id: 'moto', label: 'Moto', icon: Bike, keywords: ['moto', 'motorcycle', 'deux-roues'] },
  { id: 'trottinette', label: 'Trottinette', icon: Zap, keywords: ['trottinette', 'scooter', 'électrique'] },
  { id: 'camion', label: 'Camion', icon: Truck, keywords: ['camion', 'truck', 'poids lourd', 'utilitaire'] },
  { id: 'velo', label: 'Vélo élec.', icon: BatteryCharging, keywords: ['vélo', 'velo', 'e-bike', 'ebike'] },
  { id: 'ev', label: 'EV Specialist', icon: Zap, keywords: ['ev', 'électrique', 'hybride', 'electric'] },
  { id: 'mechanic', label: 'Mécanique', icon: Wrench, keywords: ['mécanique', 'mechanic', 'entretien', 'réparation', 'vidange'] },
  { id: 'body', label: 'Carrosserie', icon: PaintBucket, keywords: ['carrosserie', 'bodywork', 'peinture'] },
  { id: 'emergency', label: 'Urgence', icon: AlertTriangle, keywords: ['urgence', 'emergency', 'dépannage', 'remorquage'] },
  { id: 'parts', label: 'Pièces OEM', icon: Cog, keywords: ['oem', 'officiel', 'pièces', 'parts', 'concession'] },
  { id: 'entretien', label: 'Entretien', icon: Wrench, keywords: ['entretien', 'révision', 'vidange'] },
  { id: 'reparation', label: 'Réparation', icon: Cog, keywords: ['réparation', 'moteur', 'freins'] },
  { id: 'carrosserie', label: 'Carrosserie', icon: PaintBucket, keywords: ['carrosserie', 'peinture', 'châssis'] },
  { id: 'pneus', label: 'Pneus', icon: Cog, keywords: ['pneus', 'pneumatiques', 'équilibrage'] },
  { id: 'diagnostic', label: 'Diagnostic', icon: Eye, keywords: ['diagnostic', 'électronique', 'valise'] },
];

export const SERVICE_TYPES = ['entretien', 'reparation', 'carrosserie', 'pneus', 'diagnostic'] as const;
export type ServiceType = typeof SERVICE_TYPES[number];

export const VEHICLE_TYPES = ['voiture', 'moto', 'trottinette', 'camion', 'velo'] as const;
export type VehicleType = typeof VEHICLE_TYPES[number];

interface FilterChipsProps {
  activeFilter: string;
  onFilterChange: (id: string) => void;
  selectedCity?: string;
  onCityChange?: (city: string) => void;
  minRating?: number;
  onRatingChange?: (rating: number) => void;
}

const FilterChips = ({ activeFilter, onFilterChange, selectedCity, onCityChange, minRating, onRatingChange }: FilterChipsProps) => {
  const { data: garages } = useGarages();

  const cities = useMemo(() => {
    if (!garages) return [];
    return [...new Set(garages.map(g => {
      const parts = g.address.split(',');
      return parts[parts.length - 1]?.trim() || '';
    }).filter(Boolean))].sort();
  }, [garages]);

  return (
    <section className="px-4 md:px-6 py-3 max-w-6xl mx-auto space-y-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-secondary/50 border border-border shrink-0">
          <MapPin className="w-3 h-3 text-primary" />
          <select 
            value={selectedCity || ''} 
            onChange={(e) => onCityChange?.(e.target.value)}
            className="bg-transparent border-none outline-none text-xs font-medium text-foreground cursor-pointer"
          >
            <option value="">Toutes les villes</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <div className="w-px h-4 bg-border shrink-0 mx-1" />
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-secondary/50 border border-border shrink-0">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <select 
            value={minRating || 0} 
            onChange={(e) => onRatingChange?.(Number(e.target.value))}
            className="bg-transparent border-none outline-none text-xs font-medium text-foreground cursor-pointer"
          >
            <option value={0}>Toutes les notes</option>
            <option value={3}>3+ étoiles</option>
            <option value={4}>4+ étoiles</option>
            <option value={4.5}>4.5+ étoiles</option>
          </select>
        </div>
        <div className="w-px h-4 bg-border shrink-0 mx-1" />
        {FILTER_OPTIONS.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`
                flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap shrink-0 border
                ${isActive
                  ? 'bg-primary text-primary-foreground border-primary font-semibold'
                  : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/20'
                }
              `}
            >
              {Icon && <Icon className="w-3 h-3" />}
              {filter.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default FilterChips;
