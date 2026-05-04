import { useRef, useState } from 'react';
import StickyHeader from '@/components/StickyHeader';
import FilterChips from '@/components/FilterChips';
import ComparisonEngine from '@/components/ComparisonEngine';
import ReviewCards from '@/components/ReviewCards';
import BottomNav from '@/components/BottomNav';
import HomeMap from '@/components/HomeMap';
import QuoteComparator from '@/components/QuoteComparator';
import Seo from '@/components/Seo';
import Footer from '@/components/Footer';
import HeroLaunch from '@/components/landing/HeroLaunch';
import TrustStrip from '@/components/landing/TrustStrip';
import HowItWorks from '@/components/landing/HowItWorks';
import MethodSection from '@/components/landing/MethodSection';
import Testimonials from '@/components/landing/Testimonials';
import SplitCTA from '@/components/landing/SplitCTA';
import FaqSection from '@/components/landing/FaqSection';
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
  const searchSectionRef = useRef<HTMLDivElement>(null);

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLocateMe = () => {
    requestLocation();
    setTimeout(scrollToSearch, 300);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Seo
        title="SAFEMARQ — Comparez les garages automobiles en Belgique"
        description="Trouvez et comparez les meilleurs garages automobiles près de chez vous. Avis vérifiés, devis instantanés, score de confiance SAFEMARQ."
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'SAFEMARQ',
            url: typeof window !== 'undefined' ? window.location.origin : '',
            potentialAction: {
              '@type': 'SearchAction',
              target: '/?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'SAFEMARQ',
            url: typeof window !== 'undefined' ? window.location.origin : '',
            logo: typeof window !== 'undefined' ? `${window.location.origin}/safemarq-icon.png` : '',
            description:
              'Comparateur indépendant de garages automobiles en Belgique. Avis vérifiés et score de confiance transparent.',
          },
        ]}
      />
      <StickyHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="pb-20 md:pb-8">
        <HeroLaunch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onLocateMe={handleLocateMe}
          locating={loading}
        />

        <TrustStrip />

        <HowItWorks />

        {/* Search/explore section */}
        <div ref={searchSectionRef} className="scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 md:px-6 mb-6 md:mb-8">
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-2">
              L'outil
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Explorez les garages près de chez vous.
            </h2>
          </div>

          <FilterChips
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            minRating={minRating}
            onRatingChange={setMinRating}
          />

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

          <QuoteComparator />
        </div>

        <MethodSection />
        <Testimonials />
        <SplitCTA onScrollToSearch={scrollToSearch} />
        <FaqSection />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
