import { Search, X, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGarages } from '@/hooks/useGarages';
import { LogoMark } from '@/components/Logo';

interface HeroLaunchProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onLocateMe: () => void;
  locating?: boolean;
}

const HeroLaunch = ({ searchQuery, onSearchChange, onLocateMe, locating }: HeroLaunchProps) => {
  const { data: garages } = useGarages();
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!garages) return { brands: [] as string[], cities: [] as string[] };
    const brands = [...new Set(garages.map((g) => g.brand).filter(Boolean))] as string[];
    const cities = [
      ...new Set(
        garages
          .map((g) => {
            const parts = g.address.split(',');
            return parts[parts.length - 1]?.trim() || '';
          })
          .filter(Boolean),
      ),
    ];
    return { brands, cities };
  }, [garages]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return { brands: suggestions.brands.slice(0, 5), cities: suggestions.cities.slice(0, 5) };
    const q = searchQuery.toLowerCase();
    return {
      brands: suggestions.brands.filter((b) => b.toLowerCase().includes(q)).slice(0, 5),
      cities: suggestions.cities.filter((c) => c.toLowerCase().includes(q)).slice(0, 5),
    };
  }, [searchQuery, suggestions]);

  const showDropdown = focused && (filtered.brands.length > 0 || filtered.cities.length > 0);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <section className="relative px-4 md:px-6 pt-28 md:pt-32 pb-12 md:pb-20 overflow-hidden">
      {/* Background ambient */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute top-40 right-10 w-72 h-72 rounded-full bg-primary/5 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Comparateur indépendant — Belgique 🇧🇪
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground text-balance leading-[1.05]"
        >
          Le garage de confiance,
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            vérifié par les vrais conducteurs.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mt-5 leading-relaxed"
        >
          Comparez concessions et indépendants côte à côte. Avis vérifiés, devis instantanés,
          score SAFEMARQ transparent.
        </motion.p>

        {/* Search */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25 }}
          className="relative max-w-2xl mx-auto mt-10"
        >
          <div
            className={`flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-card border-2 transition-all ${
              focused ? 'border-primary/60 shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.3)]' : 'border-border'
            }`}
          >
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Cherchez par ville ou marque…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setFocused(true)}
              className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-full text-base py-2"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-muted-foreground hover:text-foreground transition-colors p-2"
                aria-label="Effacer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onLocateMe}
              disabled={locating}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              <MapPin className="w-4 h-4" />
              {locating ? '…' : 'Près de moi'}
            </button>
          </div>

          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-50 top-full mt-2 w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-left"
            >
              {filtered.brands.length > 0 && (
                <div className="p-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 py-1.5 font-semibold">
                    Marques
                  </p>
                  {filtered.brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => {
                        onSearchChange(brand);
                        setFocused(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary/60 rounded-lg transition-colors"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              )}
              {filtered.cities.length > 0 && (
                <div className="p-2 border-t border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 py-1.5 font-semibold">
                    Villes
                  </p>
                  {filtered.cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        onSearchChange(city);
                        setFocused(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary/60 rounded-lg transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          <div className="sm:hidden mt-3">
            <button
              onClick={onLocateMe}
              disabled={locating}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              <MapPin className="w-4 h-4" />
              {locating ? 'Localisation…' : 'Garages près de moi'}
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-5 flex items-center justify-center gap-3 flex-wrap">
            <span>Gratuit</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span>Sans inscription</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span className="inline-flex items-center gap-1.5">
              <LogoMark size={14} /> 100% indépendant
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroLaunch;
