import { useState } from 'react';
import { Check, X, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUpdateQuoteStatus, type QuoteStatus } from '@/hooks/useQuoteRequests';
import { toast } from 'sonner';

interface Props {
  quoteId: string;
  status: string;
}

type PendingAction = {
  status: QuoteStatus;
  title: string;
  description: string;
  confirmLabel: string;
  successMessage: string;
} | null;

const QuoteStatusActions = ({ quoteId, status }: Props) => {
  const update = useUpdateQuoteStatus();
  const [pending, setPending] = useState<PendingAction>(null);

  const ask = (action: NonNullable<PendingAction>) => setPending(action);

  const confirm = async () => {
    if (!pending) return;
    const action = pending;
    setPending(null);
    try {
      await update.mutateAsync({ id: quoteId, status: action.status });
      toast.success(action.successMessage);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Action impossible, réessayez.';
      toast.error('Échec de la mise à jour', { description: message });
    }
  };

  let trigger: JSX.Element | null = null;

  if (status === 'pending') {
    trigger = (
      <div className="flex gap-1.5 mt-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            ask({
              status: 'accepted',
              title: 'Accepter cette demande ?',
              description: 'Le client sera notifié que vous prenez en charge sa demande de devis.',
              confirmLabel: 'Accepter',
              successMessage: 'Demande acceptée',
            })
          }
          disabled={update.isPending}
          className="text-[10px] h-6 flex-1"
        >
          <Check className="w-3 h-3" /> Accepter
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            ask({
              status: 'rejected',
              title: 'Refuser cette demande ?',
              description: 'Cette action est définitive. Le client verra que sa demande a été refusée.',
              confirmLabel: 'Refuser',
              successMessage: 'Demande refusée',
            })
          }
          disabled={update.isPending}
          className="text-[10px] h-6 flex-1"
        >
          <X className="w-3 h-3" /> Refuser
        </Button>
      </div>
    );
  } else if (status === 'accepted') {
    trigger = (
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          ask({
            status: 'completed',
            title: 'Marquer comme terminée ?',
            description: 'Confirmez que la prestation a bien été réalisée pour ce client.',
            confirmLabel: 'Marquer terminé',
            successMessage: 'Demande marquée comme terminée',
          })
        }
        disabled={update.isPending}
        className="text-[10px] h-6 mt-1"
      >
        <CheckCheck className="w-3 h-3" /> Marquer terminé
      </Button>
    );
  }

  if (!trigger) return null;

  return (
    <>
      {trigger}
      <AlertDialog open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pending?.title}</AlertDialogTitle>
            <AlertDialogDescription>{pending?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={update.isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirm} disabled={update.isPending}>
              {update.isPending ? '...' : pending?.confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default QuoteStatusActions;
