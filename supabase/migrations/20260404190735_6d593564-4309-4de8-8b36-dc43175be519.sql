
-- 1. Add vehicle_types to garages
ALTER TABLE public.garages ADD COLUMN vehicle_types jsonb NOT NULL DEFAULT '["voiture"]'::jsonb;

-- 2. Add verified + invoice_url to reviews
ALTER TABLE public.reviews ADD COLUMN invoice_url text;
ALTER TABLE public.reviews ADD COLUMN verified boolean NOT NULL DEFAULT false;

-- 3. Add garage_owner to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'garage_owner';

-- 4. Create garage_owners table FIRST (referenced by others)
CREATE TABLE public.garage_owners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  garage_id uuid NOT NULL REFERENCES public.garages(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, garage_id)
);
ALTER TABLE public.garage_owners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can view own links" ON public.garage_owners FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage garage owners" ON public.garage_owners FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 5. Create quote_requests table
CREATE TABLE public.quote_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  garage_id uuid NOT NULL REFERENCES public.garages(id) ON DELETE CASCADE,
  user_id uuid,
  plate text NOT NULL,
  vehicle_type text NOT NULL DEFAULT 'voiture',
  service_type text NOT NULL DEFAULT 'autre',
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create quote requests" ON public.quote_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own quote requests" ON public.quote_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Garage owners can view their quotes" ON public.quote_requests FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.garage_owners go WHERE go.user_id = auth.uid() AND go.garage_id = quote_requests.garage_id)
);
CREATE POLICY "Garage owners can update quote status" ON public.quote_requests FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.garage_owners go WHERE go.user_id = auth.uid() AND go.garage_id = quote_requests.garage_id)
);

-- 6. Create review_responses table
CREATE TABLE public.review_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id uuid NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  garage_owner_id uuid NOT NULL REFERENCES public.garage_owners(id) ON DELETE CASCADE,
  text text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Review responses are publicly readable" ON public.review_responses FOR SELECT USING (true);
CREATE POLICY "Garage owners can respond" ON public.review_responses FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.garage_owners go WHERE go.id = garage_owner_id AND go.user_id = auth.uid())
);

-- 7. Create user_vehicles table
CREATE TABLE public.user_vehicles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL DEFAULT 'voiture',
  brand text NOT NULL,
  model text NOT NULL,
  plate text,
  year integer,
  mileage integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.user_vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own vehicles" ON public.user_vehicles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_user_vehicles_updated_at BEFORE UPDATE ON public.user_vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Create maintenance_records table
CREATE TABLE public.maintenance_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id uuid NOT NULL REFERENCES public.user_vehicles(id) ON DELETE CASCADE,
  garage_id uuid REFERENCES public.garages(id) ON DELETE SET NULL,
  service_type text NOT NULL,
  description text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  mileage_at_service integer,
  next_service_date date,
  cost numeric(10,2),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own maintenance records" ON public.maintenance_records FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_vehicles v WHERE v.id = vehicle_id AND v.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_vehicles v WHERE v.id = vehicle_id AND v.user_id = auth.uid())
);

-- 9. Storage bucket for review invoices
INSERT INTO storage.buckets (id, name, public) VALUES ('review-invoices', 'review-invoices', false);
CREATE POLICY "Users can upload own invoices" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'review-invoices' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own invoices" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'review-invoices' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Admins can view all invoices" ON storage.objects FOR SELECT USING (bucket_id = 'review-invoices' AND public.has_role(auth.uid(), 'admin'));
