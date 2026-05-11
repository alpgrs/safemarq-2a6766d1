import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';

const BillingSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Seo
        title="Abonnement activé — SAFEMARQ"
        description="Votre abonnement a été activé avec succès."
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 p-6 max-w-sm surface-card"
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-foreground">Merci pour votre abonnement !</h2>
          <p className="text-sm text-muted-foreground">
            Votre paiement a été reçu. La synchronisation peut prendre quelques secondes — rafraîchissez si nécessaire.
          </p>
        </div>
        {sessionId && (
          <p className="text-[10px] text-muted-foreground font-mono break-all">
            {sessionId}
          </p>
        )}
        <div className="flex flex-col gap-2">
          <Link to="/dashboard">
            <Button className="w-full">
              <Sparkles className="w-4 h-4" /> Aller au dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default BillingSuccess;
