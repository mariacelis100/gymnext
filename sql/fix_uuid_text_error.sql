-- Script para diagnosticar y solucionar el error de comparación UUID-TEXT
-- Este script desactiva temporalmente RLS para hacer los cambios necesarios

-- 1. Primero desactivamos RLS para poder modificar la tabla sin restricciones
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;

-- 2. Verificamos el tipo de la columna id
DO $$
DECLARE
  v_column_type TEXT;
BEGIN
  SELECT data_type INTO v_column_type
  FROM information_schema.columns
  WHERE table_name = 'members' AND column_name = 'id';
  
  RAISE NOTICE 'Tipo actual de columna id: %', v_column_type;
  
  -- Si no es TEXT, modificamos la columna
  IF v_column_type != 'text' THEN
    RAISE NOTICE 'Cambiando tipo de columna id a TEXT...';
    
    -- Crear una columna temporal
    ALTER TABLE public.members ADD COLUMN id_text TEXT;
    
    -- Copiar los valores convertidos a texto
    UPDATE public.members SET id_text = id::text;
    
    -- Eliminar las restricciones de clave primaria
    ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_pkey;
    
    -- Renombrar columnas
    ALTER TABLE public.members DROP COLUMN id;
    ALTER TABLE public.members RENAME COLUMN id_text TO id;
    
    -- Recrear clave primaria
    ALTER TABLE public.members ADD PRIMARY KEY (id);
    
    RAISE NOTICE 'Columna id convertida a TEXT correctamente';
  ELSE
    RAISE NOTICE 'La columna id ya es de tipo TEXT, no se requiere conversión';
  END IF;
END $$;

-- 3. Limpiar todas las políticas existentes en la tabla
DO $$
BEGIN
  -- Eliminar todas las políticas existentes
  FOR r IN (
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'members' AND schemaname = 'public'
  ) LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.members;';
    RAISE NOTICE 'Política eliminada: %', r.policyname;
  END LOOP;
END $$;

-- 4. Crear las políticas mínimas necesarias con conversiones adecuadas
-- Política para permitir que usuarios anónimos verifiquen existencia
CREATE POLICY "allow_anon_select" ON public.members
FOR SELECT TO anon USING (true);

-- Política para permitir inserción anónima durante registro
CREATE POLICY "allow_anon_insert" ON public.members
FOR INSERT TO anon WITH CHECK (true);

-- Política para que los usuarios vean sus propios datos
CREATE POLICY "allow_user_select" ON public.members
FOR SELECT TO authenticated
USING (
  (auth.uid()::text = id) OR
  EXISTS (
    SELECT 1 FROM public.members m
    WHERE m.id = auth.uid()::text AND m.role_name IN ('admin', 'super_admin')
  )
);

-- Política para que los usuarios actualicen sus datos
CREATE POLICY "allow_user_update" ON public.members
FOR UPDATE TO authenticated
USING (auth.uid()::text = id)
WITH CHECK (auth.uid()::text = id);

-- Política para que administradores gestionen todos los miembros
CREATE POLICY "allow_admin_all" ON public.members
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.members m
    WHERE m.id = auth.uid()::text AND m.role_name IN ('admin', 'super_admin')
  )
);

-- 5. Volver a activar RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 6. Conceder los permisos necesarios
GRANT SELECT ON public.members TO anon, authenticated;
GRANT INSERT ON public.members TO anon, authenticated;
GRANT UPDATE ON public.members TO authenticated;

-- 7. Información de diagnóstico
DO $$
BEGIN
  RAISE NOTICE 'Diagnóstico completado:';
  RAISE NOTICE '- Verificado tipo de columna id';
  RAISE NOTICE '- Limpiadas todas las políticas antiguas';
  RAISE NOTICE '- Creadas nuevas políticas con conversiones correctas';
  RAISE NOTICE '- RLS reactivado';
  RAISE NOTICE '- Permisos concedidos';
END $$; 