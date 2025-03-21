-- Script completo para configurar la base de datos para GymNext
-- Ejecutar en el Editor SQL de Supabase

------------------------------------------------------------
-- 1. VERIFICACIÓN DE TABLA Y COLUMNAS
------------------------------------------------------------

-- Verificar si la tabla members existe, y crearla si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'members'
    ) THEN
        -- Crear la tabla members si no existe
        CREATE TABLE public.members (
            id UUID PRIMARY KEY,
            name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            identity_type TEXT NOT NULL DEFAULT 'V',
            identity_number TEXT NOT NULL,
            phone TEXT NOT NULL,
            birth_date DATE,
            email TEXT NULL, -- Opcional, no utilizado para autenticación
            role TEXT NOT NULL DEFAULT 'client',
            accept_terms BOOLEAN NOT NULL DEFAULT FALSE,
            accept_marketing BOOLEAN NOT NULL DEFAULT FALSE,
            accept_club_membership BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        RAISE NOTICE 'Tabla members creada';
    ELSE
        RAISE NOTICE 'Tabla members ya existe';
        
        -- Si la tabla ya existe, verificar y agregar columnas que falten
        -- Verificar columna email
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'members' 
            AND column_name = 'email'
        ) THEN
            ALTER TABLE public.members ADD COLUMN email TEXT NULL;
            RAISE NOTICE 'Columna email agregada a la tabla members';
        END IF;
        
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
        
        -- Verificar columna role
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'members' 
            AND column_name = 'role'
        ) THEN
            ALTER TABLE public.members ADD COLUMN role TEXT NOT NULL DEFAULT 'client';
            RAISE NOTICE 'Columna role agregada a la tabla members';
        END IF;
    END IF;
END
$$;

-- Agregar comentarios a la tabla y columnas para documentar el propósito
COMMENT ON TABLE public.members IS 'Tabla de miembros con autenticación por teléfono y cédula, sin usar email';
COMMENT ON COLUMN public.members.phone IS 'Teléfono del usuario, usado como identificador principal para autenticación';
COMMENT ON COLUMN public.members.identity_number IS 'Número de cédula, usado como identificador secundario para autenticación';
COMMENT ON COLUMN public.members.email IS 'Campo opcional, no usado para autenticación';

-- Agregar restricciones únicas para evitar duplicados
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_phone_unique;
ALTER TABLE public.members ADD CONSTRAINT members_phone_unique UNIQUE (phone);

ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_identity_number_unique;
ALTER TABLE public.members ADD CONSTRAINT members_identity_number_unique UNIQUE (identity_number);

------------------------------------------------------------
-- 2. TRIGGERS
------------------------------------------------------------

-- Trigger para actualizar el timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Eliminar el trigger si ya existe
DROP TRIGGER IF EXISTS update_members_updated_at ON public.members;

-- Crear el trigger
CREATE TRIGGER update_members_updated_at
BEFORE UPDATE ON public.members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

------------------------------------------------------------
-- 3. FUNCIONES UTILITARIAS
------------------------------------------------------------

-- Función para generar un UUID (usado en el cliente si no tiene acceso a crypto)
CREATE OR REPLACE FUNCTION public.gen_random_uuid()
RETURNS uuid
LANGUAGE sql
AS $$
  SELECT gen_random_uuid();
$$;

-- Función para validar el formato del teléfono
CREATE OR REPLACE FUNCTION public.is_valid_phone(phone_number text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validar que el número de teléfono tenga exactamente 11 dígitos y comience con cero
  RETURN phone_number ~ '^0\d{10}$';
END;
$$;

------------------------------------------------------------
-- 4. FUNCIÓN PARA CREAR SESIONES
------------------------------------------------------------

-- Función para crear una sesión para un usuario basado en teléfono y cédula
CREATE OR REPLACE FUNCTION public.create_session_for_phone(
  p_phone text,
  p_identity_number text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_token text;
  v_refresh_token text;
  v_expires_at timestamp with time zone;
BEGIN
  -- Validar el teléfono
  IF NOT (p_phone ~ '^0\d{10}$') THEN
    RAISE EXCEPTION 'El número de teléfono debe tener 11 dígitos y comenzar con cero (0)';
  END IF;
  
  -- Validar el número de identidad
  IF NOT (p_identity_number ~ '^\d{7,8}$') THEN
    RAISE EXCEPTION 'El número de identidad debe tener entre 7 y 8 dígitos';
  END IF;
  
  -- Obtener el ID del usuario
  SELECT id INTO v_user_id FROM members 
  WHERE phone = p_phone AND identity_number = p_identity_number;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró un usuario con ese teléfono y cédula';
  END IF;
  
  -- Generar tokens (utilizando UUIDs como ejemplo)
  v_token := gen_random_uuid()::text;
  v_refresh_token := gen_random_uuid()::text;
  v_expires_at := now() + interval '1 day';
  
  -- Intentar insertar en auth.sessions (este paso es opcional y puede fallar)
  BEGIN
    -- Intentar insertar en auth.sessions
    -- Esto puede fallar si no tienes permisos, pero no afecta el funcionamiento básico
    INSERT INTO auth.sessions (
      id,
      user_id,
      created_at,
      updated_at,
      factor_id,
      not_after,
      refreshed_at,
      user_agent,
      ip
    ) VALUES (
      gen_random_uuid(),
      v_user_id,
      now(),
      now(),
      NULL,
      v_expires_at,
      now(),
      'Custom Session',
      '127.0.0.1'
    );
    EXCEPTION WHEN OTHERS THEN
      -- Ignorar errores, continuar con el flujo
      NULL;
  END;
  
  RETURN json_build_object(
    'user_id', v_user_id,
    'token', v_token,
    'refresh_token', v_refresh_token,
    'expires_at', v_expires_at
  );
END;
$$;

------------------------------------------------------------
-- 5. POLÍTICAS DE SEGURIDAD (RLS)
------------------------------------------------------------

-- Asegurar que RLS está activado en la tabla members
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DO $$
BEGIN
  -- Políticas para seleccionar registros
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'members' AND policyname = 'Enable read access for all users') THEN
    DROP POLICY "Enable read access for all users" ON public.members;
  END IF;
  
  -- Políticas para insertar registros
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'members' AND policyname = 'Enable insert for authenticated users only') THEN
    DROP POLICY "Enable insert for authenticated users only" ON public.members;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'members' AND policyname = 'Allow public registration') THEN
    DROP POLICY "Allow public registration" ON public.members;
  END IF;
  
  -- Políticas para actualizar registros
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'members' AND policyname = 'Enable update for users based on id') THEN
    DROP POLICY "Enable update for users based on id" ON public.members;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'members' AND policyname = 'Enable update for own profile') THEN
    DROP POLICY "Enable update for own profile" ON public.members;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'members' AND policyname = 'Enable update for admin users') THEN
    DROP POLICY "Enable update for admin users" ON public.members;
  END IF;
  
  -- Políticas para eliminar registros
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'members' AND policyname = 'Enable delete for users based on id') THEN
    DROP POLICY "Enable delete for users based on id" ON public.members;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'members' AND policyname = 'Enable delete for admin users') THEN
    DROP POLICY "Enable delete for admin users" ON public.members;
  END IF;
END
$$;

-- Política para permitir registro público (antes de autenticación)
CREATE POLICY "Allow public registration" 
ON public.members FOR INSERT 
TO anon
WITH CHECK (true);

-- Política para que los usuarios puedan leer su propio perfil
CREATE POLICY "Enable read access for own profile" 
ON public.members FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Política para que los administradores puedan leer todos los perfiles
CREATE POLICY "Enable read access for admin users" 
ON public.members FOR SELECT 
TO authenticated
USING (
  EXISTS (
    WITH role_check AS (
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'role'
      ) AS has_role_column
    )
    SELECT 1 FROM members, role_check 
    WHERE id = auth.uid() 
    AND (
      NOT role_check.has_role_column OR -- Si no existe la columna role, permitir a todos
      (role_check.has_role_column AND role = 'admin')
    )
  )
);

-- Política para que los usuarios puedan actualizar su propio perfil
CREATE POLICY "Enable update for own profile" 
ON public.members FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política para que los administradores puedan actualizar todos los perfiles
CREATE POLICY "Enable update for admin users" 
ON public.members FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    WITH role_check AS (
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'role'
      ) AS has_role_column
    )
    SELECT 1 FROM members, role_check 
    WHERE id = auth.uid() 
    AND (
      NOT role_check.has_role_column OR -- Si no existe la columna role, permitir a todos
      (role_check.has_role_column AND role = 'admin')
    )
  )
);

-- Política para que los administradores puedan eliminar registros
CREATE POLICY "Enable delete for admin users" 
ON public.members FOR DELETE 
TO authenticated
USING (
  EXISTS (
    WITH role_check AS (
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'members' 
        AND column_name = 'role'
      ) AS has_role_column
    )
    SELECT 1 FROM members, role_check 
    WHERE id = auth.uid() 
    AND (
      NOT role_check.has_role_column OR -- Si no existe la columna role, permitir a todos
      (role_check.has_role_column AND role = 'admin')
    )
  )
);

------------------------------------------------------------
-- 6. ÍNDICES
------------------------------------------------------------

-- Índices para mejorar el rendimiento de las búsquedas
CREATE INDEX IF NOT EXISTS idx_members_phone ON public.members(phone);
CREATE INDEX IF NOT EXISTS idx_members_identity_number ON public.members(identity_number);

------------------------------------------------------------
-- 7. PERMISOS
------------------------------------------------------------

-- Conceder permisos a roles de aplicación
GRANT EXECUTE ON FUNCTION public.gen_random_uuid TO authenticated;
GRANT EXECUTE ON FUNCTION public.gen_random_uuid TO anon;
GRANT EXECUTE ON FUNCTION public.is_valid_phone TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_valid_phone TO anon;
GRANT EXECUTE ON FUNCTION public.create_session_for_phone TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_session_for_phone TO anon;

-- Mensaje de confirmación
SELECT 'Configuración de base de datos completada exitosamente!' as mensaje; 