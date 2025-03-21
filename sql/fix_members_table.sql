-- Script para solucionar el error "column email of relation public.members does not exist"

-- Verificar si la columna email existe y agregarla si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'email'
    ) THEN
        -- La columna no existe, agregarla
        ALTER TABLE public.members ADD COLUMN email TEXT NULL;
        
        -- Agregar comentario a la columna
        COMMENT ON COLUMN public.members.email IS 'Campo opcional, no usado para autenticación';
        
        RAISE NOTICE 'Columna email agregada a la tabla members';
    ELSE
        RAISE NOTICE 'Columna email ya existe en la tabla members';
    END IF;
END
$$;

-- Verificar si todas las otras columnas necesarias existen
DO $$
BEGIN
    -- Verificar columna identity_type
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'identity_type'
    ) THEN
        ALTER TABLE public.members ADD COLUMN identity_type TEXT NOT NULL DEFAULT 'V';
        RAISE NOTICE 'Columna identity_type agregada a la tabla members';
    END IF;
    
    -- Verificar columna accept_terms
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'accept_terms'
    ) THEN
        ALTER TABLE public.members ADD COLUMN accept_terms BOOLEAN NOT NULL DEFAULT FALSE;
        RAISE NOTICE 'Columna accept_terms agregada a la tabla members';
    END IF;
    
    -- Verificar columna accept_marketing
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'accept_marketing'
    ) THEN
        ALTER TABLE public.members ADD COLUMN accept_marketing BOOLEAN NOT NULL DEFAULT FALSE;
        RAISE NOTICE 'Columna accept_marketing agregada a la tabla members';
    END IF;
    
    -- Verificar columna accept_club_membership
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'accept_club_membership'
    ) THEN
        ALTER TABLE public.members ADD COLUMN accept_club_membership BOOLEAN NOT NULL DEFAULT FALSE;
        RAISE NOTICE 'Columna accept_club_membership agregada a la tabla members';
    END IF;
END
$$;

-- Mensaje de confirmación
SELECT 'Estructura de la tabla members verificada y actualizada correctamente' as mensaje; 