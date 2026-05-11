import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  feature: string;
  requiredTier: 'pro' | 'premium';
}

export default function UpgradePrompt({ open, onClose, feature, requiredTier }: Props) {
  const tierLabel = requiredTier === 'premium' ? 'Premium · 99€/mois' : 'Pro · 39€/mois';
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle>Fonctionnalité {requiredTier === 'premium' ? 'Premium' : 'Pro'}</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{feature}</span> est inclus dans l'abonnement {tierLabel}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 pt-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Plus tard
          </Button>
          <Link to="/pricing" className="flex-1" onClick={onClose}>
            <Button className="w-full">Voir les offres</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
