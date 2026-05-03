import { useState, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, Search, CheckCircle2, Clock, XCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useGarages } from '@/hooks/useGarages';
import { useUserClaims, useCreateClaim } from '@/hooks/useGarageClaims';
import { useGarageOwnership } from '@/hooks/useDashboard';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

const ClaimGarage = () => {
  const { user, loading } = useAuth();
  const { data: garages = [] } = useGarages();
  const { data: claims = [] } = useUserClaims();
  const { data: ownerships = [] } = useGarageOwnership();
  const createClaim = useCreateClaim();

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [justification, setJustification] = useState('');

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const ownedIds = new Set(ownerships.map((o) => o.garage_id));
  const claimedIds = new Map(claims.map((c) => [c.garage_id, c.status]));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return garages
      .filter((g) => g.name.toLowerCase().includes(q) || g.address.toLowerCase().includes(q))
      .slice(0, 8);
  }, [garages, search]);

  const selected = garages.find((g) => g.id === selectedId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (!email.includes('@')) {
      toast.error('Email invalide');
      return;
    }
    try {
      await createClaim.mutateAsync({
        garage_id: selected.id,
        business_email: email.trim(),
        justification: justification.trim(),
      });
      toast.success('Demande envoyée ! Vérification en cours...');
      setSelectedId(null);
      setEmail('');
      setJustification('');
      setSearch('');
    } catch (err: any) {
      if (err?.message?.includes('duplicate')) {
        toast.error('Vous avez déjà une demande pour ce garage');
      } else {
        toast.error("Erreur lors de l'envoi de la demande");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-primary" /> Espace Pro — Revendiquer une fiche
          </h1>
        </div>
      </header>

      <main className="pt-20 pb-24 md:pb-12 max-w-2xl mx-auto px-4 space-y-5">
        {ownerships.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface-card p-4 border-l-2 border-primary"
          >
            <p className="text-xs text-muted-foreground mb-2">Vous gérez déjà {ownerships.length} fiche(s)</p>
            <Link to="/dashboard">
              <Button size="sm" className="text-xs">
                Accéder au Dashboard <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-5 space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Êtes-vous le propriétaire ?</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Recherchez votre garage et confirmez avec votre email professionnel pour gérer la fiche, répondre aux avis et recevoir les devis.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Recherchez votre garage</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedId(null);
                }}
                placeholder="Nom ou adresse du garage..."
                className="pl-9 text-sm"
              />
            </div>
            {filtered.length > 0 && !selectedId && (
              <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                {filtered.map((g) => {
                  const status = claimedIds.get(g.id);
                  const owned = ownedIds.has(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      disabled={owned || status === 'pending' || status === 'approved'}
                      onClick={() => {
                        setSelectedId(g.id);
                        setSearch(g.name);
                      }}
                      className="w-full text-left p-3 hover:bg-secondary/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{g.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{g.address}</p>
                        </div>
                        {owned && <span className="text-[10px] text-primary font-bold">Déjà géré</span>}
                        {status === 'pending' && <span className="text-[10px] text-amber-500 font-bold">En attente</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selected && (
            <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-border">
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs font-semibold text-foreground">{selected.name}</p>
                <p className="text-[11px] text-muted-foreground">{selected.address}</p>
                {selected.website && (
                  <p className="text-[11px] text-primary mt-1">Site : {selected.website}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Email professionnel *</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selected.website ? `nom@${selected.website.replace(/^https?:\/\//, '').replace(/^www\./, '')}` : 'votre@email-pro.com'}
                  required
                  className="text-sm"
                />
                <p className="text-[10px] text-muted-foreground">
                  Approbation automatique si l'email correspond au domaine du site du garage.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Justification (optionnel)</Label>
                <Textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Votre rôle dans le garage, informations complémentaires..."
                  className="min-h-[60px] text-sm resize-none"
                  maxLength={300}
                />
              </div>

              <Button type="submit" disabled={createClaim.isPending} className="w-full text-xs">
                {createClaim.isPending ? 'Envoi...' : 'Envoyer la demande'}
              </Button>
            </form>
          )}
        </motion.div>

        {claims.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Mes demandes</h3>
            {claims.map((c) => {
              const garage = garages.find((g) => g.id === c.garage_id);
              return (
                <div key={c.id} className="surface-card p-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{garage?.name || 'Garage'}</p>
                    {c.review_note && <p className="text-[10px] text-muted-foreground">{c.review_note}</p>}
                  </div>
                  {c.status === 'approved' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Approuvé
                    </span>
                  )}
                  {c.status === 'pending' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3" /> En attente
                    </span>
                  )}
                  {c.status === 'rejected' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-1 rounded-full">
                      <XCircle className="w-3 h-3" /> Refusé
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default ClaimGarage;
