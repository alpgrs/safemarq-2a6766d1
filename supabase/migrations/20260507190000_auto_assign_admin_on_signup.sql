-- Auto-assigne le rôle admin au compte propriétaire dès sa création
-- Idempotent : peut être ré-exécuté sans casser quoi que ce soit
-- Cible : gurseveralperen@gmail.com

-- 1) Backfill : si le compte existe déjà au moment où on applique cette migration,
--    on lui donne admin tout de suite (sans attendre un futur signup).
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'gurseveralperen@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 2) Fonction trigger : à chaque INSERT dans auth.users, si l'email correspond
--    au propriétaire du site, on insère le rôle admin.
CREATE OR REPLACE FUNCTION public.assign_owner_admin_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'gurseveralperen@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- 3) Trigger : drop puis recreate pour rester idempotent en cas de re-run
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_owner_admin_on_signup();
