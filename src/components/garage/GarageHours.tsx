import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface GarageHoursProps {
  hours: { day: string; open: string; close: string }[];
}

const GarageHours = ({ hours }: GarageHoursProps) => {
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <motion.div
      className="surface-card p-4 space-y-3"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Horaires d'ouverture</h3>
      </div>

      <div className="space-y-1.5">
        {hours.map((h) => {
          const isToday = h.day === todayCapitalized;
          const isClosed = !h.open;
          return (
            <div
              key={h.day}
              className={`flex justify-between items-center text-sm px-2.5 py-1.5 rounded-lg transition-colors ${
                isToday ? 'bg-primary/10 border border-primary/20' : ''
              }`}
            >
              <span className={`${isToday ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                {h.day} {isToday && '·  Aujourd\'hui'}
              </span>
              <span className={`font-mono-data text-xs ${isClosed ? 'text-destructive' : isToday ? 'text-primary font-semibold' : 'text-foreground'}`}>
                {isClosed ? 'Fermé' : `${h.open} – ${h.close}`}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default GarageHours;
