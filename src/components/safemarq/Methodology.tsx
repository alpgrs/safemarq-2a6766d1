import { Star, BarChart3, MessageSquare, ClipboardCheck, ArrowRight } from 'lucide-react';

const PILLARS = [
  { icon: Star, weight: '40%', title: 'Avis Google agrégés', text: 'Récupérés via l’API officielle, recalculés chaque semaine.' },
  { icon: BarChart3, weight: '20%', title: 'Volume et récurrence', text: 'Un garage avec 200 avis réguliers compte plus que 10 avis isolés.' },
  { icon: MessageSquare, weight: '15%', title: 'Réponses aux clients', text: 'Un garage qui répond — même aux critiques — gagne en transparence.' },
  { icon: ClipboardCheck, weight: '25%', title: 'Critères SafeMarq', text: 'Devis écrit, garantie affichée, transparence des prix de pièces.' },
];

export default function Methodology() {
  return (
    <section className="bg-white border-b border-[#E5E5E5]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs uppercase tracking-wider text-[#0052CC] font-semibold">Transparence</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F0F0F] mt-1" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
            Comment SafeMarq note les garages
          </h2>
          <p className="text-sm text-[#555] mt-2">
            Aucun garage ne peut acheter sa note. Voici précisément comment notre score sur 100 est calculé.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS.map(p => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="border border-[#E5E5E5] rounded-md p-5 bg-[#FAFAFA]">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded bg-white border border-[#E5E5E5] grid place-items-center">
                    <Icon className="w-5 h-5 text-[#0052CC]" />
                  </div>
                  <span className="text-xs font-bold text-[#00875A] bg-[#E6F4EC] px-2 py-1 rounded">
                    {p.weight}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#0F0F0F]">{p.title}</p>
                <p className="text-xs text-[#555] mt-1.5 leading-relaxed">{p.text}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <a href="#" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0052CC] hover:underline">
            Voir notre méthodologie complète <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
