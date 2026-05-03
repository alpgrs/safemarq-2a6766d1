import { useState } from 'react';
import StickyHeader from '@/components/StickyHeader';
import SearchHero from '@/components/SearchHero';
import FilterChips from '@/components/FilterChips';
import ComparisonEngine from '@/components/ComparisonEngine';
import ReviewCards from '@/components/ReviewCards';
import BottomNav from '@/components/BottomNav';
import HomeMap from '@/components/HomeMap';
import QuoteComparator from '@/components/QuoteComparator';
import Seo from '@/components/Seo';
import Footer from '@/components/Footer';
import { useGarages } from '@/hooks/useGarages';
import { useGeolocation } from '@/hooks/useGeolocation';

const RADIUS_OPTIONS = [5, 10, 25, 50, null] as const;
export type RadiusKm = typeof RADIUS_OPTIONS[number];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [radius, setRadius] = useState<RadiusKm>(null);
  const { data: garages } = useGarages();
  const { position, loading, error, requestLocation, clearLocation } = useGeolocation();

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Seo
        title="Trustmarq — Comparez les garages automobiles en Belgique"
        description="Trouvez et comparez les meilleurs garages automobiles près de chez vous. Avis vérifiés, devis instantanés, score de confiance Trustmarq."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Trustmarq',
          url: typeof window !== 'undefined' ? window.location.origin : '',
          potentialAction: {
            '@type': 'SearchAction',
            target: '/?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <StickyHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="pb-20 md:pb-8 md:pt-4">
        <SearchHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <FilterChips 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          minRating={minRating}
          onRatingChange={setMinRating}
        />

        {/* Interactive map section */}
        <div className="px-4 max-w-6xl mx-auto lg:px-6 xl:px-8 mb-4">
          <HomeMap
            garages={garages || []}
            userPosition={position}
            loading={loading}
            error={error}
            onRequestLocation={requestLocation}
            onClearLocation={clearLocation}
            radius={radius}
            onRadiusChange={setRadius}
            selectedCity={selectedCity}
            minRating={minRating}
          />
        </div>

        <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-5 lg:gap-6 lg:px-6 xl:px-8">
          <div className="lg:col-span-2">
            <ComparisonEngine />
          </div>
          <div className="lg:col-span-3">
            <ReviewCards 
              searchQuery={searchQuery} 
              activeFilter={activeFilter} 
              userPosition={position} 
              radius={radius}
              selectedCity={selectedCity}
              minRating={minRating}
            />
          </div>
        </div>

        {/* Quote Comparator Section */}
        <QuoteComparator />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
