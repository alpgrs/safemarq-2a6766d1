import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border bg-background/40 mt-8 pb-24 md:pb-6 pt-8">
    <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
      <div className="col-span-2 md:col-span-1 space-y-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="font-bold text-foreground">Trustmarq</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          La plateforme de confiance pour comparer les garages automobiles en Belgique.
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-foreground">Plateforme</p>
        <ul className="space-y-1.5 text-muted-foreground">
          <li><Link to="/" className="hover:text-foreground">Rechercher</Link></li>
          <li><Link to="/about" className="hover:text-foreground">Notre méthode</Link></li>
          <li><Link to="/pro" className="hover:text-foreground">Pour les garagistes</Link></li>
        </ul>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-foreground">Compte</p>
        <ul className="space-y-1.5 text-muted-foreground">
          <li><Link to="/auth" className="hover:text-foreground">Se connecter</Link></li>
          <li><Link to="/profile" className="hover:text-foreground">Mon profil</Link></li>
          <li><Link to="/favorites" className="hover:text-foreground">Favoris</Link></li>
        </ul>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-foreground">Légal</p>
        <ul className="space-y-1.5 text-muted-foreground">
          <li><Link to="/legal/terms" className="hover:text-foreground">CGU</Link></li>
          <li><Link to="/legal/privacy" className="hover:text-foreground">Confidentialité</Link></li>
          <li><Link to="/legal/cookies" className="hover:text-foreground">Cookies</Link></li>
          <li><Link to="/legal/mentions" className="hover:text-foreground">Mentions légales</Link></li>
        </ul>
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6 pt-4 border-t border-border/50 text-[11px] text-muted-foreground flex flex-wrap justify-between gap-2">
      <span>© {new Date().getFullYear()} Trustmarq. Tous droits réservés.</span>
      <span>Fait en Belgique 🇧🇪</span>
    </div>
  </footer>
);

export default Footer;
