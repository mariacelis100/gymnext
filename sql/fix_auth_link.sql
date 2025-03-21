-- Script para corregir el sistema de autenticación y registro
-- Esto modifica el enfoque para cumplir con la restricción de clave foránea members_id_fkey

-- Parte 1: Modificar la función de creación de sesión para asegurar que el usuario existe en auth.users
-- -----------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.create_user_with_phone(text, text, text, text, text, date, boolean, boolean);

CREATE OR REPLACE FUNCTION public.create_user_with_phone(
  p_phone TEXT,
  p_identity_number TEXT,
  p_identity_type TEXT,
  p_name TEXT,
  p_last_name TEXT,
  p_birth_date DATE,
  p_marketing_consent BOOLEAN DEFAULT FALSE,
  p_club_member BOOLEAN DEFAULT FALSE
) RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_token TEXT;
  v_refresh_token TEXT;
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
    v_user_id,
    p_phone,
    p_identity_number,
    p_identity_type,
    p_name,
    p_last_name,
    p_birth_date,
    'client',
    'active',
    p_marketing_consent,
    p_club_member
  );
  
  -- 3. Generamos un token JWT para la sesión
  SELECT auth.sign(
    row_to_json(r), 
    (SELECT current_setting('app.jwt_secret', true))
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
  
  -- 4. Devolvemos el token y el refresh token
  RETURN jsonb_build_object(
    'token', v_token,
    'refresh_token', v_refresh_token,
    'user_id', v_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Establecer permisos para la función
GRANT EXECUTE ON FUNCTION public.create_user_with_phone(text, text, text, text, text, date, boolean, boolean) TO anon, authenticated;

-- Parte 2: Modificar la función para iniciar sesión con teléfono y cédula
-- -----------------------------------------------------------------
DROP FUNCTION IF EXISTS public.create_session_for_phone(text, text);

CREATE OR REPLACE FUNCTION public.create_session_for_phone(
  p_phone TEXT,
  p_identity_number TEXT
) RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_token TEXT;
  v_refresh_token TEXT;
BEGIN
  -- Buscar el usuario por teléfono y cédula en members
  SELECT id INTO v_user_id
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
  
  -- Generar token para la sesión
  SELECT auth.sign(
    row_to_json(r), 
    (SELECT current_setting('app.jwt_secret', true))
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
  
  -- Devolver el token y el refresh token
  RETURN jsonb_build_object(
    'token', v_token,
    'refresh_token', v_refresh_token,
    'user_id', v_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Establecer permisos para la función
GRANT EXECUTE ON FUNCTION public.create_session_for_phone(text, text) TO anon, authenticated; 