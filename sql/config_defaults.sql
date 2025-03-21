-- Script para verificar y configurar valores predeterminados en la tabla members
-- Este script no modifica la estructura de la tabla, solo configura valores y opciones

-- Habilitar mensajes de depuración
DO $$
BEGIN
  EXECUTE 'SET client_min_messages TO DEBUG';
  RAISE NOTICE 'Iniciando configuración de valores predeterminados para la tabla members...';
END $$;

-- Configurar las opciones necesarias para que funcione la generación de tokens
DO $$
BEGIN
  BEGIN
    EXECUTE 'SET app.jwt_secret = ''super-secret-jwt-token-with-at-least-32-characters-long''';
    RAISE NOTICE 'JWT Secret configurado correctamente.';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error al configurar JWT Secret: %', SQLERRM;
  END;
END $$;

-- Verificar que la tabla members existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'members'
  ) THEN
    RAISE EXCEPTION 'La tabla members no existe en el esquema public';
  END IF;
  
  RAISE NOTICE 'Tabla members verificada correctamente.';
END $$;

-- Verificar si se puede insertar un miembro de prueba
DO $$
DECLARE
  test_id TEXT;
  test_phone TEXT := '0412-1234567';
  test_identity TEXT := '12345678';
BEGIN
  -- Primero intentamos eliminar cualquier registro de prueba anterior
  BEGIN
    EXECUTE 'DELETE FROM public.members WHERE phone = ''' || test_phone || ''' OR identity_number = ''' || test_identity || '''';
    RAISE NOTICE 'Limpieza de datos de prueba completada.';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error al limpiar datos de prueba: %', SQLERRM;
  END;
  
  -- Ahora intentamos insertar un registro de prueba
  BEGIN
    EXECUTE 'INSERT INTO public.members (
      phone, identity_number, identity_type, name, last_name, birth_date, role_name, status
    ) VALUES (
      ''' || test_phone || ''', 
      ''' || test_identity || ''', 
      ''V'', 
      ''Usuario'', 
      ''Prueba'', 
      ''1990-01-01'', 
      ''client'', 
      ''active''
    ) RETURNING id' INTO test_id;
    
    IF test_id IS NOT NULL THEN
      RAISE NOTICE 'Inserción de prueba exitosa con ID: %', test_id;
      EXECUTE 'DELETE FROM public.members WHERE id = ''' || test_id || '''';
      RAISE NOTICE 'Registro de prueba eliminado correctamente.';
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error al insertar registro de prueba: %', SQLERRM;
    RAISE NOTICE 'Detalles: %', SQLERRM;
  END;
END $$;

-- Mostrar información sobre las restricciones en la tabla members
DO $$
DECLARE
  r RECORD;
BEGIN
  RAISE NOTICE 'Restricciones en la tabla members:';
  
  FOR r IN (
    SELECT con.conname, pg_get_constraintdef(con.oid) AS constraint_def
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE rel.relname = 'members'
    AND nsp.nspname = 'public'
  ) LOOP
    RAISE NOTICE '- %: %', r.conname, r.constraint_def;
  END LOOP;
END $$;

-- Mostrar información sobre las políticas RLS en la tabla members
DO $$
DECLARE
  r RECORD;
BEGIN
  RAISE NOTICE 'Políticas RLS en la tabla members:';
  
  FOR r IN (
    SELECT polname, polcmd, polpermissive, polroles::text, pg_get_expr(polqual, polrelid) AS using_expr
    FROM pg_policy
    WHERE polrelid = 'public.members'::regclass
  ) LOOP
    RAISE NOTICE '- Nombre: %, Comando: %, Permisiva: %, Roles: %, Expresión: %', 
      r.polname, r.polcmd, r.polpermissive, r.polroles, r.using_expr;
  END LOOP;
END $$;

-- Mostrar información sobre los permisos de la tabla members
DO $$
DECLARE
  r RECORD;
BEGIN
  RAISE NOTICE 'Permisos en la tabla members:';
  
  FOR r IN (
    SELECT grantee, privilege_type
    FROM information_schema.role_table_grants
    WHERE table_name = 'members'
    AND table_schema = 'public'
  ) LOOP
    RAISE NOTICE '- Rol: %, Privilegio: %', r.grantee, r.privilege_type;
  END LOOP;
END $$;

-- Verificar la función create_session_for_phone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' 
    AND p.proname = 'create_session_for_phone'
  ) THEN
    RAISE NOTICE 'La función create_session_for_phone no existe. Esto podría causar errores en el registro.';
  ELSE
    RAISE NOTICE 'La función create_session_for_phone existe.';
  END IF;
END $$;

-- Restaurar nivel de mensajes
DO $$
BEGIN
  EXECUTE 'SET client_min_messages TO NOTICE';
  RAISE NOTICE 'Configuración de valores predeterminados finalizada.';
END $$; 