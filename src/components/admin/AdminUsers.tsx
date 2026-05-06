import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminUsers, useSetUserRole, type AdminUser } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';

const ROLES = ['user', 'moderator', 'admin', 'garage_owner'] as const;
type Role = typeof ROLES[number];

const roleBadge = (role: string) => {
  if (role === 'admin') return 'bg-red-500/10 text-red-500';
  if (role === 'moderator') return 'bg-violet-500/10 text-violet-500';
  if (role === 'garage_owner') return 'bg-emerald-500/10 text-emerald-600';
  return 'bg-secondary/60 text-muted-foreground';
};

const roleLabel = (role: string) => {
  if (role === 'admin') return 'Admin';
  if (role === 'moderator') return 'Modérateur';
  if (role === 'garage_owner') return 'Garagiste';
  return 'Utilisateur';
};

const UserRow = ({ user, currentUserId }: { user: AdminUser; currentUserId: string }) => {
  const setRole = useSetUserRole();
  const isSelf = user.id === currentUserId;

  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-semibold text-foreground truncate">
            {user.email}
            {isSelf && (
              <span className="ml-2 text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Vous</span>
            )}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Inscrit {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: fr })}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${roleBadge(user.role)}`}>
            {roleLabel(user.role)}
          </span>
          {!isSelf && (
            <select
              value={user.role}
              onChange={e => setRole.mutate({ userId: user.id, role: e.target.value })}
              disabled={setRole.isPending}
              className="text-xs bg-card border border-border rounded-lg px-2 py-1 text-foreground outline-none focus:border-primary/50 transition-colors cursor-pointer"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{roleLabel(r)}</option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const [search, setSearch] = useState('');
  const { data: users = [], isLoading } = useAdminUsers();
  const { user: currentUser } = useAuth();

  const filtered = users.filter(u => {
    if (!search.trim()) return true;
    return u.email.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border focus-within:border-primary/50 transition-colors">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Rechercher par email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{filtered.length} utilisateur{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(u => (
            <UserRow key={u.id} user={u} currentUserId={currentUser?.id ?? ''} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
