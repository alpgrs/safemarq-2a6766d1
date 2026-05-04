import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      "J'ai économisé 340€ sur ma vidange en comparant trois devis en deux minutes. Plus jamais sans SAFEMARQ.",
    name: 'Émilie D.',
    meta: 'Bruxelles · Peugeot 308',
    initials: 'ED',
  },
  {
    quote:
      "Enfin un classement honnête. Le score m'a évité un garage avec 5 étoiles… mais seulement 4 avis. Bien vu.",
    name: 'Karim B.',
    meta: 'Liège · BMW Série 1',
    initials: 'KB',
  },
  {
    quote:
      'Garagiste depuis 18 ans, je trouve enfin une plateforme qui valorise le travail bien fait, pas juste le marketing.',
    name: 'Vincent M.',
    meta: 'Garage Méca-Pro · Namur',
    initials: 'VM',
  },
];

const Testimonials = () => (
  <section className="px-4 md:px-6 max-w-6xl mx-auto py-12 md:py-20">
    <div className="text-center mb-10 md:mb-14">
      <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-3">
        Ils ont essayé
      </p>
      <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
        La confiance, ça se mesure.
      </h2>
    </div>

    <div className="grid md:grid-cols-3 gap-4 md:gap-6">
      {testimonials.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="relative p-6 md:p-8 rounded-3xl bg-card border border-border flex flex-col"
        >
          <Quote className="w-8 h-8 text-primary/30 mb-4" />
          <p className="text-foreground text-base md:text-lg leading-relaxed flex-1">"{t.quote}"</p>
          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
            <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm">
              {t.initials}
            </div>
            <div>
              <div className="font-semibold text-foreground text-sm">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.meta}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Testimonials;
