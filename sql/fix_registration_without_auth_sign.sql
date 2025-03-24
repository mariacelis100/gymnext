-- Script para modificar las funciones de registro para eliminar la dependencia de auth.sign
-- Esto es una solución alternativa si no es posible implementar auth.sign

-- Modificar la función create_user_with_phone para que no use auth.sign
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
BEGIN
  -- 1. Primero creamos el usuario en auth.users
  -- Insertamos un nuevo usuario en auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
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
    gen_random_uuid(), -- Genera un UUID para el id
    'authenticated',
    'authenticated',
    p_phone || '@example.com', -- Email basado en teléfono (no se usará)
    '', -- No password
    now(), -- Email confirmado
    NULL,
    now(),
    '{"provider": "phone", "providers": ["phone"]}',
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
    now(), -- Teléfono confirmado
    NULL,
    NULL,
    NULL,
    NULL
  ) RETURNING id INTO v_user_id;
  
  -- 2. Luego insertamos el registro correspondiente en members con el mismo ID
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
  
  -- 3. Devolvemos el ID del usuario y otros datos útiles sin generar token JWT
  RETURN jsonb_build_object(
    'user_id', v_user_id,
    'phone', p_phone,
    'status', 'success',
    'message', 'El usuario ha sido creado exitosamente. Utilice el cliente JS de Supabase para generar el token.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Versión con rol específico
DROP FUNCTION IF EXISTS public.create_user_with_phone_with_role(text, text, text, text, text, text, text, boolean, boolean);

CREATE OR REPLACE FUNCTION public.create_user_with_phone_with_role(
  p_phone TEXT,
  p_identity_number TEXT,
  p_identity_type TEXT,
  p_name TEXT,
  p_last_name TEXT,
  p_birth_date TEXT,
  p_role_name TEXT,
  p_marketing_consent BOOLEAN DEFAULT FALSE,
  p_club_member BOOLEAN DEFAULT FALSE
) RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Validar el rol
  IF p_role_name NOT IN ('client', 'trainer', 'admin', 'super_admin') THEN
    p_role_name := 'client'; -- Valor por defecto si el rol no es válido
  END IF;

  -- 1. Primero creamos el usuario en auth.users
  -- Insertamos un nuevo usuario en auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
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
    gen_random_uuid(), -- Genera un UUID para el id
    'authenticated',
    'authenticated',
    p_phone || '@example.com', -- Email basado en teléfono (no se usará)
    '', -- No password
    now(), -- Email confirmado
    NULL,
    now(),
    '{"provider": "phone", "providers": ["phone"]}',
    jsonb_build_object(
      'phone', p_phone,
      'identityNumber', p_identity_number,
      'identityType', p_identity_type,
      'name', p_name,
      'lastName', p_last_name,
      'role', p_role_name
    ),
    now(),
    now(),
    p_phone,
    now(), -- Teléfono confirmado
    NULL,
    NULL,
    NULL,
    NULL
  ) RETURNING id INTO v_user_id;
  
  -- 2. Luego insertamos el registro correspondiente en members con el mismo ID
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
    p_role_name,
    'active',
    p_marketing_consent,
    p_club_member
  );
  
  -- 3. Devolvemos el ID del usuario y otros datos útiles sin generar token JWT
  RETURN jsonb_build_object(
    'user_id', v_user_id,
    'phone', p_phone,
    'role', p_role_name,
    'status', 'success',
    'message', 'El usuario ha sido creado exitosamente. Utilice el cliente JS de Supabase para generar el token.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Establecer permisos para las funciones
GRANT EXECUTE ON FUNCTION public.create_user_with_phone(text, text, text, text, text, text, boolean, boolean) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_with_phone_with_role(text, text, text, text, text, text, text, boolean, boolean) TO anon, authenticated;

-- Modificar la función create_session_for_phone para que no dependa de auth.sign
DROP FUNCTION IF EXISTS public.create_session_for_phone(text, text);

CREATE OR REPLACE FUNCTION public.create_session_for_phone(
  p_phone TEXT,
  p_identity_number TEXT
) RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
  v_status TEXT;
BEGIN
  -- Buscar el usuario por teléfono y cédula en members
  SELECT id::uuid, role_name, status INTO v_user_id, v_role, v_status
  FROM public.members
  WHERE phone = p_phone
  AND identity_number = p_identity_number;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado con teléfono: % y cédula: %', p_phone, p_identity_number;
  END IF;
  
  -- Verificar que el usuario exista en auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_id) THEN
    RAISE EXCEPTION 'El usuario existe en members pero no en auth.users. ID: %', v_user_id;
  END IF;
  
  -- Retornar datos sin generar token JWT
  RETURN jsonb_build_object(
    'user_id', v_user_id,
    'phone', p_phone,
    'role', v_role,
    'status', v_status,
    'message', 'Autenticación exitosa. Utilice el cliente JS de Supabase para generar el token.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Establecer permisos para la función
GRANT EXECUTE ON FUNCTION public.create_session_for_phone(text, text) TO anon, authenticated; 