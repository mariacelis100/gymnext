-- Script para solucionar el error "column role of relation public.members does not exist"

-- Verificar si la columna role existe y agregarla si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'role'
    ) THEN
        -- La columna no existe, agregarla
        ALTER TABLE public.members ADD COLUMN role TEXT NOT NULL DEFAULT 'client';
        
        -- Agregar comentario a la columna
        COMMENT ON COLUMN public.members.role IS 'Rol del usuario (client, admin, trainer, etc.)';
        
        RAISE NOTICE 'Columna role agregada a la tabla members';
    ELSE
        RAISE NOTICE 'Columna role ya existe en la tabla members';
    END IF;
END
$$;

-- Mensaje de confirmación
SELECT 'Columna role verificada/agregada correctamente' as mensaje; 