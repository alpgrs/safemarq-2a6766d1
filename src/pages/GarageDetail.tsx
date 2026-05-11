import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, BadgeCheck, MapPin, Phone, Globe, ShieldCheck, FileText, Car, Bike, Truck, Zap, BatteryCharging, CheckCircle2, Crown, Sparkles, Award, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import BookingForm from '@/components/garage/BookingForm';
import GarageGallery from '@/components/garage/GarageGallery';
import GarageHours from '@/components/garage/GarageHours';
import GarageMap from '@/components/garage/GarageMap';
import GarageReviews from '@/components/garage/GarageReviews';
import QuoteModal from '@/components/QuoteModal';
import Seo from '@/components/Seo';
import { useGarage, calculateSAFEMARQScore } from '@/hooks/useGarages';
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

  const score = calculateSAFEMARQScore(garage.rating, garage.reviews);
  const isPro = garage.tier === 'pro' || garage.tier === 'premium';
  const isPremium = garage.tier === 'premium';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: garage.name,
    image: garage.coverImageUrl || garage.images?.[0],
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
        image={garage.coverImageUrl || garage.images?.[0]}
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
        {isPro && garage.coverImageUrl ? (
          <div className="relative w-full h-48 md:h-72 overflow-hidden">
            <img src={garage.coverImageUrl} alt={`Couverture ${garage.name}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>
        ) : (
          <GarageGallery images={garage.images} name={garage.name} />
        )}

        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {isPremium && garage.promoBanner && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
            >
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-xs font-medium text-foreground flex-1">{garage.promoBanner.text}</span>
              {garage.promoBanner.cta && garage.promoBanner.cta_url && (
                <a href={garage.promoBanner.cta_url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="text-[10px] h-6">
                    {garage.promoBanner.cta}
                  </Button>
                </a>
              )}
            </motion.div>
          )}

          <motion.div
            className="py-5 space-y-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3 min-w-0">
                {isPro && garage.logoUrl && (
                  <img
                    src={garage.logoUrl}
                    alt={`Logo ${garage.name}`}
                    className="w-14 h-14 rounded-xl object-contain border border-border bg-background shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">{garage.name}</h1>
                    {garage.verified && <BadgeCheck className="w-5 h-5 text-primary shrink-0" />}
                    {isPremium && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-500/15 px-2 py-0.5 rounded-full">
                        <Crown className="w-3 h-3" /> Premium
                      </span>
                    )}
                    {garage.tier === 'pro' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" /> Pro
                      </span>
                    )}
                    <FavoriteButton garageId={garage.id} />
                  </div>
                  <p className="text-muted-foreground text-sm mt-0.5">{garage.specialty} · {garage.priceLevel}</p>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-mono-data text-xl font-bold text-foreground">{garage.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">{garage.reviews} avis</span>
              </div>
            </div>

            <p className="text-sm text-foreground/70 leading-relaxed">{garage.description}</p>
            {isPro && garage.longDescription && (
              <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">{garage.longDescription}</p>
            )}

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

          {isPro && garage.servicesDetail.length > 0 && (
            <section className="surface-card p-4 mb-5">
              <h2 className="text-sm font-bold text-foreground mb-3">Services & tarifs indicatifs</h2>
              <ul className="space-y-2">
                {garage.servicesDetail.map((s, i) => (
                  <li key={i} className="flex justify-between items-start gap-3 text-xs">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{s.name}</p>
                      {s.description && <p className="text-muted-foreground mt-0.5">{s.description}</p>}
                    </div>
                    {typeof s.price_from === 'number' && (
                      <span className="shrink-0 text-primary font-bold">À partir de {s.price_from}€</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {isPremium && garage.videoUrl && (
            <section className="surface-card p-4 mb-5">
              <h2 className="text-sm font-bold text-foreground mb-3">Vidéo de présentation</h2>
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  src={garage.videoUrl}
                  title={`Vidéo ${garage.name}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}

          {isPremium && garage.team.length > 0 && (
            <section className="surface-card p-4 mb-5">
              <h2 className="text-sm font-bold text-foreground mb-3">L'équipe</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {garage.team.map((m, i) => (
                  <div key={i} className="text-center">
                    {m.photo_url ? (
                      <img src={m.photo_url} alt={m.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-1.5" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-1.5" />
                    )}
                    <p className="text-xs font-semibold text-foreground">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground">{m.role}</p>
                    {m.bio && <p className="text-[10px] text-muted-foreground/80 mt-1 leading-tight">{m.bio}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {isPremium && garage.certifications.length > 0 && (
            <section className="surface-card p-4 mb-5">
              <h2 className="text-sm font-bold text-foreground mb-3">Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {garage.certifications.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-foreground">{c.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {isPremium && garage.faq.length > 0 && (
            <section className="surface-card p-4 mb-5">
              <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary" /> FAQ
              </h2>
              <div className="space-y-3">
                {garage.faq.map((q, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-foreground">{q.question}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{q.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

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
