import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';

const BillingCancel = () => (
  <div className="min-h-screen bg-background flex items-center justify-center px-4">
    <Seo title="Paiement annulé — SAFEMARQ" description="Le paiement a été annulé." />
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4 p-6 max-w-sm surface-card"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
        <XCircle className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-foreground">Paiement annulé</h2>
        <p className="text-sm text-muted-foreground">
          Pas de souci, aucun montant n'a été débité. Vous pouvez réessayer à tout moment.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Link to="/pricing">
          <Button className="w-full">Voir les offres</Button>
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

export default BillingCancel;
