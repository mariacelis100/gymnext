-- Script para configurar las variables de JWT necesarias para auth.sign
-- Este script configura la variable jwt_secret que necesita auth.sign

-- Configurar la variable de aplicación para el secreto JWT
-- Esto asume que ya existe un secreto en la configuración de Supabase
-- Si no existe, debería ser reemplazado con el secreto real de Supabase

-- Obtener el secreto JWT actual de la configuración (si existe)
DO $$
DECLARE
  v_jwt_secret text;
  v_random_secret text;
BEGIN
  -- Primero intentamos obtener el secreto actual
  BEGIN
    SELECT current_setting('app.jwt_secret') INTO v_jwt_secret;
    RAISE NOTICE 'JWT secret existente encontrado';
  EXCEPTION WHEN OTHERS THEN
    -- Si no existe, generamos uno aleatorio
    v_random_secret := encode(gen_random_bytes(32), 'hex');
    RAISE NOTICE 'Generando nuevo JWT secret';
    
    -- Establecer el secreto aleatorio
    EXECUTE format('ALTER DATABASE %I SET app.jwt_secret = %L', current_database(), v_random_secret);
    RAISE NOTICE 'JWT secret configurado: %', v_random_secret;
  END;
END;
$$;

-- Si el secreto no existe, establecer uno predeterminado para desarrollo
-- NOTA: En producción, este debe ser un secreto seguro y coincidiente con la configuración de Supabase
DO $$
BEGIN
  BEGIN
    PERFORM current_setting('app.jwt_secret');
  EXCEPTION WHEN OTHERS THEN
    -- Secreto de desarrollo - NO USAR EN PRODUCCIÓN
    SET app.jwt_secret = 'super-secret-jwt-token-with-at-least-32-characters';
    RAISE NOTICE 'Secreto JWT temporal configurado para desarrollo';
  END;
END;
$$;

-- Verificar que el secreto esté configurado
DO $$
DECLARE
  v_secret text;
BEGIN
  BEGIN
    SELECT current_setting('app.jwt_secret') INTO v_secret;
    RAISE NOTICE 'Secreto JWT configurado correctamente: %', v_secret;
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'No se pudo configurar el secreto JWT';
  END;
END;
$$; 