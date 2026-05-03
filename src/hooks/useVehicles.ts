import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useUserVehicles() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user-vehicles', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_vehicles')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      user_id: string;
      type: string;
      brand: string;
      model: string;
      plate?: string;
      year?: number;
      mileage?: number;
    }) => {
      const { error } = await supabase.from('user_vehicles').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-vehicles'] });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('user_vehicles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-vehicles'] });
    },
  });
}

export function useMaintenanceRecords(vehicleId: string) {
  return useQuery({
    queryKey: ['maintenance-records', vehicleId],
    enabled: !!vehicleId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateMaintenanceRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      vehicle_id: string;
      garage_id?: string;
      service_type: string;
      description?: string;
      date: string;
      mileage_at_service?: number;
      next_service_date?: string;
      cost?: number;
    }) => {
      const { error } = await supabase.from('maintenance_records').insert(data);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-records', vars.vehicle_id] });
    },
  });
}
