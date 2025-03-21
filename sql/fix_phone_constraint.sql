-- Script para corregir la restricción check_phone en la tabla members

-- 1. Primero, veamos qué restricción está definida actualmente
-- (Este es un comentario, no ejecuta nada, solo para información)
-- SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'check_phone';

-- 2. Eliminar la restricción actual
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS check_phone;

-- 3. Crear una nueva restricción que permita el formato 04XX-XXXXXXX
ALTER TABLE public.members ADD CONSTRAINT check_phone 
  CHECK (phone ~ '^04\d{2}-\d{7}$' OR phone ~ '^04\d{2}\d{7}$');

-- 4. Actualizar números de teléfono existentes para que cumplan con el nuevo formato
DO $$
DECLARE
  rec RECORD;
BEGIN
  -- Recorrer todos los registros que no tengan el formato con guión
  FOR rec IN
    SELECT id, phone FROM members
    WHERE phone ~ '^04\d{2}\d{7}$' AND phone !~ '^04\d{2}-\d{7}$'
  LOOP
    -- Actualizar con formato correcto (con guión)
    UPDATE members
    SET phone = substring(rec.phone, 1, 4) || '-' || substring(rec.phone, 5)
    WHERE id = rec.id;
  END LOOP;
END;
$$;

-- 5. Verificar que todos los teléfonos ahora cumplen con el formato correcto
-- SELECT phone, id FROM members WHERE phone !~ '^04\d{2}-\d{7}$'; 