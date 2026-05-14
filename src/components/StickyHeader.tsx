import { Search, Home, Bookmark, LogOut, User, Briefcase, Shield, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { data: ownerships = [] } = useGarageOwnership();
  const { data: isAdmin } = useIsAdmin();
  const isOwner = ownerships.length > 0;

  const query = searchQuery ?? localQuery;
  const setQuery = onSearchChange ?? setLocalQuery;

  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;

    // Save last focused element and focus first item in menu
    lastFocusedRef.current = document.activeElement as HTMLElement;
    const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      if (e.key !== 'Tab' || !menuRef.current) return;

      const nodes = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      lastFocusedRef.current?.focus();
    };
  }, [menuOpen, closeMenu]);

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
            {/* Burger — mobile only */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-foreground hover:bg-secondary/60 transition-colors"
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop user actions */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center gap-1.5 text-xs text-red-500 font-semibold hover:text-red-400 transition-colors">
                      <Shield className="w-3.5 h-3.5" /> Admin
                    </Link>
                  )}
                  {isOwner && (
                    <Link to="/dashboard" className="flex items-center gap-1.5 text-xs md:text-sm text-primary font-semibold hover:text-primary/80 transition-colors">
                      <Briefcase className="w-4 h-4" /> Pro
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <User className="w-4 h-4" />
                    <span>{user.email?.split('@')[0]}</span>
                  </Link>
                  <button onClick={signOut} className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="text-xs md:text-sm text-primary font-semibold hover:text-primary/80 transition-colors">
                  Se connecter
                </Link>
              )}
            </div>
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

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMenu}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[min(320px,85vw)] bg-background border-l border-border z-50 md:hidden flex flex-col"
            >
              <div className="h-14 flex items-center justify-between px-4 border-b border-border">
                <span className="text-sm font-bold text-foreground">Menu</span>
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-lg text-foreground hover:bg-secondary/60 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.id}
                      to={link.to}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}

                <div className="border-t border-border my-2" />

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Shield className="w-5 h-5" /> Admin
                  </Link>
                )}
                {isOwner && (
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Briefcase className="w-5 h-5" /> Dashboard Pro
                  </Link>
                )}
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                    >
                      <User className="w-5 h-5" /> Mon profil
                    </Link>
                    <button
                      onClick={() => {
                        closeMenu();
                        signOut();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                    >
                      <LogOut className="w-5 h-5" /> Déconnexion
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                  >
                    <User className="w-5 h-5" /> Se connecter
                  </Link>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default StickyHeader;
