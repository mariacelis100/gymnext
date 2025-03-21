-- Script para corregir el problema con auth.sign
-- Cambia el enfoque para usar el cliente de Supabase para manejo de tokens

-- 1. Modificar la función create_user_with_phone para evitar generar tokens
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
  
  -- 3. Devolvemos sólo el ID del usuario
  -- El token se generará desde el cliente
  RETURN jsonb_build_object(
    'user_id', v_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Establecer permisos para la función
GRANT EXECUTE ON FUNCTION public.create_user_with_phone(text, text, text, text, text, date, boolean, boolean) TO anon, authenticated;

-- 2. Modificar la función create_session_for_phone para evitar generar tokens
DROP FUNCTION IF EXISTS public.create_session_for_phone(text, text);

CREATE OR REPLACE FUNCTION public.create_session_for_phone(
  p_phone TEXT,
  p_identity_number TEXT
) RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
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
  
  -- Devolver solo el ID del usuario
  -- El token se generará desde el cliente
  RETURN jsonb_build_object(
    'user_id', v_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Establecer permisos para la función
GRANT EXECUTE ON FUNCTION public.create_session_for_phone(text, text) TO anon, authenticated; 