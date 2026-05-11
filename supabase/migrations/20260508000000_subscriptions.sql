-- Infra d'abonnement Stripe pour les garages (Pro 39€ / Premium 99€)
-- Aucune influence sur le SafeScore ni sur l'ordre de listing.

-- 1) Enums
CREATE TYPE public.garage_tier AS ENUM ('free', 'pro', 'premium');
CREATE TYPE public.subscription_status AS ENUM (
  'active', 'past_due', 'canceled', 'incomplete', 'trialing', 'unpaid', 'incomplete_expired'
);

-- 2) Colonnes tier + premium sur garages
ALTER TABLE public.garages
  ADD COLUMN tier public.garage_tier NOT NULL DEFAULT 'free',
  ADD COLUMN logo_url TEXT,
  ADD COLUMN cover_image_url TEXT,
  ADD COLUMN video_url TEXT,
  ADD COLUMN long_description TEXT,
  ADD COLUMN team JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN certifications JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN faq JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN services_detail JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN promo_banner JSONB;

-- 3) Table des abonnements (1 par garage)
CREATE TABLE public.garage_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  garage_id UUID REFERENCES public.garages(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tier public.garage_tier NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status public.subscription_status NOT NULL,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.garage_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_garage_subscriptions_updated_at
  BEFORE UPDATE ON public.garage_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_garage_subs_customer ON public.garage_subscriptions(stripe_customer_id);
CREATE INDEX idx_garage_subs_status ON public.garage_subscriptions(status);

-- 4) Helper : ce garage a-t-il un tier suffisant ?
CREATE OR REPLACE FUNCTION public.garage_has_tier(_garage_id UUID, _required public.garage_tier)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.garages
    WHERE id = _garage_id
      AND CASE _required
        WHEN 'free' THEN tier IN ('free', 'pro', 'premium')
        WHEN 'pro' THEN tier IN ('pro', 'premium')
        WHEN 'premium' THEN tier = 'premium'
      END
  )
$$;

-- 5) Trigger : propager le statut d'abonnement au tier du garage
CREATE OR REPLACE FUNCTION public.propagate_subscription_to_garage()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IN ('active', 'trialing') THEN
    UPDATE public.garages SET tier = NEW.tier WHERE id = NEW.garage_id;
  ELSIF NEW.status IN ('canceled', 'unpaid', 'incomplete_expired') THEN
    UPDATE public.garages SET tier = 'free' WHERE id = NEW.garage_id;
  END IF;
  -- past_due / incomplete : on garde le tier actuel le temps que Stripe relance
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_subscription_status_change
  AFTER INSERT OR UPDATE OF status, tier ON public.garage_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.propagate_subscription_to_garage();

-- 6) RLS sur garage_subscriptions
-- Les owners voient leur propre subscription
CREATE POLICY "Owners can view their garage subscription"
  ON public.garage_subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.garage_owners
      WHERE garage_owners.garage_id = garage_subscriptions.garage_id
        AND garage_owners.user_id = auth.uid()
    )
  );

-- Admins voient tout
CREATE POLICY "Admins can view all subscriptions"
  ON public.garage_subscriptions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- INSERT/UPDATE/DELETE : seulement via service_role (bypass RLS dans les Edge Functions)

-- 7) Permettre aux owners de modifier leur garage (pour logo, cover, etc.)
CREATE POLICY "Owners can update their garage"
  ON public.garages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.garage_owners
      WHERE garage_owners.garage_id = garages.id
        AND garage_owners.user_id = auth.uid()
    )
  );

-- 8) Empêcher les owners de modifier directement le tier (seul le webhook peut)
CREATE OR REPLACE FUNCTION public.protect_garage_tier_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Service role (webhook) bypass — auth.uid() est NULL
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;
  -- Admins peuvent forcer un tier
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  -- Sinon : tier ne doit pas changer
  IF NEW.tier IS DISTINCT FROM OLD.tier THEN
    RAISE EXCEPTION 'Le tier d''un garage ne peut être modifié qu''en souscrivant un abonnement.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_garage_tier_trigger
  BEFORE UPDATE OF tier ON public.garages
  FOR EACH ROW EXECUTE FUNCTION public.protect_garage_tier_column();
