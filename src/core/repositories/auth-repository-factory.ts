import { AuthRepository } from './auth-repository';
import { SupabaseAuthRepository } from './supabase-auth-repository';
import { supabase } from '../supabase/client';

// Esta fábrica nos da el control correcto para jugar
export class AuthRepositoryFactory {
  // Devuelve una instancia del repositorio de autenticación configurado
  static getRepository(): AuthRepository {
    try {
      console.log('AuthRepositoryFactory: Creando instancia de repositorio');
      
      // La nueva implementación de SupabaseAuthRepository permite crear una instancia
      // sin pasar explícitamente el cliente, ya que lo obtendrá internamente
      return new SupabaseAuthRepository();
    } catch (error) {
      console.error('AuthRepositoryFactory: Error al crear el repositorio de autenticación:', error);
      throw error;
    }
  }
} 