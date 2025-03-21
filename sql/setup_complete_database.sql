-- Script completo para configurar la base de datos de GymNext
-- Incluye todos los campos necesarios para las interfaces de la aplicación

-- 1. Verificar y crear la tabla de miembros si no existe
CREATE TABLE IF NOT EXISTS public.members (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Campos de autenticación (principales)
  phone TEXT NOT NULL,
  identity_number TEXT NOT NULL,
  identity_type TEXT NOT NULL DEFAULT 'V',
  
  -- Datos personales
  name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  
  -- Datos de membresía y estado
  role_id INTEGER NULL,
  role_name TEXT NOT NULL DEFAULT 'client',
  status TEXT NOT NULL DEFAULT 'active',
  
  -- Preferencias y consentimientos
  marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
  club_member BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Información complementaria
  avatar_url TEXT NULL,
  
  -- Campo opcional no usado para autenticación
  email TEXT NULL
);

-- 2. Añadir comentarios descriptivos a la tabla y columnas
COMMENT ON TABLE public.members IS 'Tabla de miembros con autenticación por teléfono y cédula, sin usar email';
COMMENT ON COLUMN public.members.id IS 'Identificador único UUID para cada miembro';
COMMENT ON COLUMN public.members.phone IS 'Número de teléfono en formato 04XX-XXXXXXX';
COMMENT ON COLUMN public.members.identity_number IS 'Número de cédula/documento de identidad (7-8 dígitos)';
COMMENT ON COLUMN public.members.identity_type IS 'Tipo de documento: V (venezolano), E (extranjero), J (jurídico)';
COMMENT ON COLUMN public.members.name IS 'Nombre del miembro';
COMMENT ON COLUMN public.members.last_name IS 'Apellidos del miembro';
COMMENT ON COLUMN public.members.birth_date IS 'Fecha de nacimiento (debe ser mayor de 18 años)';
COMMENT ON COLUMN public.members.role_id IS 'ID numérico del rol (opcional)';
COMMENT ON COLUMN public.members.role_name IS 'Nombre del rol: client, trainer, admin, super_admin';
COMMENT ON COLUMN public.members.status IS 'Estado del miembro: active, suspended, overdue, banned, inactive, trial, cancelled';
COMMENT ON COLUMN public.members.marketing_consent IS 'Consentimiento para recibir comunicaciones de marketing';
COMMENT ON COLUMN public.members.club_member IS 'Indica si el usuario es miembro del club de beneficios';
COMMENT ON COLUMN public.members.avatar_url IS 'URL a la imagen de perfil del usuario';
COMMENT ON COLUMN public.members.email IS 'Campo opcional, no usado para autenticación';

-- 3. Crear índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS members_phone_idx ON public.members (phone);
CREATE INDEX IF NOT EXISTS members_identity_number_idx ON public.members (identity_number);
CREATE INDEX IF NOT EXISTS members_status_idx ON public.members (status);
CREATE INDEX IF NOT EXISTS members_role_name_idx ON public.members (role_name);

-- 4. Crear restricciones de unicidad
-- Borramos primero para evitar errores si ya existen
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_phone_key;
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_identity_number_key;

-- Creamos las restricciones de unicidad
ALTER TABLE public.members ADD CONSTRAINT members_phone_key UNIQUE (phone);
ALTER TABLE public.members ADD CONSTRAINT members_identity_number_key UNIQUE (identity_number);

-- 5. Agregar restricciones de validación para los datos
-- Eliminar restricciones existentes para evitar conflictos
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS check_phone;
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS check_identity_number;
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS check_min_age;

-- Crear las restricciones de validación
-- Para teléfono (aceptando formato con y sin guión)
ALTER TABLE public.members ADD CONSTRAINT check_phone 
  CHECK (phone ~ '^04\d{2}-\d{7}$' OR phone ~ '^04\d{2}\d{7}$');

-- Para número de cédula (7-8 dígitos)
ALTER TABLE public.members ADD CONSTRAINT check_identity_number 
  CHECK (identity_number ~ '^\d{7,8}$');

-- Para tipo de cédula (V, E, J)
ALTER TABLE public.members ADD CONSTRAINT check_identity_type
  CHECK (identity_type IN ('V', 'E', 'J'));

-- Para edad mínima (18 años)
ALTER TABLE public.members ADD CONSTRAINT check_min_age
  CHECK (birth_date <= (CURRENT_DATE - INTERVAL '18 years'));

-- Para valores válidos de estado
ALTER TABLE public.members ADD CONSTRAINT check_status
  CHECK (status IN ('active', 'suspended', 'overdue', 'banned', 'inactive', 'trial', 'cancelled'));

-- Para valores válidos de rol
ALTER TABLE public.members ADD CONSTRAINT check_role_name
  CHECK (role_name IN ('client', 'trainer', 'admin', 'super_admin'));

-- 6. Función para validar teléfono venezolano
-- Primero eliminar la función si ya existe para evitar errores de nombre de parámetro
DROP FUNCTION IF EXISTS public.is_valid_phone(text);

CREATE OR REPLACE FUNCTION public.is_valid_phone(p_phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN p_phone ~ '^04\d{2}-\d{7}$' OR p_phone ~ '^04\d{2}\d{7}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 7. Función para validar número de cédula
-- Primero eliminar la función si ya existe para evitar errores de nombre de parámetro
DROP FUNCTION IF EXISTS public.is_valid_identity_number(text);

CREATE OR REPLACE FUNCTION public.is_valid_identity_number(p_identity_number TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN p_identity_number ~ '^\d{7,8}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 8. Función para crear sesión con teléfono y cédula
-- Primero eliminar la función si ya existe para evitar errores
DROP FUNCTION IF EXISTS public.create_session_for_phone(text, text);

CREATE OR REPLACE FUNCTION public.create_session_for_phone(
  p_phone TEXT,
  p_identity_number TEXT
) RETURNS JSON AS $$
DECLARE
  v_user_id TEXT;
  v_token TEXT;
  v_refresh_token TEXT;
  v_result JSON;
BEGIN
  -- Buscar el usuario por teléfono y cédula
  SELECT id INTO v_user_id
  FROM public.members
  WHERE phone = p_phone
  AND identity_number = p_identity_number;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado con el teléfono y cédula proporcionados';
  END IF;
  
  -- Generar token para el usuario
  SELECT auth.sign(
    row_to_json(r), current_setting('app.jwt_secret')
  ) AS token,
  extract(epoch from now())::integer + 60*60*24*7 as refresh_token
  INTO v_token, v_refresh_token
  FROM (
    SELECT 
      v_user_id as sub,
      v_user_id as user_id,
      'authenticated' as role,
      extract(epoch from now())::integer as iat,
      extract(epoch from now())::integer + 60*60*24 as exp
  ) r;
  
  -- Construir el resultado JSON
  v_result := json_build_object(
    'token', v_token,
    'refresh_token', v_refresh_token
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Función para obtener miembro por teléfono
-- Primero eliminar la función si ya existe para evitar errores
DROP FUNCTION IF EXISTS public.get_member_by_phone(text);

CREATE OR REPLACE FUNCTION public.get_member_by_phone(
  p_phone TEXT
) RETURNS SETOF public.members AS $$
BEGIN
  RETURN QUERY 
  SELECT * FROM public.members
  WHERE phone = p_phone;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Configuración de seguridad Row Level Security (RLS)
-- Activar RLS para la tabla members
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS members_select_policy ON public.members;
DROP POLICY IF EXISTS members_update_policy ON public.members;
DROP POLICY IF EXISTS members_verify_policy ON public.members;
DROP POLICY IF EXISTS members_insert_policy ON public.members;
DROP POLICY IF EXISTS members_delete_policy ON public.members;
DROP POLICY IF EXISTS "Usuarios pueden leer sus propios datos" ON public.members;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios datos" ON public.members;
DROP POLICY IF EXISTS "Permitir registro inicial" ON public.members;
DROP POLICY IF EXISTS "Permitir verificación de duplicados" ON public.members;
DROP POLICY IF EXISTS "Permitir login por teléfono" ON public.members;
DROP POLICY IF EXISTS "Admins pueden ver todos los miembros" ON public.members;

-- Crear políticas de acceso
-- Política para permitir que usuarios anónimos verifiquen la existencia de teléfonos/cédulas
CREATE POLICY "Permitir verificación de duplicados"
ON public.members
FOR SELECT
TO anon
USING (true);

-- Política para permitir login
CREATE POLICY "Permitir login por teléfono"
ON public.members
FOR SELECT
TO anon
USING (true);

-- Política para permitir registro sin autenticación previa
CREATE POLICY "Permitir inserción anónima"
ON public.members
FOR INSERT
TO anon
WITH CHECK (true);

-- Política para que los usuarios vean sus propios datos
CREATE POLICY "Usuarios pueden leer sus propios datos"
ON public.members
FOR SELECT
TO authenticated
USING (
  (auth.uid()::text = id) OR
  (EXISTS (
    SELECT 1 FROM public.members m
    WHERE m.id = auth.uid()::text AND m.role_name IN ('admin', 'super_admin')
  ))
);

-- Política para que los usuarios actualicen sus datos
CREATE POLICY "Usuarios pueden actualizar sus propios datos"
ON public.members
FOR UPDATE
TO authenticated
USING (auth.uid()::text = id)
WITH CHECK (auth.uid()::text = id);

-- Política para permitir registro (inserción)
CREATE POLICY "Permitir registro inicial"
ON public.members
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = id);

-- Política para administradores
CREATE POLICY "Admins pueden ver todos los miembros"
ON public.members
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.members m
    WHERE m.id = auth.uid()::text AND m.role_name IN ('admin', 'super_admin')
  )
);

-- 11. Permisos de ejecución para funciones
GRANT EXECUTE ON FUNCTION public.create_session_for_phone(p_phone text, p_identity_number text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_member_by_phone(p_phone text) TO anon, authenticated;

-- 12. Permisos para la tabla
GRANT SELECT ON public.members TO anon, authenticated;
GRANT INSERT ON public.members TO anon, authenticated;
GRANT UPDATE ON public.members TO authenticated; 