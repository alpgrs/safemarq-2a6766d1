import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'trustmarq_cookie_consent';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const decide = (value: 'accepted' | 'rejected') => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement cookies"
      className="fixed bottom-20 md:bottom-4 left-3 right-3 md:left-auto md:right-4 md:max-w-sm z-[60] animate-in slide-in-from-bottom-4"
    >
      <div className="surface-card p-4 space-y-3 shadow-xl border border-border/80">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Cookie className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground">Cookies & vie privée</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Nous utilisons des cookies essentiels au fonctionnement et, avec votre accord, des cookies de mesure d'audience anonymes.{' '}
              <Link to="/legal/cookies" className="text-primary underline">
                En savoir plus
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => decide('rejected')}>
            Refuser
          </Button>
          <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => decide('accepted')}>
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
