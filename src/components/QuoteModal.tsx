import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, Car, Bike, Truck, Zap, BatteryCharging, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateQuoteRequest } from '@/hooks/useQuoteRequests';
import { toast } from 'sonner';

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  garageName: string;
  garageId?: string;
}

export const SERVICE_OPTIONS = [
  { value: 'entretien', label: 'Entretien / Révision' },
  { value: 'reparation', label: 'Réparation' },
  { value: 'carrosserie', label: 'Carrosserie / Peinture' },
  { value: 'pneus', label: 'Pneus' },
  { value: 'diagnostic', label: 'Diagnostic' },
  { value: 'autre', label: 'Autre' },
];

export const VEHICLE_OPTIONS = [
  { id: 'voiture', label: 'Voiture', icon: Car },
  { id: 'moto', label: 'Moto', icon: Bike },
  { id: 'trottinette', label: 'Trottinette', icon: Zap },
  { id: 'camion', label: 'Camion', icon: Truck },
  { id: 'velo', label: 'Vélo élec.', icon: BatteryCharging },
];

const QuoteModal = ({ open, onClose, garageName, garageId }: QuoteModalProps) => {
  const { user } = useAuth();
  const createQuote = useCreateQuoteRequest();
  const [step, setStep] = useState(1);
  const [vehicleType, setVehicleType] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [plate, setPlate] = useState('');
  const [problem, setProblem] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reset = () => {
    setStep(1);
    setVehicleType('');
    setServiceType('');
    setPlate('');
    setProblem('');
    setSubmitted(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!garageId) {
      setSubmitted(true);
      setTimeout(handleClose, 2000);
      return;
    }
    try {
      await createQuote.mutateAsync({
        garage_id: garageId,
        user_id: user?.id,
        plate,
        vehicle_type: vehicleType,
        service_type: serviceType,
        description: problem,
      });
      setSubmitted(true);
      toast.success('Demande de devis envoyée !');
      setTimeout(handleClose, 2000);
    } catch {
      toast.error("Erreur lors de l'envoi du devis");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            className="relative w-full max-w-md mx-4 bg-card border border-border rounded-2xl p-6 space-y-4 mb-4 md:mb-0"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">Demander un devis</h3>
              <button onClick={handleClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors active:scale-95">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">{garageName}</p>

            {/* Step indicator */}
            {!submitted && (
              <div className="flex gap-1">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-border'}`} />
                ))}
              </div>
            )}

            {submitted ? (
              <motion.div className="flex flex-col items-center gap-3 py-8" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <CheckCircle className="w-10 h-10 text-[hsl(var(--success))]" />
                <p className="text-sm font-semibold text-foreground">Demande envoyée !</p>
                <p className="text-xs text-muted-foreground">Le garage vous recontactera sous 24h.</p>
              </motion.div>
            ) : step === 1 ? (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-foreground">Type de véhicule</p>
                <div className="grid grid-cols-3 gap-2">
                  {VEHICLE_OPTIONS.map(v => {
                    const Icon = v.icon;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVehicleType(v.id)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                          vehicleType === v.id
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-foreground/20'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[10px] font-medium">{v.label}</span>
                      </button>
                    );
                  })}
                </div>
                <Button onClick={() => setStep(2)} disabled={!vehicleType} className="w-full" size="sm">
                  Suivant <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : step === 2 ? (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-foreground">Type de prestation</p>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_OPTIONS.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} size="sm" className="flex-1">
                    <ChevronLeft className="w-3.5 h-3.5" /> Retour
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={!serviceType} size="sm" className="flex-1">
                    Suivant <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Immatriculation</label>
                  <Input placeholder="AB-123-CD" value={plate} onChange={(e) => setPlate(e.target.value)} required className="bg-secondary border-border" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Décrivez le problème</label>
                  <Textarea placeholder="Ex: Bruit au freinage, voyant moteur allumé..." value={problem} onChange={(e) => setProblem(e.target.value)} required rows={3} className="bg-secondary border-border resize-none" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)} size="sm" className="flex-1" type="button">
                    <ChevronLeft className="w-3.5 h-3.5" /> Retour
                  </Button>
                  <Button type="submit" size="sm" className="flex-1" disabled={createQuote.isPending}>
                    <Send className="w-3.5 h-3.5" />
                    {createQuote.isPending ? 'Envoi...' : 'Envoyer'}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuoteModal;
