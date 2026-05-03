import { BadgeCheck, Shield, TrendingUp, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGarages } from '@/hooks/useGarages';
import { useMemo, useState, useRef, useEffect } from 'react';

interface SearchHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchHero = ({ searchQuery, onSearchChange }: SearchHeroProps) => {
  const { data: garages } = useGarages();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract unique brands and cities for suggestions
  const suggestions = useMemo(() => {
    if (!garages) return { brands: [], cities: [] };
    const brands = [...new Set(garages.map(g => g.brand).filter(Boolean))] as string[];
    const cities = [...new Set(garages.map(g => {
      const parts = g.address.split(',');
      return parts[parts.length - 1]?.trim() || '';
    }).filter(Boolean))];
    return { brands, cities };
  }, [garages]);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return { brands: suggestions.brands, cities: suggestions.cities };
    const q = searchQuery.toLowerCase();
    return {
      brands: suggestions.brands.filter(b => b.toLowerCase().includes(q)),
      cities: suggestions.cities.filter(c => c.toLowerCase().includes(q)),
    };
  }, [searchQuery, suggestions]);

  const showDropdown = focused && (filteredSuggestions.brands.length > 0 || filteredSuggestions.cities.length > 0);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <section className="px-4 md:px-6 pt-28 md:pt-24 pb-4 md:pb-8 max-w-6xl mx-auto">
      <motion.div
        className="space-y-4 text-center md:text-left md:flex md:items-center md:justify-between md:gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
      >
        <div className="md:flex-1 space-y-4">
          <div>
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground text-balance leading-snug"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0, 0, 1] }}
            >
              Find the best garage.
              <br />
              <span className="text-primary">Verified by real reviews.</span>
            </motion.h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-[420px] mx-auto md:mx-0 mt-3 leading-relaxed">
              Compare dealerships and independents side-by-side. Save money, get better service.
            </p>
          </div>

          {/* Search bar */}
          <motion.div
            ref={containerRef}
            className="relative max-w-md mx-auto md:mx-0"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-card border transition-colors ${focused ? 'border-primary/50 shadow-lg shadow-primary/5' : 'border-border'}`}>
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Rechercher par marque ou ville..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setFocused(true)}
                className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-full text-sm"
              />
              {searchQuery && (
                <button onClick={() => onSearchChange('')} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-50 top-full mt-2 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden"
              >
                {filteredSuggestions.brands.length > 0 && (
                  <div className="p-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1 font-semibold">Marques</p>
                    {filteredSuggestions.brands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => { onSearchChange(brand); setFocused(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary/60 rounded-lg transition-colors"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                )}
                {filteredSuggestions.cities.length > 0 && (
                  <div className="p-2 border-t border-border">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1 font-semibold">Villes</p>
                    {filteredSuggestions.cities.map(city => (
                      <button
                        key={city}
                        onClick={() => { onSearchChange(city); setFocused(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary/60 rounded-lg transition-colors"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Trust indicators */}
        <div className="flex justify-center md:justify-end gap-5 md:gap-6 pt-2 md:pt-0">
          {[
            { icon: BadgeCheck, label: 'Verified reviews' },
            { icon: Shield, label: 'Transparent pricing' },
            { icon: TrendingUp, label: 'Save up to 40%' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground font-medium">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default SearchHero;
