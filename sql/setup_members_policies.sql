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
  
  -- Políticas para actualizar registros
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'members' AND policyname = 'Enable update for users based on id') THEN
    DROP POLICY "Enable update for users based on id" ON public.members;
  END IF;
  
  -- Políticas para eliminar registros
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'members' AND policyname = 'Enable delete for users based on id') THEN
    DROP POLICY "Enable delete for users based on id" ON public.members;
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
    SELECT 1 FROM members 
    WHERE id = auth.uid() AND role = 'admin'
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
    SELECT 1 FROM members 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Política para que los administradores puedan eliminar registros
CREATE POLICY "Enable delete for admin users" 
ON public.members FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM members 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Índices para mejorar el rendimiento de las búsquedas
CREATE INDEX IF NOT EXISTS idx_members_phone ON public.members(phone);
CREATE INDEX IF NOT EXISTS idx_members_identity_number ON public.members(identity_number);

-- Verificar y agregar columnas si no existen
DO $$
BEGIN
  -- identity_type
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'members' 
                AND column_name = 'identity_type') THEN
    ALTER TABLE members ADD COLUMN identity_type text DEFAULT 'V';
  END IF;
  
  -- accept_terms
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'members' 
                AND column_name = 'accept_terms') THEN
    ALTER TABLE members ADD COLUMN accept_terms boolean DEFAULT false;
  END IF;
  
  -- accept_marketing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'members' 
                AND column_name = 'accept_marketing') THEN
    ALTER TABLE members ADD COLUMN accept_marketing boolean DEFAULT false;
  END IF;
  
  -- accept_club_membership
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'members' 
                AND column_name = 'accept_club_membership') THEN
    ALTER TABLE members ADD COLUMN accept_club_membership boolean DEFAULT false;
  END IF;
END
$$; 