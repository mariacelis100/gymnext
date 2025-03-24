-- Script para implementar la función auth.sign faltante en Supabase
-- Este script soluciona el error "function auth.sign(json, text) does not exist"

-- Crear la extensión pgcrypto si no existe (requerida para operaciones criptográficas)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Crear el esquema auth si no existe
CREATE SCHEMA IF NOT EXISTS auth;

-- Función para firmar tokens JWT (implementación simplificada)
CREATE OR REPLACE FUNCTION auth.sign(payload json, secret text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  header text;
  encoded_header text;
  encoded_payload text;
  signature text;
  complete_token text;
BEGIN
  -- Crear el encabezado estándar JWT
  header := '{"alg":"HS256","typ":"JWT"}';
  
  -- Codificar el encabezado y el payload en base64url
  encoded_header := replace(replace(encode(header::bytea, 'base64'), '+', '-'), '/', '_');
  encoded_payload := replace(replace(encode(payload::text::bytea, 'base64'), '+', '-'), '/', '_');
  
  -- Remover padding = al final
  encoded_header := rtrim(encoded_header, '=');
  encoded_payload := rtrim(encoded_payload, '=');
  
  -- Crear la firma utilizando HMAC-SHA256
  signature := replace(replace(encode(
    hmac(encoded_header || '.' || encoded_payload, secret, 'sha256'),
    'base64'
  ), '+', '-'), '/', '_');
  
  -- Remover padding = al final de la firma
  signature := rtrim(signature, '=');
  
  -- Combinar todo para formar el token completo
  complete_token := encoded_header || '.' || encoded_payload || '.' || signature;
  
  RETURN complete_token;
END;
$$;

-- Otorgar permisos para usar la función
GRANT EXECUTE ON FUNCTION auth.sign(json, text) TO postgres, anon, authenticated, service_role;

-- Ejecutar una prueba para verificar que la función funciona
DO $$
DECLARE
  test_token text;
BEGIN
  SELECT auth.sign(
    '{"sub":"test","iat":1234567890,"exp":9876543210}'::json,
    'test_secret'
  ) INTO test_token;
  
  RAISE NOTICE 'Token de prueba generado: %', test_token;
END;
$$; 