-- Grant admin role to the site owner account
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'gurseveralperen@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Allow admins to delete any review (extends existing policies)
CREATE POLICY "Admins can delete any review"
  ON public.reviews FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to select all reviews (reviews are already publicly readable, this is a no-op safety net)
-- Reviews already have: CREATE POLICY "Reviews are publicly readable" ... USING (true)

-- Function to list all users for the admin panel
-- SECURITY DEFINER so it can read auth.users (not directly accessible to JS client)
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  RETURN QUERY
    SELECT
      u.id,
      u.email::TEXT,
      u.created_at,
      COALESCE(ur.role::TEXT, 'user')
    FROM auth.users u
    LEFT JOIN public.user_roles ur ON ur.user_id = u.id
    ORDER BY u.created_at DESC;
END;
$$;
