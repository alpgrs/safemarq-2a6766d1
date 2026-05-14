import { Search, Home, Trophy, Bookmark, LogOut, User, Briefcase, Shield } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGarageOwnership } from '@/hooks/useDashboard';
import { useIsAdmin } from '@/hooks/useAdmin';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';

const navLinks = [
  { id: 'home', label: 'Accueil', icon: Home, to: '/' },
  { id: 'pro', label: 'Pour les pros', icon: Briefcase, to: '/pro' },
  { id: 'favorites', label: 'Favoris', icon: Bookmark, to: '/favorites' },
];

interface StickyHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const StickyHeader = ({ searchQuery, onSearchChange }: StickyHeaderProps) => {
  const [localQuery, setLocalQuery] = useState('');
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { data: ownerships = [] } = useGarageOwnership();
  const { data: isAdmin } = useIsAdmin();
  const isOwner = ownerships.length > 0;

  const query = searchQuery ?? localQuery;
  const setQuery = onSearchChange ?? setLocalQuery;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Top row */}
        <div className="h-14 md:h-16 flex items-center justify-between gap-4">
          <Logo size={28} wordmarkClassName="text-[13px] md:text-sm" />


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
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.id}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin" className="hidden md:flex items-center gap-1.5 text-xs text-red-500 font-semibold hover:text-red-400 transition-colors">
                    <Shield className="w-3.5 h-3.5" /> Admin
                  </Link>
                )}
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
