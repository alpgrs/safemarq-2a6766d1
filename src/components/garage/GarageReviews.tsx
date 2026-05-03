import { Star, ThumbsUp, Send, ShieldCheck, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useGarageReviews, useCreateReview, useHelpfulVotes, useToggleHelpful } from '@/hooks/useReviews';
import { useReviewResponses } from '@/hooks/useDashboard';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

interface GarageReviewsProps {
  garageId: string;
  garageName: string;
  rating: number;
  reviewCount: number;
}

const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              i <= (hover || value) ? 'fill-amber-400 text-amber-400' : 'text-border'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const GarageReviews = ({ garageId, garageName, rating, reviewCount }: GarageReviewsProps) => {
  const { user } = useAuth();
  const { data: reviews, isLoading } = useGarageReviews(garageId);
  const createReview = useCreateReview();
  const reviewIds = (reviews || []).map(r => r.id);
  const { data: votedSet = new Set<string>() } = useHelpfulVotes(reviewIds);
  const { data: responses = [] } = useReviewResponses(reviewIds);
  const toggleHelpful = useToggleHelpful();
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState('');
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);

  const responseMap = new Map(responses.map(r => [r.review_id, r]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newRating === 0) { toast.error('Veuillez sélectionner une note'); return; }
    if (!newText.trim() || newText.trim().length < 10) { toast.error('Votre avis doit contenir au moins 10 caractères'); return; }

    try {
      let invoiceUrl: string | undefined;
      if (invoiceFile) {
        const ext = invoiceFile.name.split('.').pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('review-invoices').upload(path, invoiceFile);
        if (upErr) throw upErr;
        invoiceUrl = path;
      }

      await createReview.mutateAsync({
        garage_id: garageId,
        user_id: user.id,
        author_name: user.email?.split('@')[0] || 'Utilisateur',
        rating: newRating,
        text: newText.trim(),
        ...(invoiceUrl ? { invoice_url: invoiceUrl } : {}),
      });
      setNewRating(0);
      setNewText('');
      setInvoiceFile(null);
      toast.success('Avis publié avec succès !');
    } catch {
      toast.error("Erreur lors de la publication de l'avis");
    }
  };

  return (
    <motion.div
      className="surface-card p-4 space-y-4"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.2, 0, 0, 1] }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Avis vérifiés</h3>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-mono-data text-sm font-bold text-foreground">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>
      </div>

      {/* Review form */}
      {user ? (
        <form onSubmit={handleSubmit} className="p-3 rounded-xl bg-primary/5 border border-primary/15 space-y-3">
          <p className="text-xs font-semibold text-foreground">Laisser un avis</p>
          <StarRating value={newRating} onChange={setNewRating} />
          <Textarea
            placeholder="Partagez votre expérience avec ce garage..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="min-h-[80px] text-sm bg-background/50 resize-none"
            maxLength={1000}
          />
          {/* Invoice upload */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              <Upload className="w-3 h-3" />
              {invoiceFile ? invoiceFile.name : 'Joindre une facture (optionnel)'}
              <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => setInvoiceFile(e.target.files?.[0] || null)} />
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">{newText.length}/1000</span>
            <Button type="submit" size="sm" disabled={createReview.isPending} className="text-xs">
              <Send className="w-3.5 h-3.5" />
              {createReview.isPending ? 'Publication...' : 'Publier'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-3 rounded-xl bg-secondary/40 border border-border text-center">
          <p className="text-xs text-muted-foreground">
            <Link to="/auth" className="text-primary font-semibold hover:underline">Connectez-vous</Link> pour laisser un avis
          </p>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-xs text-muted-foreground text-center py-4">Chargement des avis...</p>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review, index) => {
            const ownerResponse = responseMap.get(review.id);
            return (
              <motion.div
                key={review.id}
                className="p-3 rounded-xl bg-secondary/40 border border-border space-y-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary">{review.author_name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-foreground">{review.author_name}</span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                            <ShieldCheck className="w-2.5 h-2.5" /> Vérifié
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-border'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-foreground/70 leading-relaxed">{review.text}</p>

                {/* Owner response */}
                {ownerResponse && (
                  <div className="p-2 rounded-lg bg-primary/5 border-l-2 border-primary/30">
                    <p className="text-[10px] font-semibold text-primary mb-0.5">Réponse du garage</p>
                    <p className="text-xs text-foreground/70">{ownerResponse.text}</p>
                  </div>
                )}

                <button
                  className={`flex items-center gap-1 text-[10px] transition-colors ${
                    votedSet.has(review.id)
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => {
                    if (!user) { toast.info('Connectez-vous pour voter'); return; }
                    toggleHelpful.mutate({ reviewId: review.id, hasVoted: votedSet.has(review.id) });
                  }}
                  disabled={toggleHelpful.isPending}
                >
                  <ThumbsUp className={`w-3 h-3 ${votedSet.has(review.id) ? 'fill-primary' : ''}`} />
                  Utile ({review.helpful_count})
                </button>
              </motion.div>
            );
          })
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">Aucun avis pour le moment. Soyez le premier !</p>
        )}
      </div>
    </motion.div>
  );
};

export default GarageReviews;
