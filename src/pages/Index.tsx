import Seo from '@/components/Seo';
import SafemarqHeader from '@/components/safemarq/SafemarqHeader';
import SafemarqHero from '@/components/safemarq/SafemarqHero';
import TopRegions from '@/components/safemarq/TopRegions';
import ChainsVsIndependents from '@/components/safemarq/ChainsVsIndependents';
import TradesGrid from '@/components/safemarq/TradesGrid';
import TopRatedThisWeek from '@/components/safemarq/TopRatedThisWeek';
import Methodology from '@/components/safemarq/Methodology';
import BelgianMarket from '@/components/safemarq/BelgianMarket';
import ProSection from '@/components/safemarq/ProSection';
import SafemarqFooter from '@/components/safemarq/SafemarqFooter';
import { useLandingStats } from '@/hooks/useLandingStats';

const Index = () => {
  const { data: stats } = useLandingStats();
  const count = stats?.garages && stats.garages > 50 ? stats.garages : 8420;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F0F0F]">
      <Seo
        title="SafeMarq — Comparez les garages et carrossiers en Belgique"
        description="8 000+ garages, carrossiers et spécialistes auto comparés en Belgique. Avis Google vérifiés, score indépendant, tous corps de métier."
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'SafeMarq',
            url: 'https://safemarq.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://safemarq.com/?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'SafeMarq',
            url: 'https://safemarq.com',
            description:
              'Comparateur indépendant de garages et carrossiers en Belgique. Tous corps de métier, avis Google vérifiés.',
            areaServed: 'BE',
          },
        ]}
      />
      <SafemarqHeader />
      <main>
        <SafemarqHero count={count} />
        <TopRegions />
        <ChainsVsIndependents />
        <TradesGrid />
        <TopRatedThisWeek />
        <Methodology />
        <BelgianMarket />
        <ProSection />
      </main>
      <SafemarqFooter />
    </div>
  );
};

export default Index;
