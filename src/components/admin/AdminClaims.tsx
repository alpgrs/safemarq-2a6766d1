import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Building2, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminClaims, useApproveClaim, useRejectClaim, type AdminClaim } from '@/hooks/useAdmin';

const STATUS_FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: 'pending', label: 'En attente' },
  { id: 'approved', label: 'Approuvés' },
  { id: 'rejected', label: 'Rejetés' },
] as const;
type StatusFilter = typeof STATUS_FILTERS[number]['id'];

const statusBadge = (status: string) => {
  if (status === 'pending') return 'bg-amber-500/10 text-amber-600';
  if (status === 'approved') return 'bg-emerald-500/10 text-emerald-600';
  return 'bg-destructive/10 text-destructive';
};

const statusLabel = (status: string) => {
  if (status === 'pending') return 'En attente';
  if (status === 'approved') return 'Approuvé';
  return 'Rejeté';
};

const ClaimRow = ({ claim }: { claim: AdminClaim }) => {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');
  const approveMutation = useApproveClaim();
  const rejectMutation = useRejectClaim();

  const isPending = claim.status === 'pending';
  const busy = approveMutation.isPending || rejectMutation.isPending;

  return (
    <div className="surface-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-semibold text-foreground truncate">
              {claim.garages?.name ?? 'Garage inconnu'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground pl-6">{claim.garages?.address}</p>
          <div className="flex items-center gap-1.5 pl-6">
            <Mail className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-foreground/70">{claim.business_email}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusBadge(claim.status)}`}>
            {statusLabel(claim.status)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(new Date(claim.created_at), { addSuffix: true, locale: fr })}
          </span>
        </div>
      </div>

      {claim.justification && (
        <p className="text-xs text-foreground/70 italic pl-6">"{claim.justification}"</p>
      )}

      {claim.review_note && (
        <div className="pl-6">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-0.5">Note admin</p>
          <p className="text-xs text-foreground/70">{claim.review_note}</p>
        </div>
      )}

      {isPending && (
        <div className="pl-6 space-y-2">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            Ajouter une note (optionnel)
          </button>
          {expanded && (
            <Textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Note visible par le demandeur..."
              className="min-h-[60px] text-xs resize-none"
            />
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => approveMutation.mutate({ claimId: claim.id, note: note || undefined })}
              disabled={busy}
            >
              <CheckCircle2 className="w-3 h-3" /> Approuver
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 border-destructive/50 text-destructive hover:bg-destructive/10"
              onClick={() => rejectMutation.mutate({ claimId: claim.id, note: note || undefined })}
              disabled={busy}
            >
              <XCircle className="w-3 h-3" /> Rejeter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminClaims = () => {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const { data: claims = [], isLoading } = useAdminClaims();

  const filtered = claims.filter(c => filter === 'all' || c.status === filter);
  const pendingCount = claims.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${
                filter === f.id ? 'bg-primary text-primary-foreground' : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
              {f.id === 'pending' && pendingCount > 0 && (
                <span className="ml-1.5 text-[9px] font-bold bg-orange-500 text-white rounded-full px-1.5 py-px">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Aucune revendication</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(claim => <ClaimRow key={claim.id} claim={claim} />)}
        </div>
      )}
    </div>
  );
};

export default AdminClaims;
