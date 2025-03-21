-- Script para verificar y entender la restricción de clave foránea members_id_fkey

-- 1. Obtener información detallada sobre la restricción
SELECT
    tc.constraint_name,
    tc.table_name AS tabla_origen,
    kcu.column_name AS columna_origen,
    ccu.table_schema AS esquema_destino,
    ccu.table_name AS tabla_destino,
    ccu.column_name AS columna_destino
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_name = 'members_id_fkey'
AND tc.constraint_type = 'FOREIGN KEY';

-- 2. Verificar todas las restricciones de clave foránea en la tabla members
SELECT
    tc.constraint_name,
    tc.table_name AS tabla_origen,
    kcu.column_name AS columna_origen,
    ccu.table_schema AS esquema_destino,
    ccu.table_name AS tabla_destino,
    ccu.column_name AS columna_destino
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'members'
AND tc.constraint_type = 'FOREIGN KEY';

-- 3. Mostrar la definición completa de la tabla members
\d+ public.members

-- 4. Ver definición directa de la restricción desde pg_constraint
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM 
    pg_constraint
WHERE 
    conname = 'members_id_fkey';

-- 5. Consultar algunos registros de la tabla referenciada para entender su estructura
-- Si la tabla referenciada es auth.users
SELECT * FROM auth.users LIMIT 5;

-- 6. Intentar obtener la tabla específica directamente
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_catalog.pg_constraint WHERE conname = 'members_id_fkey'
    ) THEN
        RAISE NOTICE 'La restricción members_id_fkey existe';
        -- Aquí podríamos ejecutar más consultas para extraer más información
    ELSE
        RAISE NOTICE 'La restricción members_id_fkey no existe en este esquema';
    END IF;
END $$; 