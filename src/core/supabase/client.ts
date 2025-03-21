import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from './database.types'

// Variable para almacenar el cliente singleton
let _supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null;

// Inicializar el cliente si aún no existe
const initializeClient = () => {
  if (_supabaseClient) {
    return _supabaseClient;
  }

  try {
    console.log('Inicializando nuevo cliente de Supabase');
    const client = createClientComponentClient<Database>();
    
    // Verificar que el cliente se haya creado correctamente
    if (!client) {
      console.error('Error: El cliente de Supabase no se pudo inicializar');
      throw new Error('Error de conexión con el servidor');
    }
    
    // Guardar el cliente en la variable singleton
    _supabaseClient = client;
    console.log('Cliente de Supabase inicializado exitosamente');
    
    return client;
  } catch (error) {
    console.error('Error crítico al inicializar cliente de Supabase:', error);
    throw error;
  }
};

// Cliente para componentes de cliente
export const createClient = () => {
  return initializeClient();
};

// Cliente singleton para usar en toda la aplicación
// Aseguramos que supabase esté siempre inicializado
export const supabase = initializeClient();

// Función para reiniciar el cliente (útil para pruebas o después de cierre de sesión)
export const resetClient = () => {
  _supabaseClient = null;
  return initializeClient();
};

// Función de ayuda para verificar autenticación
export const isAuthenticated = async () => {
  try {
    const client = initializeClient();
    const { data, error } = await client.auth.getSession();
    
    if (error) {
      console.error('Error al verificar sesión:', error);
      throw error;
    }
    
    return !!data.session;
  } catch (error) {
    console.error('Error en isAuthenticated:', error);
    return false;
  }
};

// Función para registrar usuario
export const signUp = async (userData: {
  phone: string;
  identityNumber: string;
  identityType: string;
  name: string;
  lastName: string;
  birthDate: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
  acceptClubMembership: boolean;
}) => {
  // Implementación real va aquí
  return await supabase.auth.signUp({
    phone: userData.phone,
    password: userData.identityNumber
  });
} 