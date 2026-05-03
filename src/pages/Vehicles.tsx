import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Car, Bike, Truck, Zap, BatteryCharging, Trash2, Wrench, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useUserVehicles, useCreateVehicle, useDeleteVehicle, useMaintenanceRecords, useCreateMaintenanceRecord } from '@/hooks/useVehicles';
import { useGarages } from '@/hooks/useGarages';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

const VEHICLE_ICONS: Record<string, typeof Car> = {
  voiture: Car,
  moto: Bike,
  camion: Truck,
  trottinette: Zap,
  velo: BatteryCharging,
};

const SERVICE_TYPES = [
  'Vidange', 'Révision', 'Freins', 'Pneus', 'Batterie', 'Diagnostic', 'Carrosserie', 'Autre',
];

const VehicleMaintenanceLog = ({ vehicleId }: { vehicleId: string }) => {
  const { data: records = [], isLoading } = useMaintenanceRecords(vehicleId);
  const { data: garages = [] } = useGarages();
  const createRecord = useCreateMaintenanceRecord();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ service_type: '', description: '', date: new Date().toISOString().split('T')[0], mileage_at_service: '', cost: '', next_service_date: '' });

  const garageMap = new Map(garages.map(g => [g.id, g.name]));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRecord.mutateAsync({
        vehicle_id: vehicleId,
        service_type: form.service_type,
        description: form.description || undefined,
        date: form.date,
        mileage_at_service: form.mileage_at_service ? Number(form.mileage_at_service) : undefined,
        cost: form.cost ? Number(form.cost) : undefined,
        next_service_date: form.next_service_date || undefined,
      });
      setForm({ service_type: '', description: '', date: new Date().toISOString().split('T')[0], mileage_at_service: '', cost: '', next_service_date: '' });
      setShowForm(false);
      toast.success('Intervention ajoutée');
    } catch {
      toast.error("Erreur lors de l'ajout");
    }
  };

  return (
    <div className="space-y-2 mt-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground flex items-center gap-1"><Wrench className="w-3 h-3" /> Entretiens</span>
        <Button variant="ghost" size="sm" className="text-[10px] h-6" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : <><Plus className="w-3 h-3" /> Ajouter</>}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="p-3 rounded-xl bg-primary/5 border border-primary/15 space-y-2">
          <Select value={form.service_type} onValueChange={v => setForm(f => ({ ...f, service_type: v }))}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Type..." /></SelectTrigger>
            <SelectContent>{SERVICE_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="h-8 text-xs" />
            <Input type="number" placeholder="Km" value={form.mileage_at_service} onChange={e => setForm(f => ({ ...f, mileage_at_service: e.target.value }))} className="h-8 text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input type="number" placeholder="Coût (€)" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} className="h-8 text-xs" />
            <Input type="date" placeholder="Prochain" value={form.next_service_date} onChange={e => setForm(f => ({ ...f, next_service_date: e.target.value }))} className="h-8 text-xs" />
          </div>
          <Input placeholder="Description (optionnel)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="h-8 text-xs" />
          <Button type="submit" size="sm" className="w-full text-xs h-7" disabled={!form.service_type || createRecord.isPending}>
            {createRecord.isPending ? 'Ajout...' : 'Enregistrer'}
          </Button>
        </form>
      )}

      {isLoading ? <Skeleton className="h-12" /> : records.length === 0 ? (
        <p className="text-[10px] text-muted-foreground text-center py-2">Aucun entretien enregistré</p>
      ) : (
        <div className="space-y-1.5">
          {records.map(r => {
            const isOverdue = r.next_service_date && new Date(r.next_service_date) < new Date();
            return (
              <div key={r.id} className={`p-2 rounded-lg border text-xs space-y-0.5 ${isOverdue ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-secondary/30'}`}>
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">{r.service_type}</span>
                  <span className="text-muted-foreground">{r.date}</span>
                </div>
                {r.description && <p className="text-muted-foreground">{r.description}</p>}
                <div className="flex gap-3 text-[10px] text-muted-foreground">
                  {r.mileage_at_service && <span>{r.mileage_at_service.toLocaleString()} km</span>}
                  {r.cost && <span>{Number(r.cost).toFixed(0)} €</span>}
                  {r.garage_id && garageMap.has(r.garage_id) && <span>{garageMap.get(r.garage_id)}</span>}
                </div>
                {isOverdue && (
                  <div className="flex items-center gap-1 text-[10px] text-destructive font-semibold">
                    <Calendar className="w-3 h-3" /> Entretien en retard !
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Vehicles = () => {
  const { user, loading } = useAuth();
  const { data: vehicles = [], isLoading } = useUserVehicles();
  const createVehicle = useCreateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ type: 'voiture', brand: '', model: '', plate: '', year: '', mileage: '' });

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVehicle.mutateAsync({
        user_id: user.id,
        type: form.type,
        brand: form.brand,
        model: form.model,
        plate: form.plate || undefined,
        year: form.year ? Number(form.year) : undefined,
        mileage: form.mileage ? Number(form.mileage) : undefined,
      });
      setForm({ type: 'voiture', brand: '', model: '', plate: '', year: '', mileage: '' });
      setShowAdd(false);
      toast.success('Véhicule ajouté !');
    } catch {
      toast.error("Erreur lors de l'ajout");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/profile" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Profil</span>
          </Link>
          <h1 className="text-sm font-bold text-foreground">Mes véhicules</h1>
          <Button variant="ghost" size="sm" onClick={() => setShowAdd(!showAdd)} className="text-xs">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="pt-14 pb-24 md:pb-12 max-w-4xl mx-auto px-4">
        {showAdd && (
          <motion.form
            onSubmit={handleAdd}
            className="mt-4 p-4 surface-card space-y-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs font-semibold text-foreground">Ajouter un véhicule</p>
            <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(VEHICLE_ICONS).map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Marque *" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} required className="h-9 text-xs" />
              <Input placeholder="Modèle *" value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} required className="h-9 text-xs" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="Plaque" value={form.plate} onChange={e => setForm(f => ({ ...f, plate: e.target.value }))} className="h-9 text-xs" />
              <Input type="number" placeholder="Année" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} className="h-9 text-xs" />
              <Input type="number" placeholder="Km" value={form.mileage} onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))} className="h-9 text-xs" />
            </div>
            <Button type="submit" size="sm" className="w-full text-xs" disabled={createVehicle.isPending}>
              {createVehicle.isPending ? 'Ajout...' : 'Ajouter'}
            </Button>
          </motion.form>
        )}

        <div className="mt-4 space-y-3">
          {isLoading ? (
            [1, 2].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Car className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Aucun véhicule enregistré</p>
              <Button variant="outline" size="sm" onClick={() => setShowAdd(true)}>Ajouter un véhicule</Button>
            </div>
          ) : (
            vehicles.map((v, i) => {
              const Icon = VEHICLE_ICONS[v.type] || Car;
              const expanded = expandedId === v.id;
              return (
                <motion.div
                  key={v.id}
                  className="surface-card p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">{v.brand} {v.model}</h3>
                      <p className="text-[10px] text-muted-foreground">
                        {v.plate && `${v.plate} · `}{v.year && `${v.year} · `}{v.mileage ? `${v.mileage.toLocaleString()} km` : ''}
                      </p>
                    </div>
                    <button onClick={() => setExpandedId(expanded ? null : v.id)} className="text-muted-foreground hover:text-foreground">
                      {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Supprimer ce véhicule ?')) {
                          await deleteVehicle.mutateAsync(v.id);
                          toast.success('Véhicule supprimé');
                        }
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {expanded && <VehicleMaintenanceLog vehicleId={v.id} />}
                </motion.div>
              );
            })
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Vehicles;
