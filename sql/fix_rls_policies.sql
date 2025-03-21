-- Script para corregir las políticas RLS sin modificar la estructura de la tabla
-- Este enfoque es más seguro y no afecta a las tablas relacionadas

-- 1. Primero desactivamos RLS para poder modificar las políticas sin restricciones
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;

-- 2. Mostrar información sobre la columna id (solo para diagnóstico)
DO $$
DECLARE
  v_column_type TEXT;
BEGIN
  SELECT data_type INTO v_column_type
  FROM information_schema.columns
  WHERE table_name = 'members' AND column_name = 'id';
  
  RAISE NOTICE 'Tipo actual de columna id: %', v_column_type;
  RAISE NOTICE 'NOTA: No cambiaremos el tipo de columna para evitar romper dependencias.';
  RAISE NOTICE 'En su lugar, usaremos conversiones explícitas en todas las políticas.';
END $$;

-- 3. Limpiar todas las políticas existentes en la tabla
DO $$
DECLARE
  r RECORD;
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

-- 4. Crear las políticas mínimas necesarias con conversiones adecuadas de tipo
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
  (auth.uid()::text = id::text) OR
  EXISTS (
    SELECT 1 FROM public.members m
    WHERE m.id::text = auth.uid()::text AND m.role_name IN ('admin', 'super_admin')
  )
);

-- Política para que los usuarios actualicen sus datos
CREATE POLICY "allow_user_update" ON public.members
FOR UPDATE TO authenticated
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- Política para permitir registro (inserción)
CREATE POLICY "allow_auth_insert" ON public.members
FOR INSERT TO authenticated
WITH CHECK (auth.uid()::text = id::text);

-- Política para que administradores gestionen todos los miembros
CREATE POLICY "allow_admin_all" ON public.members
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.members m
    WHERE m.id::text = auth.uid()::text AND m.role_name IN ('admin', 'super_admin')
  )
);

-- 5. Volver a activar RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 6. Asegurar que los permisos están correctamente configurados
GRANT SELECT ON public.members TO anon, authenticated;
GRANT INSERT ON public.members TO anon, authenticated;
GRANT UPDATE ON public.members TO authenticated;

-- 7. Información de diagnóstico
DO $$
BEGIN
  RAISE NOTICE 'Corrección de políticas RLS completada:';
  RAISE NOTICE '- No se modificó la estructura de la tabla (tipo de columna id)';
  RAISE NOTICE '- Se limpiaron todas las políticas antiguas';
  RAISE NOTICE '- Se crearon nuevas políticas con conversiones explícitas id::text y auth.uid()::text';
  RAISE NOTICE '- RLS ha sido reactivado correctamente';
  RAISE NOTICE '- Los permisos necesarios han sido concedidos';
END $$; 