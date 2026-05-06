import { useState } from 'react';
import { Star, Trash2, BadgeCheck, Search, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAdminReviews, useDeleteReview, type AdminReview } from '@/hooks/useAdmin';

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} className={`w-3 h-3 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
    ))}
  </div>
);

const ReviewRow = ({ review }: { review: AdminReview }) => {
  const deleteMutation = useDeleteReview();

  return (
    <div className="surface-card p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground">{review.author_name}</span>
            {review.verified && (
              <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                <BadgeCheck className="w-2.5 h-2.5" /> Vérifié
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} />
            <span className="text-[10px] text-muted-foreground">
              {review.garages?.name ?? '—'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: fr })}
          </span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost" className="w-7 h-7 text-destructive hover:bg-destructive/10">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer cet avis ?</AlertDialogTitle>
                <AlertDialogDescription>
                  L'avis de <strong>{review.author_name}</strong> sera définitivement supprimé. Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate(review.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <p className="text-xs text-foreground/70 leading-relaxed line-clamp-3">{review.text}</p>
    </div>
  );
};

const AdminReviews = () => {
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const { data: reviews = [], isLoading } = useAdminReviews();

  const filtered = reviews.filter(r => {
    if (ratingFilter !== null && r.rating !== ratingFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.author_name.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q) ||
        (r.garages?.name ?? '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl bg-card border border-border focus-within:border-primary/50 transition-colors">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Rechercher par auteur, garage, texte..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setRatingFilter(null)}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors ${ratingFilter === null ? 'bg-primary text-primary-foreground' : 'bg-secondary/60 text-muted-foreground hover:text-foreground'}`}
          >
            Tous
          </button>
          {[1, 2, 3, 4, 5].map(r => (
            <button
              key={r}
              onClick={() => setRatingFilter(ratingFilter === r ? null : r)}
              className={`text-xs px-2.5 py-1.5 rounded-xl font-semibold transition-colors ${ratingFilter === r ? 'bg-amber-500 text-white' : 'bg-secondary/60 text-muted-foreground hover:text-foreground'}`}
            >
              {r}★
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{filtered.length} avis</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Aucun avis trouvé</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(review => <ReviewRow key={review.id} review={review} />)}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
