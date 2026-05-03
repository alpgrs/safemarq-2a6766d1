import { Search, BadgeCheck, Home, Trophy, Bookmark, LogOut, User, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGarageOwnership } from '@/hooks/useDashboard';
import ThemeToggle from '@/components/ThemeToggle';

const navLinks = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'rankings', label: 'Top Rankings', icon: Trophy },
  { id: 'garage', label: 'My Garage', icon: Bookmark },
];

interface StickyHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const StickyHeader = ({ searchQuery, onSearchChange }: StickyHeaderProps) => {
  const [localQuery, setLocalQuery] = useState('');
  const [activeNav, setActiveNav] = useState('home');
  const { user, signOut } = useAuth();
  const { data: ownerships = [] } = useGarageOwnership();
  const isOwner = ownerships.length > 0;

  const query = searchQuery ?? localQuery;
  const setQuery = onSearchChange ?? setLocalQuery;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Top row */}
        <div className="h-14 md:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-foreground font-bold text-[15px] md:text-lg tracking-tight">
              TRUSTMARQ
            </span>
            <BadgeCheck className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </div>

          {/* Desktop search — inline in header */}
          <div className="hidden md:flex flex-1 max-w-md items-center gap-2.5 px-4 py-2.5 rounded-full bg-card border border-border focus-within:border-primary/50 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search city or car brand..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-full text-sm"
            />
          </div>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveNav(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                    activeNav === link.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                {isOwner && (
                  <Link to="/dashboard" className="hidden md:flex items-center gap-1.5 text-xs md:text-sm text-primary font-semibold hover:text-primary/80 transition-colors">
                    <Briefcase className="w-4 h-4" /> Pro
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">{user.email?.split('@')[0]}</span>
                </Link>
                <button onClick={signOut} className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Déconnexion</span>
                </button>
              </div>
            ) : (
              <Link to="/auth" className="text-xs md:text-sm text-primary font-semibold hover:text-primary/80 transition-colors">
                Se connecter
              </Link>
            )}
          </div>
        </div>

        {/* Mobile search row */}
        <div className="pb-3 md:hidden">
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-card border border-border focus-within:border-primary/50 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search city or car brand..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-full text-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default StickyHeader;
