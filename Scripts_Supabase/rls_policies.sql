-- Primero, permitir acceso a la tabla members para usuarios anónimos

-- Desactivar RLS temporalmente para consultar si ya hay políticas
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DO $$ 
BEGIN
    -- Intenta eliminar las políticas existentes
    BEGIN
        DROP POLICY IF EXISTS "Usuarios pueden leer sus propios datos" ON public.members;
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar errores
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Permitir registro inicial" ON public.members;
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar errores
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Permitir verificación de duplicados" ON public.members;
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar errores
    END;

    BEGIN
        DROP POLICY IF EXISTS "Permitir login por teléfono" ON public.members;
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar errores
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Admins pueden ver todos los miembros" ON public.members;
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar errores
    END;
END $$;

-- Activar RLS en la tabla members
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuarios anónimos verifiquen la existencia de teléfonos o cédulas
-- para evitar duplicados durante el registro
CREATE POLICY "Permitir verificación de duplicados"
ON public.members
FOR SELECT
TO anon
USING (true);

-- Política para permitir que los usuarios no autenticados busquen por teléfono y cédula
-- para iniciar sesión
CREATE POLICY "Permitir login por teléfono"
ON public.members
FOR SELECT
TO anon
USING (true);

-- Política para permitir que los usuarios autenticados vean sus propios datos
CREATE POLICY "Usuarios pueden leer sus propios datos"
ON public.members
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Política para permitir que los administradores vean todos los miembros
CREATE POLICY "Admins pueden ver todos los miembros"
ON public.members
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.members m
    WHERE m.id = auth.uid() AND m.role_name IN ('admin', 'super_admin')
  )
);

-- Política para permitir el registro inicial (inserción en la tabla members)
CREATE POLICY "Permitir registro inicial"
ON public.members
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Opcionalmente, agregar política para permitir a usuarios autenticados actualizar sus propios datos
CREATE POLICY "Usuarios pueden actualizar sus propios datos"
ON public.members
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Conceder permisos para las funciones RPC
GRANT EXECUTE ON FUNCTION public.create_user_with_phone TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_session_for_phone TO anon, authenticated; 