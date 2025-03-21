-- Función para crear un usuario con teléfono y cédula
CREATE OR REPLACE FUNCTION create_user_with_phone(
  p_phone TEXT,
  p_identity_number TEXT,
  p_name TEXT,
  p_last_name TEXT,
  p_email TEXT DEFAULT NULL,
  p_role TEXT DEFAULT 'client',
  p_marketing_consent BOOLEAN DEFAULT false,
  p_club_member BOOLEAN DEFAULT false,
  p_birth_date DATE DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_role_id UUID;
BEGIN
  -- Generar un UUID único para el usuario
  v_user_id := gen_random_uuid();
  
  -- Buscar el ID del rol
  SELECT id INTO v_role_id FROM public.roles WHERE name = p_role;
  
  -- Para mantener compatibilidad con Supabase Auth, generamos un email falso único si no se proporciona
  DECLARE
    v_email TEXT;
  BEGIN
    IF p_email IS NULL OR p_email = '' THEN
      v_email := p_phone || '@noemail.local';
    ELSE
      v_email := p_email;
    END IF;
    
    -- Insertar directamente en la tabla auth.users
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      (SELECT id FROM auth.instances LIMIT 1),
      v_email,
      crypt(p_identity_number, gen_salt('bf')),
      now(),
      jsonb_build_object('provider', 'phone', 'providers', ARRAY['phone']),
      jsonb_build_object(
        'phone', p_phone,
        'identityNumber', p_identity_number,
        'name', p_name,
        'lastName', p_last_name,
        'role', p_role
      ),
      now(),
      now()
    );
  END;
  
  -- Insertar en la tabla members
  INSERT INTO public.members (
    id, 
    role_id,
    role_name,
    identity_type,
    identity_number,
    name,
    last_name,
    phone,
    email,
    status,
    marketing_consent,
    club_member,
    birth_date,
    created_at
  ) VALUES (
    v_user_id,
    v_role_id,
    p_role,
    'V', -- Por defecto
    p_identity_number,
    p_name,
    p_last_name,
    p_phone,
    NULL, -- No guardamos email, sino null
    'active',
    p_marketing_consent,
    p_club_member,
    p_birth_date,
    now()
  );
  
  -- Opcionalmente, si es entrenador, crear registro en trainer_details
  IF p_role = 'trainer' THEN
    INSERT INTO public.trainer_details (id) VALUES (v_user_id);
  END IF;
  
  RETURN jsonb_build_object(
    'id', v_user_id,
    'phone', p_phone,
    'role', p_role
  );
END;
$$;

-- Función para crear una sesión para un usuario (login alternativo)
CREATE OR REPLACE FUNCTION create_session_for_phone(
  p_phone TEXT,
  p_identity_number TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_token TEXT;
  v_refresh_token TEXT;
  v_expires_at TIMESTAMP;
BEGIN
  -- Buscar el usuario en la tabla members
  SELECT id INTO v_user_id 
  FROM public.members 
  WHERE phone = p_phone 
  AND identity_number = p_identity_number;
  
  -- Si no se encuentra el usuario
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;
  
  -- Configurar tiempo de expiración
  v_expires_at := (now() + interval '1 hour');
  
  -- Generar token de sesión usando la función propia de Supabase
  INSERT INTO auth.sessions (
    id,
    user_id,
    created_at,
    updated_at,
    factor_id,
    aal,
    not_after
  )
  VALUES (
    gen_random_uuid(),
    v_user_id,
    now(),
    now(),
    NULL,
    'aal1',
    v_expires_at
  )
  RETURNING auth.sessions.id::text INTO v_token;
  
  -- Generar refresh token
  v_refresh_token := encode(gen_random_bytes(32), 'hex');
  
  INSERT INTO auth.refresh_tokens (
    instance_id,
    id,
    token,
    user_id,
    revoked,
    created_at,
    updated_at,
    parent,
    session_id
  )
  VALUES (
    (SELECT id FROM auth.instances LIMIT 1),
    gen_random_uuid(),
    v_refresh_token,
    v_user_id,
    false,
    now(),
    now(),
    NULL,
    v_token::uuid
  );
  
  -- Crear token JWT - Usa la clave secreta de Supabase
  -- Esta función fallará si no se puede acceder a la clave secreta
  -- Alternativa: Usar una función personalizada de firma
  RETURN jsonb_build_object(
    'token', sign(
      jsonb_build_object(
        'sub', v_user_id::text,
        'exp', extract(epoch from v_expires_at)::integer,
        'iat', extract(epoch from now())::integer,
        'aal', 'aal1',
        'session_id', v_token
      ),
      (SELECT secret FROM pgsodium.key_secrets WHERE id = 1)
    ),
    'refresh_token', v_refresh_token,
    'user_id', v_user_id
  );
END;
$$; 