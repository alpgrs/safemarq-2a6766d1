import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ShieldCheck, Star, Store, MessageSquare } from 'lucide-react';
import { useLandingStats } from '@/hooks/useLandingStats';

function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1200, bounce: 0 });
  const display = useTransform(spring, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  useEffect(() => {
    return display.on('change', (v) => {
      if (ref.current) ref.current.textContent = v;
    });
  }, [display]);

  return <span ref={ref}>0</span>;
}

const TrustStrip = () => {
  const { data } = useLandingStats();
  const items = [
    { icon: Store, value: data?.garages ?? 0, label: 'Garages référencés' },
    { icon: MessageSquare, value: data?.reviews ?? 0, label: 'Avis collectés' },
    { icon: Star, value: data?.avgRating ?? 0, label: 'Note moyenne', decimals: 1 },
    { icon: ShieldCheck, value: 100, label: '% indépendant', suffix: '%' },
  ];

  return (
    <section className="px-4 md:px-6 max-w-6xl mx-auto -mt-2 md:-mt-6 mb-8 md:mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-4 md:p-6 rounded-3xl bg-card/60 backdrop-blur border border-border"
      >
        {items.map(({ icon: Icon, value, label, decimals, suffix }) => (
          <div key={label} className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-xl md:text-3xl font-extrabold text-foreground tabular-nums leading-none">
                <CountUp value={value} decimals={decimals ?? 0} />
                {suffix && <span className="text-primary">{suffix}</span>}
              </div>
              <div className="text-[11px] md:text-xs text-muted-foreground mt-1 leading-tight">{label}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default TrustStrip;
