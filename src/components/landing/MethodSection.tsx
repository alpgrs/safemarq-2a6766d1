import { motion } from 'framer-motion';
import { ArrowRight, Star, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MethodSection = () => (
  <section className="px-4 md:px-6 max-w-6xl mx-auto py-12 md:py-20">
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      {/* Visual */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="relative order-2 lg:order-1"
      >
        <div className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-card to-card/40 border border-border overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative space-y-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-2">
                Score SAFEMARQ
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl md:text-7xl font-extrabold text-foreground tabular-nums">87</span>
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-foreground font-medium flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" /> Note Google (60%)
                  </span>
                  <span className="text-muted-foreground tabular-nums">4.6 ★</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '92%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-foreground font-medium flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" /> Volume d'avis (40%)
                  </span>
                  <span className="text-muted-foreground tabular-nums">312 avis</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '78%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-primary/70 rounded-full"
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground border-t border-border pt-4">
              Une note seule ne suffit pas. Un garage 5★ avec 3 avis n'est pas comparable à un 4.5★
              avec 400 avis. Le score SAFEMARQ pondère les deux.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="order-1 lg:order-2"
      >
        <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-3">
          Notre méthode
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-5">
          Un score qui dit la vérité.
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
          Le <strong className="text-foreground">score SAFEMARQ</strong> combine la qualité perçue (note moyenne)
          et la fiabilité statistique (volume d'avis). Plus un garage a d'avis, plus son score reflète
          la réalité.
        </p>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
          Pas de classement payant, pas de partenariat caché. Les garages ne peuvent pas acheter
          leur position.
        </p>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
        >
          Lire la méthode complète
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default MethodSection;
