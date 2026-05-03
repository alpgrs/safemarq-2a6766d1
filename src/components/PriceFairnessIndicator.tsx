import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { calculateFairPriceForGarage, getPriceFairnessLabel } from '@/utils/quoteAnalyzer';

interface PriceFairnessIndicatorProps {
  garageRating: number;
  garageName: string;
  compact?: boolean;
}

const PriceFairnessIndicator = ({ garageRating, garageName, compact = false }: PriceFairnessIndicatorProps) => {
  // Calcul du score de justesse basé sur la note
  const fairnessScore = Math.round((garageRating / 5) * 100);
  
  // Détermination de la recommandation
  let recommendation: 'excellent' | 'good' | 'fair' | 'expensive';
  if (fairnessScore >= 90) {
    recommendation = 'excellent';
  } else if (fairnessScore >= 75) {
    recommendation = 'good';
  } else if (fairnessScore >= 60) {
    recommendation = 'fair';
  } else {
    recommendation = 'expensive';
  }

  const getColors = (rec: string) => {
    switch (rec) {
      case 'excellent':
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-600' };
      case 'good':
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600' };
      case 'fair':
        return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-600' };
      case 'expensive':
        return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-600' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-600' };
    }
  };

  const colors = getColors(recommendation);

  const getIcon = (rec: string) => {
    switch (rec) {
      case 'excellent':
      case 'good':
        return <TrendingDown className={`w-4 h-4 ${colors.icon}`} />;
      case 'fair':
        return <AlertCircle className={`w-4 h-4 ${colors.icon}`} />;
      case 'expensive':
        return <TrendingUp className={`w-4 h-4 ${colors.icon}`} />;
      default:
        return <Zap className={`w-4 h-4 ${colors.icon}`} />;
    }
  };

  if (compact) {
    return (
      <motion.div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${colors.bg} ${colors.border}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {getIcon(recommendation)}
        <span className={`text-xs font-semibold ${colors.text}`}>
          {getPriceFairnessLabel(fairnessScore)}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`p-3 rounded-lg border ${colors.bg} ${colors.border} space-y-2`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon(recommendation)}
          <span className={`font-semibold text-sm ${colors.text}`}>
            Trustmarq Fair Price
          </span>
        </div>
        <div className={`text-lg font-bold ${colors.text}`}>
          {fairnessScore}%
        </div>
      </div>
      
      <div className="w-full bg-white/40 rounded-full h-1.5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${fairnessScore}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      <p className={`text-xs ${colors.text} opacity-75`}>
        {recommendation === 'excellent' && 'Excellent rapport qualité-prix. Les clients sont très satisfaits.'}
        {recommendation === 'good' && 'Bon rapport qualité-prix. Garage fiable et compétitif.'}
        {recommendation === 'fair' && 'Prix dans la norme. Garage standard avec bonne réputation.'}
        {recommendation === 'expensive' && 'Prix élevé. À comparer avec d\'autres garages.'}
      </p>
    </motion.div>
  );
};

export default PriceFairnessIndicator;
