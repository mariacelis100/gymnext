-- Script para corregir el problema de "Email signups are disabled"
-- Este script implementa una solución completa para autenticación por teléfono sin email

-- Crear o reemplazar la función para registrar usuarios solo con teléfono y cédula
DROP FUNCTION IF EXISTS public.create_user_with_phone(text, text, text, text, text, text, boolean, boolean);

CREATE OR REPLACE FUNCTION public.create_user_with_phone(
  p_phone TEXT,
  p_identity_number TEXT,
  p_identity_type TEXT,
  p_name TEXT,
  p_last_name TEXT,
  p_birth_date TEXT,
  p_marketing_consent BOOLEAN DEFAULT FALSE,
  p_club_member BOOLEAN DEFAULT FALSE
) RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_session_token TEXT;
BEGIN
  -- Validar formato del teléfono
  IF NOT p_phone ~ '^0[24][0-9]{2}-[0-9]{7}$' THEN
    RAISE EXCEPTION 'Formato de teléfono inválido. Debe ser 04XX-XXXXXXX o 02XX-XXXXXXX';
  END IF;
  
  -- Validar formato de la cédula
  IF NOT p_identity_number ~ '^[0-9]{7,8}$' THEN
    RAISE EXCEPTION 'Formato de cédula inválido. Debe tener 7 u 8 dígitos';
  END IF;
  
  -- Verificar si ya existe un usuario con ese teléfono o cédula
  IF EXISTS (
    SELECT 1 FROM public.members 
    WHERE phone = p_phone OR identity_number = p_identity_number
  ) THEN
    IF EXISTS (SELECT 1 FROM public.members WHERE phone = p_phone) THEN
      RAISE EXCEPTION 'Ya existe un usuario con este número de teléfono.';
    ELSE
      RAISE EXCEPTION 'Ya existe un usuario con este número de cédula.';
    END IF;
  END IF;
  
  -- Generar un UUID para el nuevo usuario
  SELECT gen_random_uuid() INTO v_user_id;
  
  -- Insertar directamente en auth.users con un ID generado
  -- pero SIN usar email para autenticación
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,           -- Campo requerido por Supabase pero no lo usaremos para autenticación
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    p_phone || '_' || p_identity_number || '@noemail.com', -- Email ficticio que nunca se usará
    '',             -- Sin contraseña
    now(),          -- Email confirmado automáticamente
    NULL,
    now(),
    jsonb_build_object(
      'provider', 'phone',
      'providers', ARRAY['phone']
    ),
    jsonb_build_object(
      'phone', p_phone,
      'identityNumber', p_identity_number,
      'identityType', p_identity_type,
      'name', p_name,
      'lastName', p_last_name,
      'role', 'client'
    ),
    now(),
    now(),
    p_phone,
    now(),         -- Teléfono confirmado automáticamente
    '',
    '',
    '',
    ''
  );
  
  -- Insertar en la tabla members
  INSERT INTO public.members (
    id,
    phone,
    identity_number,
    identity_type,
    name,
    last_name,
    birth_date,
    role_name,
    status,
    marketing_consent,
    club_member
  ) VALUES (
    v_user_id::text,
    p_phone,
    p_identity_number,
    p_identity_type,
    p_name,
    p_last_name,
    p_birth_date::date,
    'client',
    'active',
    p_marketing_consent,
    p_club_member
  );
  
  -- Generar un token de sesión simplificado
  v_session_token := encode(digest(v_user_id::text || now()::text, 'sha256'), 'hex');
  
  -- Insertar una sesión en auth.sessions
  INSERT INTO auth.sessions (
    id,
    user_id,
    created_at,
    updated_at,
    factor_id,
    aal,
    not_after
  ) VALUES (
    gen_random_uuid(),
    v_user_id,
    now(),
    now(),
    NULL,
    'aal1',
    now() + interval '7 days'
  );
  
  -- Devolver la información del usuario creado
  RETURN jsonb_build_object(
    'user_id', v_user_id,
    'phone', p_phone,
    'identity_number', p_identity_number,
    'session_token', v_session_token,
    'role', 'client',
    'status', 'success'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Asignar permisos a la función
GRANT EXECUTE ON FUNCTION public.create_user_with_phone TO anon, authenticated, service_role;

-- Función para iniciar sesión sin email
DROP FUNCTION IF EXISTS public.login_with_phone(text, text);

CREATE OR REPLACE FUNCTION public.login_with_phone(
  p_phone TEXT,
  p_identity_number TEXT
) RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
  v_session_token TEXT;
  v_member RECORD;
BEGIN
  -- Buscar el usuario en la tabla members
  SELECT * INTO v_member
  FROM public.members
  WHERE phone = p_phone AND identity_number = p_identity_number;
  
  IF v_member IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado. Verifica el número de teléfono y la cédula.';
  END IF;
  
  -- Convertir el ID a UUID
  v_user_id := v_member.id::uuid;
  v_role := v_member.role_name;
  
  -- Verificar que el usuario exista en auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_id) THEN
    RAISE EXCEPTION 'Error de integridad en la base de datos. Contacte al administrador.';
  END IF;
  
  -- Generar un token de sesión simplificado
  v_session_token := encode(digest(v_user_id::text || now()::text, 'sha256'), 'hex');
  
  -- Actualizar el último inicio de sesión
  UPDATE auth.users SET last_sign_in_at = now() WHERE id = v_user_id;
  
  -- Insertar una sesión en auth.sessions
  INSERT INTO auth.sessions (
    id,
    user_id,
    created_at,
    updated_at,
    factor_id,
    aal,
    not_after
  ) VALUES (
    gen_random_uuid(),
    v_user_id,
    now(),
    now(),
    NULL,
    'aal1',
    now() + interval '7 days'
  );
  
  -- Devolver la información del usuario y sesión
  RETURN jsonb_build_object(
    'user_id', v_user_id,
    'phone', p_phone,
    'identity_number', p_identity_number,
    'name', v_member.name,
    'last_name', v_member.last_name,
    'role', v_role,
    'status', v_member.status,
    'session_token', v_session_token
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Asignar permisos a la función
GRANT EXECUTE ON FUNCTION public.login_with_phone TO anon, authenticated, service_role; 