-- Función para generar un UUID (usado en el cliente si no tiene acceso a crypto)
CREATE OR REPLACE FUNCTION public.gen_random_uuid()
RETURNS uuid
LANGUAGE sql
AS $$
  SELECT gen_random_uuid();
$$;

-- Conceder permisos a roles de aplicación
GRANT EXECUTE ON FUNCTION public.gen_random_uuid TO authenticated;
GRANT EXECUTE ON FUNCTION public.gen_random_uuid TO anon; 