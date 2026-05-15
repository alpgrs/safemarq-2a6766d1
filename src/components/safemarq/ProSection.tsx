import { Check } from 'lucide-react';

const FEATURES = [
  'Inscription gratuite à votre fiche établissement',
  'Répondez aux avis Google et SafeMarq depuis un seul tableau de bord',
  'Mettez à jour services, horaires, tarifs et certifications',
  'Option premium : mise en avant locale (étiquetée « sponsorisé », transparence garantie)',
  'Statistiques de consultation, demandes de devis et clics téléphone',
];

export default function ProSection() {
  return (
    <section id="pro" className="bg-white border-b border-[#E5E5E5]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-wider text-[#00875A] font-semibold">Pour les professionnels</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F0F0F] mt-1" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
              Vous êtes garagiste ou carrossier ?
            </h2>
            <p className="text-sm text-[#555] mt-3 max-w-2xl leading-relaxed">
              SafeMarq référence automatiquement les établissements à partir de données publiques.
              Revendiquez votre fiche pour la maîtriser et bénéficier d’outils dédiés.
            </p>
            <ul className="mt-5 space-y-2.5">
              {FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[#0F0F0F]">
                  <Check className="w-4 h-4 text-[#00875A] mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center px-5 py-2.5 bg-[#0052CC] text-white text-sm font-semibold rounded hover:bg-[#003D99]"
              >
                Revendiquer ma fiche
              </a>
              <a
                href="#"
                className="inline-flex items-center px-5 py-2.5 border border-[#0F0F0F] text-[#0F0F0F] text-sm font-semibold rounded hover:bg-[#0F0F0F] hover:text-white"
              >
                Voir les tarifs pro
              </a>
            </div>
          </div>

          <aside className="lg:col-span-2 border border-[#E5E5E5] bg-[#FAFAFA] rounded-md p-5">
            <p className="text-xs uppercase tracking-wider text-[#666] font-semibold">En chiffres</p>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
                <dt className="text-[#555]">Pros référencés</dt>
                <dd className="font-semibold text-[#0F0F0F] tabular-nums">8 420</dd>
              </div>
              <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
                <dt className="text-[#555]">Fiches revendiquées</dt>
                <dd className="font-semibold text-[#0F0F0F] tabular-nums">2 137</dd>
              </div>
              <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
                <dt className="text-[#555]">Demandes de devis / mois</dt>
                <dd className="font-semibold text-[#0F0F0F] tabular-nums">14 200</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#555]">Visiteurs uniques / mois</dt>
                <dd className="font-semibold text-[#0F0F0F] tabular-nums">186 000</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}
