import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, BadgeCheck, MapPin, Phone, Globe, ShieldCheck, FileText, Car, Bike, Truck, Zap, BatteryCharging, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import BookingForm from '@/components/garage/BookingForm';
import GarageGallery from '@/components/garage/GarageGallery';
import GarageHours from '@/components/garage/GarageHours';
import GarageMap from '@/components/garage/GarageMap';
import GarageReviews from '@/components/garage/GarageReviews';
import QuoteModal from '@/components/QuoteModal';
import Seo from '@/components/Seo';
import { useGarage, calculateTrustmarqScore } from '@/hooks/useGarages';
import { useGarageHasOwner } from '@/hooks/useGarageClaims';
import FavoriteButton from '@/components/FavoriteButton';
import { Skeleton } from '@/components/ui/skeleton';

const GarageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const { data: garage, isLoading } = useGarage(id || '');
  const { data: hasOwner } = useGarageHasOwner(garage?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-14 px-4">
        <Skeleton className="h-64 rounded-2xl mb-4" />
        <Skeleton className="h-8 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!garage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold text-foreground">Garage non trouvé</p>
          <Link to="/">
            <Button variant="outline">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  const score = calculateTrustmarqScore(garage.rating, garage.reviews);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: garage.name,
    image: garage.images?.[0],
    address: { '@type': 'PostalAddress', streetAddress: garage.address, addressCountry: 'BE' },
    telephone: garage.phone,
    url: garage.website,
    geo: garage.coords ? { '@type': 'GeoCoordinates', latitude: garage.coords.lat, longitude: garage.coords.lng } : undefined,
    aggregateRating: garage.reviews > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: garage.rating,
      reviewCount: garage.reviews,
      bestRating: 5,
    } : undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${garage.name} — Avis & devis`}
        description={`${garage.name} à ${garage.address}. ${garage.reviews} avis · note ${garage.rating}/5. Demandez un devis en ligne.`}
        type="profile"
        image={garage.images?.[0]}
        jsonLd={jsonLd}
      />
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Retour</span>
          </Link>
        </div>
      </header>

      <main className="pt-14 pb-24 md:pb-12">
        <GarageGallery images={garage.images} name={garage.name} />

        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <motion.div
            className="py-5 space-y-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">{garage.name}</h1>
                  {garage.verified && <BadgeCheck className="w-5 h-5 text-primary shrink-0" />}
                  <FavoriteButton garageId={garage.id} />
                </div>
                <p className="text-muted-foreground text-sm mt-0.5">{garage.specialty} · {garage.priceLevel}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-mono-data text-xl font-bold text-foreground">{garage.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">{garage.reviews} avis</span>
              </div>
            </div>

            <p className="text-sm text-foreground/70 leading-relaxed">{garage.description}</p>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Score: {score}/100
              </span>
              {hasOwner && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Fiche revendiquée
                </span>
              )}
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${
                garage.type === 'dealer'
                  ? 'text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20 bg-[hsl(var(--warning))]/10'
                  : 'text-muted-foreground border-border'
              }`}>
                {garage.type === 'dealer' ? 'Concession' : 'Indépendant'}
              </span>
              {garage.vehicleTypes.map(vt => {
                const icons: Record<string, typeof Car> = { voiture: Car, moto: Bike, camion: Truck, trottinette: Zap, velo: BatteryCharging };
                const VIcon = icons[vt] || Car;
                return (
                  <span key={vt} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground px-3 py-1 rounded-full border border-border capitalize">
                    <VIcon className="w-3 h-3" /> {vt}
                  </span>
                );
              })}
              {garage.badges.map(badge => (
                <span key={badge} className="text-xs font-medium text-muted-foreground px-3 py-1 rounded-full border border-border">
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{garage.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{garage.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>{garage.website}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <a href={`tel:${garage.phone}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4" />
                  Appeler
                </Button>
              </a>
              <Button className="flex-1" onClick={() => setQuoteOpen(true)}>
                <FileText className="w-4 h-4" />
                Demander un devis
              </Button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-5 pb-8">
            <div className="md:col-span-3 space-y-5">
              <GarageHours hours={garage.hours} />
              <GarageMap address={garage.address} coords={garage.coords} />
              <GarageReviews garageId={garage.id} garageName={garage.name} rating={garage.rating} reviewCount={garage.reviews} />
            </div>
            <div className="md:col-span-2">
              <BookingForm garageName={garage.name} />
            </div>
          </div>
        </div>
      </main>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} garageName={garage.name} garageId={garage.id} />
    </div>
  );
};

export default GarageDetail;
