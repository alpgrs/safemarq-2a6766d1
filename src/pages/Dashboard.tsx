import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Briefcase, MessageSquare, FileText, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useGarageOwnership, useGarageReviewsForOwner, useReviewResponses } from '@/hooks/useDashboard';
import { useGarageQuoteRequests } from '@/hooks/useQuoteRequests';
import { useGarages } from '@/hooks/useGarages';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import BottomNav from '@/components/BottomNav';
import QuoteStatusActions from '@/components/dashboard/QuoteStatusActions';

const STATUS_FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: 'pending', label: 'En attente' },
  { id: 'accepted', label: 'Acceptés' },
  { id: 'completed', label: 'Terminés' },
] as const;
type StatusFilter = typeof STATUS_FILTERS[number]['id'];

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { data: ownerships = [], isLoading: loadingOwn } = useGarageOwnership();
  const { data: garages = [] } = useGarages();

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const garageMap = new Map(garages.map(g => [g.id, g]));
  const ownedGarages = ownerships.map(o => ({ ownership: o, garage: garageMap.get(o.garage_id) })).filter(o => o.garage);

  if (loadingOwn) {
    return (
      <div className="min-h-screen bg-background pt-14 px-4">
        <Skeleton className="h-32 rounded-2xl mb-4" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (ownedGarages.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 p-6 max-w-sm surface-card"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Briefcase className="w-7 h-7 text-primary" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-foreground">Espace Professionnel</h2>
            <p className="text-sm text-muted-foreground">
              Vous êtes garagiste ? Revendiquez votre fiche pour gérer vos avis et recevoir les demandes de devis.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/pro/claim">
              <Button className="w-full">
                <Sparkles className="w-4 h-4" /> Revendiquer ma fiche
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm" className="w-full text-xs">Retour à l'accueil</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-sm font-bold text-foreground">Dashboard Pro</h1>
        </div>
      </header>

      <main className="pt-14 pb-24 md:pb-12 max-w-4xl mx-auto px-4">
        {ownedGarages.map(({ ownership, garage }) => (
          <GarageDashboard key={ownership.id} ownershipId={ownership.id} garageId={ownership.garage_id} garage={garage!} />
        ))}
      </main>
      <BottomNav />
    </div>
  );
};

function GarageDashboard({ ownershipId, garageId, garage }: { ownershipId: string; garageId: string; garage: any }) {
  const { data: reviews = [], isLoading: loadingReviews } = useGarageReviewsForOwner(garageId);
  const reviewIds = reviews.map(r => r.id);
  const { data: responses = [] } = useReviewResponses(reviewIds);
  const { data: quotes = [], isLoading: loadingQuotes } = useGarageQuoteRequests(garageId);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const responseMap = new Map(responses.map(r => [r.review_id, r]));
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—';
  const pendingCount = quotes.filter(q => q.status === 'pending').length;

  const filteredQuotes = quotes.filter(q => statusFilter === 'all' || q.status === statusFilter);
  const isRecent = (date: string) => Date.now() - new Date(date).getTime() < 24 * 60 * 60 * 1000;

  return (
    <motion.div className="py-5 space-y-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="surface-card p-4">
        <h2 className="text-base font-bold text-foreground">{garage.name}</h2>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="text-center p-2 rounded-xl bg-primary/5">
            <p className="text-lg font-bold text-primary">{reviews.length}</p>
            <p className="text-[10px] text-muted-foreground">Avis</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-primary/5">
            <p className="text-lg font-bold text-primary">{avgRating}</p>
            <p className="text-[10px] text-muted-foreground">Note moy.</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-primary/5 relative">
            <p className="text-lg font-bold text-primary">{quotes.length}</p>
            <p className="text-[10px] text-muted-foreground">Devis</p>
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 text-[9px] font-bold text-amber-600 bg-amber-500/15 px-1.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="reviews">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="reviews" className="text-xs"><MessageSquare className="w-3.5 h-3.5 mr-1" /> Avis ({reviews.length})</TabsTrigger>
          <TabsTrigger value="quotes" className="text-xs"><FileText className="w-3.5 h-3.5 mr-1" /> Devis ({quotes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="mt-3 space-y-2">
          {loadingReviews ? <Skeleton className="h-20" /> : reviews.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Aucun avis pour le moment</p>
          ) : reviews.map(review => (
            <ReviewWithResponse key={review.id} review={review} response={responseMap.get(review.id)} ownershipId={ownershipId} />
          ))}
        </TabsContent>

        <TabsContent value="quotes" className="mt-3 space-y-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`text-[10px] px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === f.id ? 'bg-primary text-primary-foreground' : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {loadingQuotes ? <Skeleton className="h-20" /> : filteredQuotes.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Aucune demande de devis</p>
          ) : filteredQuotes.map(q => (
            <div key={q.id} className="surface-card p-3 space-y-1.5">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground capitalize">{q.vehicle_type} · {q.service_type}</span>
                    {isRecent(q.created_at) && (
                      <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Nouveau</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{q.plate}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                  q.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                  q.status === 'accepted' ? 'bg-primary/10 text-primary' :
                  q.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                  'bg-emerald-500/10 text-emerald-600'
                }`}>
                  {q.status === 'pending' ? 'En attente' : q.status === 'accepted' ? 'Accepté' : q.status === 'rejected' ? 'Refusé' : 'Terminé'}
                </span>
              </div>
              <p className="text-xs text-foreground/70">{q.description}</p>
              <p className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(q.created_at), { addSuffix: true, locale: fr })}</p>
              <QuoteStatusActions quoteId={q.id} status={q.status} />
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

function ReviewWithResponse({ review, response, ownershipId }: { review: any; response: any; ownershipId: string }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      const { error } = await supabase.from('review_responses').insert({
        review_id: review.id,
        garage_owner_id: ownershipId,
        text: replyText.trim(),
      });
      if (error) throw error;
      toast.success('Réponse publiée');
      setShowReply(false);
      setReplyText('');
    } catch {
      toast.error('Erreur lors de la réponse');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="surface-card p-3 space-y-2">
      <div className="flex justify-between">
        <span className="text-xs font-semibold text-foreground">{review.author_name}</span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} className={`w-3 h-3 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
          ))}
        </div>
      </div>
      <p className="text-xs text-foreground/70">{review.text}</p>
      <p className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: fr })}</p>

      {response ? (
        <div className="p-2 rounded-lg bg-primary/5 border-l-2 border-primary/30">
          <p className="text-[10px] font-semibold text-primary mb-0.5">Réponse du garage</p>
          <p className="text-xs text-foreground/70">{response.text}</p>
        </div>
      ) : (
        <>
          {!showReply ? (
            <Button variant="ghost" size="sm" className="text-[10px] h-6" onClick={() => setShowReply(true)}>Répondre</Button>
          ) : (
            <div className="space-y-2">
              <Textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Votre réponse..." className="min-h-[60px] text-xs resize-none" />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-[10px] h-6" onClick={() => setShowReply(false)}>Annuler</Button>
                <Button size="sm" className="text-[10px] h-6" onClick={handleReply} disabled={sending}>
                  <Send className="w-3 h-3" /> {sending ? '...' : 'Envoyer'}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
