import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, MessageSquare, FileText, BadgeCheck, BarChart3, ShieldCheck } from 'lucide-react';
import Seo from '@/components/Seo';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';

const FEATURES = [
  { icon: BadgeCheck, title: 'Revendication gratuite', text: 'Validez votre fiche en quelques clics. Auto-approbation si votre email professionnel correspond au domaine du site.' },
  { icon: MessageSquare, title: 'Répondez aux avis', text: 'Apportez du contexte, montrez votre professionnalisme et améliorez votre image publique.' },
  { icon: FileText, title: 'Recevez des devis qualifiés', text: 'Les automobilistes vous contactent directement avec le détail de leur besoin, leur véhicule et leur plaque.' },
  { icon: BarChart3, title: 'Tableau de bord pro', text: 'Suivez vos avis, gérez vos demandes par statut, mesurez votre performance.' },
  { icon: ShieldCheck, title: 'Pas de classement payant', text: 'Aucune mise en avant cachée. Le score Trustmarq est le seul critère de visibilité.' },
];

const Pro = () => (
  <div className="min-h-screen bg-background">
    <Seo
      title="Espace garagistes — Revendiquez votre fiche"
      description="Garagistes : revendiquez gratuitement votre fiche Trustmarq, répondez aux avis et recevez des demandes de devis qualifiées."
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
          <Sparkles className="w-3 h-3" /> Pour les pros
        </span>
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">
          Reprenez la main sur votre réputation.
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Trustmarq aide les automobilistes à choisir un garage en confiance. En tant que professionnel, gérez vos avis et captez de nouveaux clients — gratuitement.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Link to="/pro/claim">
            <Button size="lg">Revendiquer ma fiche</Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline">Notre méthode</Button>
          </Link>
        </div>
      </motion.section>

      <section className="grid md:grid-cols-2 gap-3 mb-10">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="surface-card p-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.text}</p>
          </motion.div>
        ))}
      </section>

      <section className="surface-card p-5 mb-10">
        <h2 className="text-base font-bold text-foreground mb-3">Comment ça marche ?</h2>
        <ol className="space-y-3 text-sm text-foreground/80">
          {[
            'Recherchez votre garage sur la plateforme.',
            'Soumettez une demande de revendication avec votre email professionnel.',
            'Validation automatique si l\'email correspond au domaine du site, ou validation manuelle sous 48h.',
            'Accédez à votre dashboard pour répondre aux avis et gérer vos devis.',
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-xs leading-relaxed pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="text-center surface-card p-6 bg-primary/5 border-primary/20">
        <h2 className="text-lg font-bold text-foreground mb-1">Prêt à commencer ?</h2>
        <p className="text-xs text-muted-foreground mb-4">C'est 100% gratuit, sans engagement.</p>
        <Link to="/pro/claim">
          <Button size="lg">Revendiquer ma fiche</Button>
        </Link>
      </section>
    </main>

    <Footer />
    <BottomNav />
  </div>
);

export default Pro;
