import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Sparkles, BadgeCheck, MessageSquare, Scale } from 'lucide-react';
import Seo from '@/components/Seo';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';

const PILLARS = [
  {
    icon: BadgeCheck,
    title: 'Avis vérifiés par facture',
    text: "Les utilisateurs peuvent joindre une facture pour certifier qu'ils ont réellement été clients. Un badge dédié s'affiche sur l'avis.",
  },
  {
    icon: Scale,
    title: 'Score Trustmarq objectif',
    text: 'Le Trustmarq Score combine 60% de la note Google et 40% du volume d\'avis (échelle logarithmique). Un score lisible de 0 à 100.',
  },
  {
    icon: MessageSquare,
    title: 'Réponse du garagiste',
    text: "Les garagistes peuvent revendiquer leur fiche et répondre publiquement aux avis pour apporter du contexte.",
  },
  {
    icon: ShieldCheck,
    title: 'Transparence totale',
    text: "Pas de classement payant. Pas de mise en avant cachée. Le ranking dépend uniquement du score, de la distance et de vos filtres.",
  },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Seo
      title="Notre méthode — Comment nous évaluons les garages"
      description="Découvrez la méthode Trustmarq : avis vérifiés par facture, score objectif, et transparence sur les garages automobiles en Belgique."
    />
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </Link>
      </div>
    </header>

    <main className="pt-20 pb-12 max-w-4xl mx-auto px-4">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 mb-10"
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
          <Sparkles className="w-3 h-3" /> Notre méthode
        </span>
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">
          La confiance, ça se mesure.
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Trustmarq aide les automobilistes belges à choisir le bon garage en s'appuyant sur des données vérifiables et un score objectif.
        </p>
      </motion.section>

      <section className="grid md:grid-cols-2 gap-3 mb-10">
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="surface-card p-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <p.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">{p.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{p.text}</p>
          </motion.div>
        ))}
      </section>

      <section className="surface-card p-5 mb-10">
        <h2 className="text-base font-bold text-foreground mb-2">Comment se calcule le Trustmarq Score ?</h2>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          Notre formule équilibre la qualité perçue et la fiabilité statistique :
        </p>
        <div className="bg-secondary/40 rounded-xl p-3 font-mono text-xs text-foreground/80">
          Score = (Note × 20) × 0.6 + min(log₁₀(avis + 1) × 25, 100) × 0.4
        </div>
        <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
          Un garage avec une note de 4.8 mais seulement 3 avis aura un score plus mesuré qu'un garage à 4.5 avec 200 avis : la fiabilité du signal compte autant que la note brute.
        </p>
      </section>

      <section className="text-center surface-card p-5">
        <h2 className="text-base font-bold text-foreground mb-1">Vous êtes garagiste ?</h2>
        <p className="text-xs text-muted-foreground mb-3">Revendiquez gratuitement votre fiche pour répondre aux avis et recevoir des demandes de devis.</p>
        <Link to="/pro">
          <Button>Espace pros</Button>
        </Link>
      </section>
    </main>

    <Footer />
    <BottomNav />
  </div>
);

export default About;
