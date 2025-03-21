-- Función para crear una sesión para un usuario basado en teléfono y cédula
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
  v_clean_phone text;
BEGIN
  -- Limpiar y validar el teléfono
  -- Primero eliminamos cualquier espacio en blanco
  v_clean_phone := trim(p_phone);
  
  -- Validar el formato con guión (04XX-XXXXXXX)
  IF NOT (v_clean_phone ~ '^04\d{2}-\d{7}$') THEN
    -- Si no tiene el formato con guión, ver si tiene el formato sin guión
    IF v_clean_phone ~ '^04\d{2}\d{7}$' THEN
      -- Formatear el teléfono con guión
      v_clean_phone := substring(v_clean_phone, 1, 4) || '-' || substring(v_clean_phone, 5);
    ELSE
      RAISE EXCEPTION 'El número de teléfono debe tener el formato 04XX-XXXXXXX';
    END IF;
  END IF;
  
  -- Validar el número de identidad
  IF NOT (p_identity_number ~ '^\d{7,8}$') THEN
    RAISE EXCEPTION 'El número de identidad debe tener entre 7 y 8 dígitos';
  END IF;
  
  -- Buscar el usuario con el teléfono formateado
  SELECT id INTO v_user_id FROM members 
  WHERE phone = v_clean_phone AND identity_number = p_identity_number;
  
  -- Si no se encuentra, intentar buscar con diferentes formatos del teléfono
  IF v_user_id IS NULL THEN
    -- Probar sin guión
    SELECT id INTO v_user_id FROM members 
    WHERE phone = replace(v_clean_phone, '-', '') AND identity_number = p_identity_number;
    
    -- Si se encuentra sin guión, actualizar el registro con el formato correcto
    IF v_user_id IS NOT NULL THEN
      UPDATE members SET phone = v_clean_phone WHERE id = v_user_id;
    END IF;
  END IF;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró un usuario con ese teléfono y cédula';
  END IF;
  
  -- Generar tokens (utilizando UUIDs como ejemplo)
  v_token := gen_random_uuid()::text;
  v_refresh_token := gen_random_uuid()::text;
  v_expires_at := now() + interval '1 day';
  
  -- Insertar el token en la tabla auth.sessions
  -- Nota: Si no tienes acceso directo a la tabla auth.sessions, este paso se omite
  -- y deberás manejar la sesión en el front-end
  
  -- IMPORTANTE: Esta parte puede variar según tu versión de Supabase y permisos
  BEGIN
    -- Intentar insertar en auth.sessions
    -- Esto puede fallar si no tienes permisos, pero no afecta el funcionamiento básico
    INSERT INTO auth.sessions (
      id,
      user_id,
      created_at,
      updated_at,
      factor_id,
      not_after,
      refreshed_at,
      user_agent,
      ip
    ) VALUES (
      gen_random_uuid(),
      v_user_id,
      now(),
      now(),
      NULL,
      v_expires_at,
      now(),
      'Custom Session',
      '127.0.0.1'
    );
  EXCEPTION WHEN OTHERS THEN
    -- Ignorar errores, continuar con el flujo
    NULL;
  END;
  
  RETURN json_build_object(
    'user_id', v_user_id,
    'token', v_token,
    'refresh_token', v_refresh_token,
    'expires_at', v_expires_at
  );
END;
$$;

-- Función para validar el formato del teléfono
CREATE OR REPLACE FUNCTION public.is_valid_phone(phone_number text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_clean_phone text;
BEGIN
  -- Eliminar espacios en blanco
  v_clean_phone := trim(phone_number);
  
  -- Validar que el número tenga el formato 04XX-XXXXXXX
  IF v_clean_phone ~ '^04\d{2}-\d{7}$' THEN
    RETURN true;
  END IF;
  
  -- O que tenga el formato sin guión
  IF v_clean_phone ~ '^04\d{2}\d{7}$' THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Función para actualizar el formato de teléfono en registros existentes
CREATE OR REPLACE FUNCTION public.update_phone_format()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rec RECORD;
  v_formatted_phone text;
BEGIN
  -- Primero verificar si existe la restricción check_phone
  -- Si existe, eliminarla temporalmente para permitir las actualizaciones
  BEGIN
    -- Intentar quitar la restricción
    ALTER TABLE public.members DROP CONSTRAINT IF EXISTS check_phone;
  EXCEPTION WHEN OTHERS THEN
    -- Ignorar errores, continuar con el flujo
    RAISE NOTICE 'No se pudo eliminar la restricción check_phone o no existe: %', SQLERRM;
  END;
  
  -- Recorrer todos los registros que no tengan el formato correcto
  FOR rec IN
    SELECT id, phone FROM members
    WHERE phone !~ '^04\d{2}-\d{7}$' AND phone IS NOT NULL
  LOOP
    -- Si el teléfono tiene formato sin guión (11 dígitos)
    IF rec.phone ~ '^04\d{2}\d{7}$' THEN
      -- Crear el teléfono formateado
      v_formatted_phone := substring(rec.phone, 1, 4) || '-' || substring(rec.phone, 5);
      
      -- Actualizar con formato correcto
      BEGIN
        UPDATE members
        SET phone = v_formatted_phone
        WHERE id = rec.id;
        
        RAISE NOTICE 'Teléfono actualizado para ID %: % → %', rec.id, rec.phone, v_formatted_phone;
      EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error al actualizar teléfono para ID %: %', rec.id, SQLERRM;
      END;
    END IF;
  END LOOP;
  
  -- Reinstalar la restricción con condición que acepte ambos formatos
  BEGIN
    ALTER TABLE public.members ADD CONSTRAINT check_phone 
      CHECK (phone ~ '^04\d{2}-\d{7}$' OR phone ~ '^04\d{2}\d{7}$');
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'No se pudo reinstalar la restricción check_phone: %', SQLERRM;
  END;
END;
$$;

-- Ejecutar la actualización de formatos
SELECT public.update_phone_format();

-- Permisos para ejecutar estas funciones
GRANT EXECUTE ON FUNCTION public.create_session_for_phone TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_session_for_phone TO anon;
GRANT EXECUTE ON FUNCTION public.is_valid_phone TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_valid_phone TO anon;
GRANT EXECUTE ON FUNCTION public.update_phone_format TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_phone_format TO anon; 