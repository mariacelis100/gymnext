-- Script para restaurar la seguridad después de las pruebas
-- NOTA: Usar después de terminar las pruebas

-- Restaurar restricciones de unicidad con índices
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_phone_key;
ALTER TABLE public.members 
ADD CONSTRAINT members_phone_key UNIQUE (phone);

ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_identity_number_key;
ALTER TABLE public.members 
ADD CONSTRAINT members_identity_number_key UNIQUE (identity_number);

-- Verificar que las restricciones de número de teléfono estén correctas
DO $$
BEGIN
  -- Si existe la restricción anterior, eliminarla
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_phone'
  ) THEN
    ALTER TABLE public.members DROP CONSTRAINT check_phone;
  END IF;
  
  -- Agregar la restricción de validación para el formato de teléfono
  ALTER TABLE public.members
  ADD CONSTRAINT check_phone CHECK (phone ~ '^04[0-9]{2}-[0-9]{7}$');
END $$;

-- Activar RLS para la tabla
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes
-- Intentamos eliminar todas las políticas posibles
DROP POLICY IF EXISTS members_select_policy ON public.members;
DROP POLICY IF EXISTS members_update_policy ON public.members;
DROP POLICY IF EXISTS members_verify_policy ON public.members;
DROP POLICY IF EXISTS members_insert_policy ON public.members;
DROP POLICY IF EXISTS members_delete_policy ON public.members;
DROP POLICY IF EXISTS "Usuarios pueden leer sus propios datos" ON public.members;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios datos" ON public.members;
DROP POLICY IF EXISTS "Permitir registro inicial" ON public.members;
DROP POLICY IF EXISTS "Permitir verificación de duplicados" ON public.members;
DROP POLICY IF EXISTS "Permitir login por teléfono" ON public.members;
DROP POLICY IF EXISTS "Admins pueden ver todos los miembros" ON public.members;

-- Recrear políticas básicas de seguridad
-- Política para permitir que los usuarios vean solo sus propios datos
CREATE POLICY "Usuarios pueden leer sus propios datos" ON public.members
  FOR SELECT USING (
    (auth.uid() IS NOT NULL AND auth.uid()::text = id) OR
    (auth.uid() IS NOT NULL AND 
      EXISTS (
        SELECT 1 FROM public.members m
        WHERE m.id = auth.uid()::text AND m.role_name IN ('admin', 'super_admin')
      )
    )
  );

-- Política para permitir que los usuarios actualicen solo sus propios datos
CREATE POLICY "Usuarios pueden actualizar sus propios datos" ON public.members
  FOR UPDATE USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- Política para verificar duplicados (permitir consultas SELECT para verificación)
CREATE POLICY "Permitir verificación de duplicados" ON public.members
  FOR SELECT
  TO anon
  USING (true);

-- Política para permitir login por teléfono
CREATE POLICY "Permitir login por teléfono" ON public.members
  FOR SELECT
  TO anon
  USING (true);

-- Política para permitir registro inicial
CREATE POLICY "Permitir registro inicial" ON public.members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id);

-- Política para que administradores puedan ver todos los miembros
CREATE POLICY "Admins pueden ver todos los miembros" ON public.members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.id = auth.uid()::text AND m.role_name IN ('admin', 'super_admin')
    )
  );

-- Revocar permisos explícitos a anon y authenticated
REVOKE ALL ON public.members FROM anon, authenticated;

-- Otorgar solo los permisos necesarios
GRANT SELECT ON public.members TO anon, authenticated;
GRANT INSERT ON public.members TO anon, authenticated;
GRANT UPDATE ON public.members TO authenticated;

-- Otorgar permisos de ejecución para funciones específicas
GRANT EXECUTE ON FUNCTION public.create_session_for_phone(p_phone text, p_identity_number text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_member_by_phone(p_phone text) TO anon, authenticated;

-- Campo opcional, no usado para autenticación 