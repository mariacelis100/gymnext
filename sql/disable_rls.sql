-- Script para desactivar temporalmente la seguridad a nivel de fila (RLS)
-- y resolver problemas de permisos en la tabla members

-- 1. Desactivar temporalmente Row Level Security
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;

-- 2. Permitir acceso anónimo a miembros
BEGIN;
  -- Asegurarse de que exista una política para permitir verificación durante registro
  DROP POLICY IF EXISTS "Permitir verificación durante registro" ON public.members;
  
  CREATE POLICY "Permitir verificación durante registro"
  ON public.members
  FOR SELECT
  TO anon
  USING (true);
  
  -- Política para permitir la inserción de nuevos miembros por usuarios anónimos
  DROP POLICY IF EXISTS "Permitir inserción anónima" ON public.members;
  
  CREATE POLICY "Permitir inserción anónima"
  ON public.members
  FOR INSERT
  TO anon
  WITH CHECK (true);
COMMIT;

-- 3. Asegurarse de que las restricciones de teléfono acepten ambos formatos
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS check_phone;
ALTER TABLE public.members ADD CONSTRAINT check_phone 
  CHECK (phone ~ '^04\d{2}-\d{7}$' OR phone ~ '^04\d{2}\d{7}$');

-- 4. Verificar y ajustar las restricciones de unicidad
-- Temporal: Desactivar las restricciones de unicidad para permitir pruebas
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_phone_unique;
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_identity_number_unique;

-- 5. Volver a crear las restricciones pero permitiendo valores nulos
ALTER TABLE public.members ADD CONSTRAINT members_phone_unique 
  UNIQUE (phone);
ALTER TABLE public.members ADD CONSTRAINT members_identity_number_unique 
  UNIQUE (identity_number);

-- 6. Conceder permisos explícitos para operaciones CRUD en la tabla members
GRANT SELECT, INSERT, UPDATE, DELETE ON public.members TO anon, authenticated;

-- NOTA: Este script desactiva características de seguridad importantes.
-- Úsalo solo para depuración y vuelve a activar RLS cuando hayas terminado
-- con: ALTER TABLE public.members ENABLE ROW LEVEL SECURITY; 