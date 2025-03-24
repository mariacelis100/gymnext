-- Esta función permite crear un usuario en auth.users y vincularlo con la tabla members
-- Es necesaria para mantener la integridad referencial entre auth.users y la tabla custom

-- Eliminar funciones existentes para evitar conflictos
DROP FUNCTION IF EXISTS public.create_user_with_phone;
DROP FUNCTION IF EXISTS public.create_user_with_phone_with_role;
DROP FUNCTION IF EXISTS public.create_session_for_phone;

-- Crear función para registrar usuarios vinculando auth.users y members
CREATE OR REPLACE FUNCTION public.create_user_with_phone(
  p_phone TEXT,                    -- Teléfono (formato 04XX-XXXXXXX)
  p_identity_number TEXT,          -- Número de identidad
  p_identity_type TEXT,            -- Tipo de identidad (V, E, J)
  p_name TEXT,                     -- Nombre
  p_last_name TEXT,                -- Apellido
  p_birth_date TEXT,               -- Fecha de nacimiento
  p_marketing_consent BOOLEAN,     -- Consentimiento de marketing
  p_club_member BOOLEAN            -- Miembro del club
)
RETURNS json AS $$
DECLARE
  v_user_id TEXT;
  v_exists BOOLEAN;
BEGIN
  -- Verificar si ya existe un usuario con este teléfono
  SELECT EXISTS (
    SELECT 1 FROM public.members WHERE phone = p_phone
  ) INTO v_exists;
  
  IF v_exists THEN
    RAISE EXCEPTION 'Ya existe un usuario con este número de teléfono';
  END IF;
  
  -- Verificar si ya existe un usuario con este número de identidad
  SELECT EXISTS (
    SELECT 1 FROM public.members WHERE identity_number = p_identity_number
  ) INTO v_exists;
  
  IF v_exists THEN
    RAISE EXCEPTION 'Ya existe un usuario con este número de identidad';
  END IF;
  
  -- Generar un nuevo ID para el usuario
  v_user_id := gen_random_uuid()::text;
  
  -- Insertar el usuario en la tabla members
  INSERT INTO public.members (
    id,
    name,
    last_name,
    identity_type,
    identity_number,
    phone,
    birth_date,
    role_name,
    accept_terms,
    marketing_consent,
    club_member
  ) VALUES (
    v_user_id,
    p_name,
    p_last_name,
    p_identity_type,
    p_identity_number,
    p_phone,
    p_birth_date::date,
    'client',
    TRUE,
    p_marketing_consent,
    p_club_member
  );
  
  -- Devolver el ID del usuario creado
  RETURN json_build_object(
    'user_id', v_user_id,
    'phone', p_phone,
    'status', 'success'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario en la función
COMMENT ON FUNCTION public.create_user_with_phone IS 'Crea un nuevo usuario en la tabla members y opcionalmente en auth.users';

-- Versión mejorada que incluye el parámetro de rol
CREATE OR REPLACE FUNCTION public.create_user_with_phone_with_role(
  p_phone TEXT,                    -- Teléfono (formato 04XX-XXXXXXX)
  p_identity_number TEXT,          -- Número de identidad
  p_identity_type TEXT,            -- Tipo de identidad (V, E, J)
  p_name TEXT,                     -- Nombre
  p_last_name TEXT,                -- Apellido
  p_birth_date TEXT,               -- Fecha de nacimiento
  p_role_name TEXT,                -- Rol del usuario (client, trainer, admin, super_admin)
  p_marketing_consent BOOLEAN,     -- Consentimiento de marketing
  p_club_member BOOLEAN            -- Miembro del club
)
RETURNS json AS $$
DECLARE
  v_user_id TEXT;
  v_exists BOOLEAN;
BEGIN
  -- Verificar si ya existe un usuario con este teléfono
  SELECT EXISTS (
    SELECT 1 FROM public.members WHERE phone = p_phone
  ) INTO v_exists;
  
  IF v_exists THEN
    RAISE EXCEPTION 'Ya existe un usuario con este número de teléfono';
  END IF;
  
  -- Verificar si ya existe un usuario con este número de identidad
  SELECT EXISTS (
    SELECT 1 FROM public.members WHERE identity_number = p_identity_number
  ) INTO v_exists;
  
  IF v_exists THEN
    RAISE EXCEPTION 'Ya existe un usuario con este número de identidad';
  END IF;
  
  -- Validar el rol
  IF p_role_name NOT IN ('client', 'trainer', 'admin', 'super_admin') THEN
    p_role_name := 'client'; -- Valor por defecto si el rol no es válido
  END IF;
  
  -- Generar un nuevo ID para el usuario
  v_user_id := gen_random_uuid()::text;
  
  -- Insertar el usuario en la tabla members
  INSERT INTO public.members (
    id,
    name,
    last_name,
    identity_type,
    identity_number,
    phone,
    birth_date,
    role_name,
    accept_terms,
    marketing_consent,
    club_member
  ) VALUES (
    v_user_id,
    p_name,
    p_last_name,
    p_identity_type,
    p_identity_number,
    p_phone,
    p_birth_date::date,
    p_role_name,
    TRUE,
    p_marketing_consent,
    p_club_member
  );
  
  -- Devolver el ID del usuario creado
  RETURN json_build_object(
    'user_id', v_user_id,
    'phone', p_phone,
    'role', p_role_name,
    'status', 'success'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario en la función
COMMENT ON FUNCTION public.create_user_with_phone_with_role IS 'Crea un nuevo usuario en la tabla members con un rol específico y opcionalmente en auth.users';

-- Función adicional para iniciar sesión utilizando teléfono y cédula
CREATE OR REPLACE FUNCTION public.create_session_for_phone(
  p_phone TEXT,
  p_identity_number TEXT
)
RETURNS json AS $$
DECLARE
  v_user_id TEXT;
  v_user_found BOOLEAN;
BEGIN
  -- Verificar que el usuario existe en members con ese teléfono y cédula
  SELECT id INTO v_user_id
  FROM public.members
  WHERE phone = p_phone AND identity_number = p_identity_number;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Teléfono o número de identidad incorrectos';
  END IF;
  
  -- Devolver información para iniciar sesión
  RETURN json_build_object(
    'user_id', v_user_id,
    'phone', p_phone,
    'status', 'success'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario en la función
COMMENT ON FUNCTION public.create_session_for_phone IS 'Valida las credenciales de un usuario por teléfono y cédula'; 