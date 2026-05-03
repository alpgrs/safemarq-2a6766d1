import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuoteAnalysis } from '@/hooks/useQuoteAnalysis';
import { SERVICE_OPTIONS } from '@/components/QuoteModal';
import { getPriceFairnessLabel } from '@/utils/quoteAnalyzer';

const QuoteComparator = () => {
  const [serviceType, setServiceType] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const { analysis, loading, analyzeQuotePrice, resetAnalysis } = useQuoteAnalysis();

  const handleAnalyze = () => {
    if (serviceType && quotedPrice) {
      analyzeQuotePrice(serviceType, parseFloat(quotedPrice));
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-amber-600';
      case 'expensive':
        return 'text-orange-600';
      case 'very_expensive':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRecommendationBg = (rec: string) => {
    switch (rec) {
      case 'excellent':
        return 'bg-green-50 border-green-200';
      case 'good':
        return 'bg-blue-50 border-blue-200';
      case 'fair':
        return 'bg-amber-50 border-amber-200';
      case 'expensive':
        return 'bg-orange-50 border-orange-200';
      case 'very_expensive':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'excellent':
      case 'good':
        return <TrendingDown className="w-5 h-5 text-green-600" />;
      case 'fair':
        return <BarChart3 className="w-5 h-5 text-amber-600" />;
      case 'expensive':
      case 'very_expensive':
        return <TrendingUp className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <section className="px-4 py-8 max-w-4xl mx-auto">
      <motion.div
        className="surface-card p-6 md:p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Comparateur de Devis IA</h2>
          </div>
          <p className="text-muted-foreground">
            Vérifiez si votre devis est juste par rapport aux prix du marché. Trustmarq analyse les tarifs de milliers de garages.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Type de Prestation</label>
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Prix du Devis (€)</label>
            <Input
              type="number"
              placeholder="Ex: 150"
              value={quotedPrice}
              onChange={(e) => setQuotedPrice(e.target.value)}
              className="bg-secondary border-border"
              min="0"
              step="10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleAnalyze}
            disabled={!serviceType || !quotedPrice || loading}
            className="flex-1"
          >
            {loading ? 'Analyse en cours...' : 'Analyser le Devis'}
          </Button>
          {analysis && (
            <Button
              variant="outline"
              onClick={resetAnalysis}
              className="flex-1"
            >
              Réinitialiser
            </Button>
          )}
        </div>

        {analysis && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 border-2 rounded-xl space-y-4 ${getRecommendationBg(analysis.recommendation)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getRecommendationIcon(analysis.recommendation)}
                <div>
                  <h3 className={`text-xl font-bold ${getRecommendationColor(analysis.recommendation)}`}>
                    {getPriceFairnessLabel(analysis.fairnessScore)}
                  </h3>
                  <p className="text-sm text-foreground/70 mt-1">{analysis.explanation}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">{Math.round(analysis.fairnessScore)}</div>
                <div className="text-xs text-muted-foreground">Score de Justesse</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-current border-opacity-10">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{analysis.quotedPrice}€</div>
                <div className="text-xs text-muted-foreground">Votre Devis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{analysis.marketAverage}€</div>
                <div className="text-xs text-muted-foreground">Moyenne Marché</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${analysis.savings > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {analysis.savings > 0 ? '+' : ''}{Math.round(analysis.savings)}€
                </div>
                <div className="text-xs text-muted-foreground">Écart</div>
              </div>
            </div>

            <div className="pt-4 border-t border-current border-opacity-10">
              <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.pricePercentile}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Très Bas</span>
                <span>Moyen</span>
                <span>Très Élevé</span>
              </div>
            </div>

            <div className="bg-white/40 p-3 rounded-lg text-sm text-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p>
                  Cette analyse est basée sur les données de marché agrégées de plus de 5 000 garages en France. 
                  Elle vous aide à négocier ou à trouver une meilleure offre.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default QuoteComparator;
