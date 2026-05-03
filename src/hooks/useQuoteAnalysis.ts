import { useState, useCallback } from 'react';
import { analyzeQuote, QuoteAnalysis } from '@/utils/quoteAnalyzer';

export function useQuoteAnalysis() {
  const [analysis, setAnalysis] = useState<QuoteAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeQuotePrice = useCallback((serviceType: string, quotedPrice: number) => {
    setLoading(true);
    try {
      // Simulation d'un appel API (en production, ce serait un vrai appel backend)
      setTimeout(() => {
        const result = analyzeQuote(serviceType, quotedPrice);
        setAnalysis(result);
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error('Erreur lors de l\'analyse du devis:', error);
      setLoading(false);
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    setAnalysis(null);
  }, []);

  return {
    analysis,
    loading,
    analyzeQuotePrice,
    resetAnalysis,
  };
}
