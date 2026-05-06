import { Building2, Users, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminStats } from '@/hooks/useAdmin';

const STATS = [
  { key: 'garages' as const, label: 'Garages', icon: Building2, color: 'text-primary', bg: 'bg-primary/10' },
  { key: 'users' as const, label: 'Utilisateurs', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { key: 'reviews' as const, label: 'Avis', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { key: 'pendingClaims' as const, label: 'Revendications en attente', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
];

const AdminStats = () => {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {STATS.map((s, i) => (
        <motion.div
          key={s.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="surface-card p-4 flex flex-col gap-3"
        >
          <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
            <s.icon className={`w-5 h-5 ${s.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {isLoading ? '—' : stats?.[s.key] ?? 0}
              {s.key === 'pendingClaims' && (stats?.pendingClaims ?? 0) > 0 && (
                <span className="ml-2 text-xs font-semibold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full align-middle">!</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStats;
