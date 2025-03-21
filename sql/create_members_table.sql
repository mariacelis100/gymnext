-- Crear la tabla members si no existe
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  identity_type TEXT NOT NULL DEFAULT 'V',
  identity_number TEXT NOT NULL,
  phone TEXT NOT NULL,
  birth_date DATE,
  email TEXT NULL,
  role TEXT NOT NULL DEFAULT 'client',
  accept_terms BOOLEAN NOT NULL DEFAULT FALSE,
  accept_marketing BOOLEAN NOT NULL DEFAULT FALSE,
  accept_club_membership BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Agregar restricciones únicas para evitar duplicados
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_phone_unique;
ALTER TABLE public.members ADD CONSTRAINT members_phone_unique UNIQUE (phone);

ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_identity_number_unique;
ALTER TABLE public.members ADD CONSTRAINT members_identity_number_unique UNIQUE (identity_number);

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