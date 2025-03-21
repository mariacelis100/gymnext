-- Script para corregir el problema del id nulo en la tabla members
-- Este script verificará y añadirá un valor por defecto a la columna id

-- Desactivar RLS temporalmente para modificaciones
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;

-- 1. Verificar la definición actual de la columna id
DO $$
DECLARE
  v_column_default TEXT;
  v_column_type TEXT;
BEGIN
  SELECT column_default, data_type 
  INTO v_column_default, v_column_type
  FROM information_schema.columns 
  WHERE table_name = 'members' 
  AND column_name = 'id'
  AND table_schema = 'public';
  
  RAISE NOTICE 'Definición actual de la columna id:';
  RAISE NOTICE 'Tipo: %', v_column_type;
  RAISE NOTICE 'Valor por defecto: %', v_column_default;
  
  -- 2. Corregir la columna id si es necesario
  IF v_column_default IS NULL THEN
    RAISE NOTICE 'La columna id no tiene un valor por defecto. Añadiendo valor por defecto...';
    
    -- Dependiendo del tipo, usamos la expresión apropiada
    IF v_column_type = 'uuid' THEN
      ALTER TABLE public.members 
      ALTER COLUMN id SET DEFAULT gen_random_uuid();
      RAISE NOTICE 'Valor por defecto gen_random_uuid() añadido para columna de tipo UUID';
    ELSIF v_column_type = 'text' THEN
      ALTER TABLE public.members 
      ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
      RAISE NOTICE 'Valor por defecto gen_random_uuid()::text añadido para columna de tipo TEXT';
    ELSE
      RAISE NOTICE 'Tipo de columna % no reconocido. No se pudo establecer un valor por defecto.', v_column_type;
    END IF;
  ELSE
    RAISE NOTICE 'La columna id ya tiene un valor por defecto: %', v_column_default;
  END IF;
  
  -- 3. Verificar que el valor por defecto se ha establecido correctamente
  SELECT column_default 
  INTO v_column_default
  FROM information_schema.columns 
  WHERE table_name = 'members' 
  AND column_name = 'id'
  AND table_schema = 'public';
  
  RAISE NOTICE 'Valor por defecto actual: %', v_column_default;
END $$;

-- 4. Verificar restricciones de la tabla
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

-- 5. Probar la inserción con el valor por defecto en la columna id
DO $$
DECLARE
  test_id TEXT;
  test_phone TEXT := '0412-9876543';
  test_identity TEXT := '87654321';
BEGIN
  -- Insertar un registro de prueba y verificar que se genere el id
  BEGIN
    EXECUTE 'INSERT INTO public.members (
      phone, identity_number, identity_type, name, last_name, birth_date, role_name, status
    ) VALUES (
      ''' || test_phone || ''', 
      ''' || test_identity || ''', 
      ''V'', 
      ''Test'', 
      ''User'', 
      ''1990-01-01'', 
      ''client'', 
      ''active''
    ) RETURNING id' INTO test_id;
    
    IF test_id IS NOT NULL THEN
      RAISE NOTICE 'Prueba exitosa: Se generó automáticamente el ID: %', test_id;
      EXECUTE 'DELETE FROM public.members WHERE id = ''' || test_id || '''';
      RAISE NOTICE 'Registro de prueba eliminado.';
    ELSE
      RAISE NOTICE 'Error: No se generó un ID automáticamente.';
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error al insertar registro de prueba: %', SQLERRM;
  END;
END $$;

-- 6. Activar RLS de nuevo
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 7. Configurar permisos para asegurar que anon puede insertar
GRANT INSERT ON public.members TO anon, authenticated;

-- Asegurar que la política de inserción anónima existe
DROP POLICY IF EXISTS "allow_anon_insert" ON public.members;
CREATE POLICY "allow_anon_insert" ON public.members
FOR INSERT
TO anon
WITH CHECK (true);

-- Mensaje final
DO $$
BEGIN
  RAISE NOTICE 'Corrección de la columna id completada. Ahora debería generarse automáticamente un valor UUID.';
END $$; 