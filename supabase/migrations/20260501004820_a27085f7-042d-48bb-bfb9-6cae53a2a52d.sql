CREATE TABLE public.garage_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  garage_id UUID NOT NULL REFERENCES public.garages(id) ON DELETE CASCADE,
  business_email TEXT NOT NULL,
  justification TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  review_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  UNIQUE (user_id, garage_id)
);

ALTER TABLE public.garage_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own claims"
  ON public.garage_claims FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users create own claims"
  ON public.garage_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins update claims"
  ON public.garage_claims FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.process_garage_claim()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  garage_website TEXT;
  garage_domain TEXT;
  email_domain TEXT;
BEGIN
  IF NEW.status <> 'pending' THEN
    RETURN NEW;
  END IF;

  SELECT website INTO garage_website FROM public.garages WHERE id = NEW.garage_id;

  IF garage_website IS NOT NULL AND garage_website <> '' THEN
    garage_domain := lower(regexp_replace(garage_website, '^(https?://)?(www\.)?([^/]+).*$', '\3'));
    email_domain := lower(split_part(NEW.business_email, '@', 2));

    IF garage_domain IS NOT NULL AND email_domain IS NOT NULL
       AND (email_domain = garage_domain OR email_domain LIKE '%.' || garage_domain) THEN
      NEW.status := 'approved';
      NEW.reviewed_at := now();
      NEW.review_note := 'Auto-approuvé : domaine email correspond au site du garage';

      INSERT INTO public.garage_owners (user_id, garage_id)
      VALUES (NEW.user_id, NEW.garage_id)
      ON CONFLICT DO NOTHING;

      INSERT INTO public.user_roles (user_id, role)
      VALUES (NEW.user_id, 'garage_owner')
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_process_garage_claim
  BEFORE INSERT ON public.garage_claims
  FOR EACH ROW
  EXECUTE FUNCTION public.process_garage_claim();

CREATE OR REPLACE FUNCTION public.handle_claim_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status <> 'approved' THEN
    INSERT INTO public.garage_owners (user_id, garage_id)
    VALUES (NEW.user_id, NEW.garage_id)
    ON CONFLICT DO NOTHING;

    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'garage_owner')
    ON CONFLICT DO NOTHING;

    NEW.reviewed_at := COALESCE(NEW.reviewed_at, now());
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_handle_claim_approval
  BEFORE UPDATE ON public.garage_claims
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_claim_approval();