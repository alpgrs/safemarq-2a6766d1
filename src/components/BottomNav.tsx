import { Home, Heart, User, Car, Briefcase } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGarageOwnership } from '@/hooks/useDashboard';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: ownerships = [] } = useGarageOwnership();
  const isOwner = ownerships.length > 0;

  const tabs = [
    { id: '/', label: 'Accueil', icon: Home },
    { id: '/favorites', label: 'Favoris', icon: Heart },
    isOwner
      ? { id: '/dashboard', label: 'Pro', icon: Briefcase }
      : { id: '/vehicles', label: 'Véhicules', icon: Car },
    { id: '/profile', label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border safe-bottom md:hidden">
      <div className="max-w-lg mx-auto flex items-center justify-around h-14 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className="flex flex-col items-center justify-center gap-0.5 w-20 py-1 transition-all duration-150"
            >
              <Icon className={`w-5 h-5 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <span className={`text-[10px] font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
