import { Search, MapPin, Star, ShieldCheck, FileCheck, Flag } from 'lucide-react';

const SERVICES = [
  'Mécanique générale', 'Carrosserie', 'Pneumatique', 'Vitrage', 'Contrôle technique',
  'Diagnostic', 'Climatisation', 'Échappement', 'Détaillage', 'Dépannage',
];

const CHIPS = [
  'Vidange à Bruxelles', 'Carrosserie à Liège', 'Pneus à Anvers',
  'Contrôle technique Wallonie', 'Vitrage à Gand', 'Diagnostic à Charleroi',
];

export default function SafemarqHero({ count = 8420 }: { count?: number }) {
  return (
    <section className="bg-[#FAFAFA] border-b border-[#E5E5E5]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10 md:py-14">
        <h1
          className="text-3xl md:text-5xl font-bold text-[#0F0F0F] tracking-tight max-w-3xl leading-tight"
          style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
        >
          Comparez les garages et carrossiers en Belgique
        </h1>
        <p className="mt-3 text-[15px] md:text-base text-[#444] max-w-2xl leading-relaxed">
          <strong className="text-[#0F0F0F]">{count.toLocaleString('fr-BE')}</strong> établissements notés,
          basés sur les avis Google et nos évaluations indépendantes. Tous corps de métier.
        </p>

        {/* Search bar */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-6 bg-white border border-[#D4D4D4] rounded-lg p-2 flex flex-col md:flex-row gap-2 shadow-sm max-w-4xl"
        >
          <div className="flex items-center gap-2 flex-1 px-3 border-b md:border-b-0 md:border-r border-[#E5E5E5]">
            <Search className="w-4 h-4 text-[#666] shrink-0" />
            <select className="w-full py-3 bg-transparent text-sm text-[#0F0F0F] focus:outline-none">
              <option value="">Choisir un service</option>
              {SERVICES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1 px-3">
            <MapPin className="w-4 h-4 text-[#666] shrink-0" />
            <input
              type="text"
              placeholder="Ville ou code postal"
              className="w-full py-3 bg-transparent text-sm text-[#0F0F0F] placeholder:text-[#999] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-[#0052CC] text-white font-semibold text-sm px-8 py-3 rounded hover:bg-[#003D99] transition-colors"
          >
            Comparer
          </button>
        </form>

        {/* Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {CHIPS.map(c => (
            <button
              key={c}
              className="text-xs text-[#0052CC] border border-[#D4D4D4] bg-white px-3 py-1.5 rounded-full hover:border-[#0052CC] hover:bg-[#EEF4FF] transition-colors"
            >
              {c}
            </button>
          ))}
        </div>

        {/* Trust signals */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#555]">
          <span className="inline-flex items-center gap-1.5"><Flag className="w-3.5 h-3.5 text-[#00875A]" /> 100% Belgique</span>
          <span className="inline-flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-[#FFB400] fill-[#FFB400]" /> Avis vérifiés Google</span>
          <span className="inline-flex items-center gap-1.5"><FileCheck className="w-3.5 h-3.5 text-[#0052CC]" /> Données Car-Pass compatibles</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#00875A]" /> Indépendant — aucun garage ne paie pour mieux se classer</span>
        </div>
      </div>
    </section>
  );
}
