import { motion } from 'framer-motion';
import { ArrowRight, Car, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SplitCTAProps {
  onScrollToSearch?: () => void;
}

const SplitCTA = ({ onScrollToSearch }: SplitCTAProps) => (
  <section className="px-4 md:px-6 max-w-6xl mx-auto py-12 md:py-20">
    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
      <motion.button
        type="button"
        onClick={onScrollToSearch}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group relative text-left p-8 md:p-10 rounded-3xl bg-gradient-to-br from-primary/15 via-card to-card border border-primary/30 hover:border-primary/60 transition-all overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-colors" />
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-5">
            <Car className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Vous êtes automobiliste</h3>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
            Trouvez le garage qui ne vous prendra pas pour une poire. Avis vérifiés, devis comparés,
            zéro pression.
          </p>
          <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
            Trouver mon garage
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Link
          to="/pro"
          className="group relative block p-8 md:p-10 rounded-3xl bg-card border border-border hover:border-foreground/30 transition-all overflow-hidden h-full"
        >
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-foreground/5 blur-3xl" />
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-5">
              <Wrench className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Vous êtes garagiste</h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
              Revendiquez votre fiche, répondez aux avis et recevez des demandes de devis qualifiées
              directement.
            </p>
            <span className="inline-flex items-center gap-2 text-foreground font-semibold group-hover:gap-3 transition-all">
              Revendiquer ma fiche
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default SplitCTA;
