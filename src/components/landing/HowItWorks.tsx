import { motion } from 'framer-motion';
import { Search, GitCompare, CalendarCheck } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Cherchez',
    desc: 'Par ville, marque ou type de service. Localisation instantanée pour trouver les garages les plus proches.',
  },
  {
    icon: GitCompare,
    title: 'Comparez',
    desc: 'Score SAFEMARQ, avis vérifiés, transparence des prix et devis instantanés côte à côte.',
  },
  {
    icon: CalendarCheck,
    title: 'Choisissez',
    desc: 'Réservez un rendez-vous ou demandez un devis directement. Vous gardez la main, toujours.',
  },
];

const HowItWorks = () => (
  <section className="px-4 md:px-6 max-w-6xl mx-auto py-12 md:py-20">
    <div className="text-center mb-10 md:mb-14">
      <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-3">
        Comment ça marche
      </p>
      <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
        Trois étapes, zéro mauvaise surprise.
      </h2>
    </div>

    <div className="grid md:grid-cols-3 gap-4 md:gap-6">
      {steps.map((step, i) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="relative p-6 md:p-8 rounded-3xl bg-card border border-border hover:border-primary/40 transition-colors group"
        >
          <div className="absolute top-5 right-5 text-5xl md:text-6xl font-black text-primary/10 group-hover:text-primary/20 transition-colors leading-none">
            0{i + 1}
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <step.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{step.title}</h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{step.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default HowItWorks;
