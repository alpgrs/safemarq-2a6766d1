import { useState } from 'react';
import { Calendar, Car, MessageSquare, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface BookingFormProps {
  garageName: string;
}

const SERVICE_OPTIONS = [
  'Entretien régulier',
  'Diagnostic complet',
  'Freinage',
  'Pneus & géométrie',
  'Électronique / capteurs',
  'Autre',
];

const BookingForm = ({ garageName }: BookingFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <motion.div
      className="surface-card p-4 md:p-5 md:sticky md:top-20"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.2, 0, 0, 1] }}
    >
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            className="text-center py-8 space-y-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="w-12 h-12 text-success mx-auto" />
            <h3 className="text-lg font-bold text-foreground">Demande envoyée !</h3>
            <p className="text-sm text-muted-foreground">
              {garageName} vous recontactera sous 24h.
            </p>
            <Button variant="outline" size="sm" onClick={() => setSubmitted(false)} className="mt-2">
              Nouvelle demande
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Réserver un créneau</h3>
            </div>

            {/* Service */}
            <div className="space-y-1.5">
              <label className="label-xs text-muted-foreground">Type de service</label>
              <div className="flex flex-wrap gap-1.5">
                {SERVICE_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setService(opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border ${
                      service === opt
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-secondary/40 text-muted-foreground border-border hover:border-primary/30'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="label-xs text-muted-foreground">Date souhaitée</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="label-xs text-muted-foreground">Votre nom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Dupont"
                required
                className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="label-xs text-muted-foreground">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 12 34 56 78"
                required
                className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="label-xs text-muted-foreground flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                Message (optionnel)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez votre besoin..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:border-primary/50 focus:outline-none transition-colors resize-none"
              />
            </div>

            <Button type="submit" className="w-full" disabled={!service || !date || !name || !phone}>
              Confirmer la demande
            </Button>

            <p className="text-[10px] text-muted-foreground text-center">
              Gratuit · Sans engagement · Réponse sous 24h
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BookingForm;
