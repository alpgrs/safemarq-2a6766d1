import { Link } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const TRADES = [
  'Mécanique générale', 'Carrosserie & peinture', 'Pneumatique', 'Vitrage auto',
  'Contrôle technique', 'Diagnostic électronique', 'Soudure', 'Climatisation',
  'Échappement', 'Boîte de vitesses', 'Détaillage', 'Dépannage',
];

export default function SafemarqHeader() {
  const [tradesOpen, setTradesOpen] = useState(false);
  const [lang, setLang] = useState<'FR' | 'NL' | 'EN'>('FR');

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAFA]/95 backdrop-blur border-b border-[#E5E5E5]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-md bg-[#0052CC] grid place-items-center text-white font-black text-sm">S</div>
          <span className="font-extrabold text-[#0F0F0F] tracking-tight text-lg">SafeMarq</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 text-sm text-[#0F0F0F]">
          <a href="#trades" className="hover:text-[#0052CC]">Garages</a>
          <a href="#trades" className="hover:text-[#0052CC]">Carrosseries</a>
          <a href="#trades" className="hover:text-[#0052CC]">Pneus</a>
          <a href="#trades" className="hover:text-[#0052CC]">Vitrage</a>
          <div className="relative">
            <button onClick={() => setTradesOpen(v => !v)} className="flex items-center gap-1 hover:text-[#0052CC]">
              Tous les métiers <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {tradesOpen && (
              <div className="absolute top-full mt-2 left-0 w-72 bg-white border border-[#E5E5E5] shadow-lg rounded-md p-2 grid grid-cols-2 gap-0.5">
                {TRADES.map(t => (
                  <a key={t} href="#trades" className="px-3 py-2 text-xs hover:bg-[#F5F5F5] rounded text-[#0F0F0F]">
                    {t}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="#blog" className="hover:text-[#0052CC]">Blog</a>
          <a href="#about" className="hover:text-[#0052CC]">À propos</a>
        </nav>

        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
            <input
              type="text"
              placeholder="Garage, marque ou ville en Belgique..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5E5E5] rounded-md text-sm text-[#0F0F0F] placeholder:text-[#999] focus:outline-none focus:border-[#0052CC]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto md:ml-0">
          <a
            href="#pro"
            className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-semibold text-[#0052CC] border border-[#0052CC] rounded hover:bg-[#0052CC] hover:text-white transition-colors"
          >
            Inscrire mon garage
          </a>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as 'FR' | 'NL' | 'EN')}
            className="text-xs bg-transparent border border-[#E5E5E5] rounded px-2 py-1 text-[#0F0F0F]"
          >
            <option value="FR">🇫🇷 FR</option>
            <option value="NL">🇳🇱 NL</option>
            <option value="EN">🇬🇧 EN</option>
          </select>
        </div>
      </div>

      {/* mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          <input
            type="text"
            placeholder="Garage, marque ou ville..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5E5E5] rounded-md text-sm"
          />
        </div>
      </div>
    </header>
  );
}
