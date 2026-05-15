import {
  Wrench, SprayCan, CircleDot, Square, ClipboardCheck, Cpu,
  Flame, Snowflake, Wind, Cog, Sparkles, Truck, Star,
} from 'lucide-react';

const TRADES = [
  { name: 'Mécanique générale', icon: Wrench, count: 3210, rating: 4.3 },
  { name: 'Carrosserie & peinture', icon: SprayCan, count: 1480, rating: 4.4 },
  { name: 'Pneumatique', icon: CircleDot, count: 1820, rating: 4.2 },
  { name: 'Vitrage auto', icon: Square, count: 640, rating: 4.0 },
  { name: 'Contrôle technique', icon: ClipboardCheck, count: 320, rating: 3.9 },
  { name: 'Diagnostic électronique', icon: Cpu, count: 890, rating: 4.5 },
  { name: 'Soudure', icon: Flame, count: 410, rating: 4.4 },
  { name: 'Climatisation', icon: Snowflake, count: 720, rating: 4.3 },
  { name: 'Échappement', icon: Wind, count: 530, rating: 4.2 },
  { name: 'Boîte de vitesses', icon: Cog, count: 280, rating: 4.5 },
  { name: 'Détaillage / Esthétique', icon: Sparkles, count: 360, rating: 4.6 },
  { name: 'Dépannage / Remorquage', icon: Truck, count: 470, rating: 4.1 },
];

export default function TradesGrid() {
  return (
    <section id="trades" className="bg-white border-b border-[#E5E5E5]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-[#0052CC] font-semibold">Tous les corps de métier</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F0F0F] mt-1" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
            12 spécialités, un seul comparateur
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {TRADES.map(t => {
            const Icon = t.icon;
            return (
              <a
                key={t.name}
                href="#"
                className="group border border-[#E5E5E5] bg-white hover:border-[#0052CC] hover:shadow-sm rounded-md p-4 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded bg-[#F5F5F5] grid place-items-center group-hover:bg-[#EEF4FF]">
                    <Icon className="w-5 h-5 text-[#0F0F0F] group-hover:text-[#0052CC]" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 fill-[#FFB400] text-[#FFB400]" />
                      <span className="font-semibold text-[#0F0F0F] tabular-nums">{t.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-semibold text-[#0F0F0F] leading-tight">{t.name}</p>
                <p className="text-xs text-[#666] mt-1 tabular-nums">{t.count.toLocaleString('fr-BE')} pros référencés</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
