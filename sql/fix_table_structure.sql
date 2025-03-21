-- Script para adaptar a la estructura real de la tabla members

-- Verificar todas las columnas necesarias
DO $$
BEGIN
    -- Verificar columna role_id
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'role_id'
    ) THEN
        ALTER TABLE public.members ADD COLUMN role_id UUID;
        RAISE NOTICE 'Columna role_id agregada a la tabla members';
    END IF;
    
    -- Verificar columna role_name
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'role_name'
    ) THEN
        ALTER TABLE public.members ADD COLUMN role_name TEXT DEFAULT 'client';
        RAISE NOTICE 'Columna role_name agregada a la tabla members';
    END IF;
    
    -- Verificar columna status
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.members ADD COLUMN status TEXT DEFAULT 'active';
        RAISE NOTICE 'Columna status agregada a la tabla members';
    END IF;
    
    -- Verificar columna avatar_url
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE public.members ADD COLUMN avatar_url TEXT NULL;
        RAISE NOTICE 'Columna avatar_url agregada a la tabla members';
    END IF;
    
    -- Verificar columna marketing_consent
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'marketing_consent'
    ) THEN
        ALTER TABLE public.members ADD COLUMN marketing_consent BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Columna marketing_consent agregada a la tabla members';
    END IF;
    
    -- Verificar columna club_member
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'club_member'
    ) THEN
        ALTER TABLE public.members ADD COLUMN club_member BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Columna club_member agregada a la tabla members';
    END IF;
    
    -- Verificar columna email (opcional)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE public.members ADD COLUMN email TEXT NULL;
        RAISE NOTICE 'Columna email agregada a la tabla members';
    END IF;
END
$$;

-- Crear la función para validar teléfono (11 dígitos)
CREATE OR REPLACE FUNCTION public.is_valid_phone(phone_number text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validar que el número de teléfono tenga exactamente 11 dígitos y comience con cero
  RETURN phone_number ~ '^0\d{10}$';
END;
$$;

-- Crear la función para crear una sesión
CREATE OR REPLACE FUNCTION public.create_session_for_phone(
  p_phone text,
  p_identity_number text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_token text;
  v_refresh_token text;
  v_expires_at timestamp with time zone;
BEGIN
  -- Validar el teléfono
  IF NOT (p_phone ~ '^0\d{10}$') THEN
    RAISE EXCEPTION 'El número de teléfono debe tener 11 dígitos y comenzar con cero (0)';
  END IF;
  
  -- Validar el número de identidad
  IF NOT (p_identity_number ~ '^\d{7,8}$') THEN
    RAISE EXCEPTION 'El número de identidad debe tener entre 7 y 8 dígitos';
  END IF;
  
  -- Obtener el ID del usuario
  SELECT id INTO v_user_id FROM members 
  WHERE phone = p_phone AND identity_number = p_identity_number;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró un usuario con ese teléfono y cédula';
  END IF;
  
  -- Generar tokens
  v_token := gen_random_uuid()::text;
  v_refresh_token := gen_random_uuid()::text;
  v_expires_at := now() + interval '1 day';
  
  RETURN json_build_object(
    'user_id', v_user_id,
    'token', v_token,
    'refresh_token', v_refresh_token,
    'expires_at', v_expires_at
  );
END;
$$;

-- Crear índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_members_phone ON public.members(phone);
CREATE INDEX IF NOT EXISTS idx_members_identity_number ON public.members(identity_number);

-- Conceder permisos
GRANT EXECUTE ON FUNCTION public.is_valid_phone TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_valid_phone TO anon;
GRANT EXECUTE ON FUNCTION public.create_session_for_phone TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_session_for_phone TO anon;

-- Mensaje de confirmación
SELECT 'Estructura de tabla y funciones actualizadas correctamente' as mensaje; 