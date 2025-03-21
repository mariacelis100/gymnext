-- Script para configurar los ajustes de autenticación en Supabase

-- Deshabilitar registro por correo electrónico (si es necesario)
UPDATE auth.config
SET enable_signup = false  -- Cambiar a true para habilitar
WHERE id = 1;

-- Habilitar inicio de sesión con proveedor personalizado (necesario para auth por teléfono)
UPDATE auth.config
SET enable_phone_signup = true,
    enable_phone_signin = true
WHERE id = 1;

-- Configurar tiempo de caducidad del token (1 hora = 3600 segundos)
UPDATE auth.config
SET jwt_exp = 3600
WHERE id = 1;

-- Opcional: Configurar URL de redirección después del login/logout
UPDATE auth.config
SET site_url = 'http://localhost:3000',
    additional_redirect_urls = ARRAY['https://gymnext.vercel.app', 'https://gimnasio.com']
WHERE id = 1;

-- Configurar opciones de seguridad
UPDATE auth.config
SET security_captcha_enabled = false,  -- Habilitar/deshabilitar captcha
    security_update_password_require_reauthentication = true  -- Requerir reautenticación para cambiar contraseña
WHERE id = 1;

-- Mostrar la configuración actual
SELECT 
    id, 
    enable_signup,
    enable_phone_signup,
    enable_phone_signin,
    jwt_exp,
    site_url,
    additional_redirect_urls,
    security_captcha_enabled,
    security_update_password_require_reauthentication
FROM auth.config
WHERE id = 1; 