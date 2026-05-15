const TRADES = ['Mécanique', 'Carrosserie', 'Pneumatique', 'Vitrage', 'Contrôle technique', 'Diagnostic', 'Climatisation', 'Échappement', 'Soudure', 'Détaillage', 'Boîte de vitesses', 'Dépannage'];
const REGIONS = ['Bruxelles', 'Anvers', 'Liège', 'Gand', 'Charleroi', 'Namur', 'Bruges', 'Louvain', 'Mons', 'Hasselt', 'Tournai', 'Ostende'];
const BRANDS = ['Audi', 'BMW', 'Mercedes', 'Peugeot', 'Renault', 'Volkswagen', 'Ford', 'Opel', 'Citroën', 'Toyota', 'Volvo', 'Skoda'];

export default function SafemarqFooter() {
  return (
    <footer id="about" className="bg-[#0F0F0F] text-[#CCCCCC]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-md bg-[#0052CC] grid place-items-center text-white font-black text-sm">S</div>
            <span className="font-extrabold text-white tracking-tight text-lg">SafeMarq</span>
          </div>
          <p className="text-xs text-[#999] leading-relaxed">
            Comparateur indépendant de garages et carrossiers en Belgique. Données publiques + avis Google API officielle.
          </p>
        </div>

        <div>
          <p className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Métiers</p>
          <ul className="space-y-1.5 text-xs">
            {TRADES.map(t => <li key={t}><a href="#" className="hover:text-white">{t}</a></li>)}
          </ul>
        </div>

        <div>
          <p className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Régions</p>
          <ul className="space-y-1.5 text-xs">
            {REGIONS.map(r => <li key={r}><a href="#" className="hover:text-white">{r}</a></li>)}
          </ul>
        </div>

        <div>
          <p className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Marques</p>
          <ul className="space-y-1.5 text-xs">
            {BRANDS.map(b => <li key={b}><a href="#" className="hover:text-white">{b}</a></li>)}
          </ul>
        </div>

        <div>
          <p className="text-white font-semibold text-xs uppercase tracking-wider mb-3">À propos</p>
          <ul className="space-y-1.5 text-xs">
            <li><a href="#" className="hover:text-white">Notre méthode</a></li>
            <li><a href="#" className="hover:text-white">Équipe</a></li>
            <li><a href="#" className="hover:text-white">Presse</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
          <p className="text-white font-semibold text-xs uppercase tracking-wider mt-5 mb-3">Légal</p>
          <ul className="space-y-1.5 text-xs">
            <li><a href="#" className="hover:text-white">CGU</a></li>
            <li><a href="#" className="hover:text-white">Confidentialité (RGPD)</a></li>
            <li><a href="#" className="hover:text-white">Cookies</a></li>
            <li><a href="#" className="hover:text-white">Mentions légales</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#222]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-5 flex flex-wrap items-center gap-4 justify-between text-[11px] text-[#888]">
          <span>© {new Date().getFullYear()} SafeMarq SRL · BCE 0789.123.456 · Bruxelles, Belgique 🇧🇪</span>
          <span>Indépendant — non affilié aux constructeurs · Données publiques + avis Google API officielle</span>
        </div>
      </div>
    </footer>
  );
}
