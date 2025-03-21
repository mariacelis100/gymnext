'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react'
import { supabase } from '../supabase/client'
import { SupabaseAuthRepository } from '../repositories/supabase-auth-repository'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { AuthRepositoryFactory } from '../repositories/auth-repository-factory'

// Definir tipos para el contexto
export interface AppUser {
  id: string
  phone: string
  user_metadata: {
    phone: string
    identityNumber: string
    name: string
    lastName: string
    role?: string
  }
}

export interface AuthContextType {
  user: AppUser | null
  loading: boolean
  error: string | null
  isLoggedIn: boolean
  signIn: (phone: string, identityNumber: string) => Promise<void>
  signUp: (userData: {
    phone: string
    identityNumber: string
    identityType: string
    name: string
    lastName: string
    birthDate: string
    acceptTerms: boolean
    acceptMarketing: boolean
    acceptClubMembership: boolean
  }) => Promise<void>
  signOut: () => Promise<void>
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | null>(null)

// Hook para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

// Componente Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()
  
  // Instancia del repositorio de autenticación
  const authRepository = useMemo(() => {
    try {
      console.log('Inicializando authRepository a través del factory');
      return AuthRepositoryFactory.getRepository();
    } catch (error) {
      console.error('Error al inicializar el repositorio:', error);
      setError('Error al inicializar el sistema de autenticación');
      return null;
    }
  }, []);
  
  // Cargar sesión inicial
  useEffect(() => {
    // Obtener la sesión actual
    const checkSession = async () => {
      try {
        setLoading(true)
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }
        
        setSession(session)
        
        if (session?.user) {
          const appUser: AppUser = {
            id: session.user.id,
            phone: session.user.user_metadata?.phone || '',
            user_metadata: {
              phone: session.user.user_metadata?.phone || '',
              identityNumber: session.user.user_metadata?.identityNumber || '',
              name: session.user.user_metadata?.name || '',
              lastName: session.user.user_metadata?.lastName || '',
              role: session.user.user_metadata?.role || 'client'
            }
          }
          setUser(appUser)
        }
      } catch (err: any) {
        console.error('Error al verificar sesión:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    checkSession()
    
    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event)
      setSession(currentSession)
      
      if (currentSession?.user) {
        const appUser: AppUser = {
          id: currentSession.user.id,
          phone: currentSession.user.user_metadata?.phone || '',
          user_metadata: {
            phone: currentSession.user.user_metadata?.phone || '',
            identityNumber: currentSession.user.user_metadata?.identityNumber || '',
            name: currentSession.user.user_metadata?.name || '',
            lastName: currentSession.user.user_metadata?.lastName || '',
            role: currentSession.user.user_metadata?.role || 'client'
          }
        }
        setUser(appUser)
      } else {
        setUser(null)
      }
    })
    
    // Limpiar suscripción al desmontar
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  // Iniciar sesión
  const signIn = async (phone: string, identityNumber: string) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!authRepository) {
        throw new Error('El sistema de autenticación no está disponible en este momento');
      }
      
      const { user: authUser } = await authRepository.signIn({ phone, identityNumber })
      
      if (authUser) {
        const appUser: AppUser = {
          id: authUser.id,
          phone: authUser.phone || authUser.user_metadata?.phone || '',
          user_metadata: {
            phone: authUser.user_metadata?.phone || '',
            identityNumber: authUser.user_metadata?.identityNumber || '',
            name: authUser.user_metadata?.name || '',
            lastName: authUser.user_metadata?.lastName || '',
            role: authUser.user_metadata?.role || 'client'
          }
        }
        setUser(appUser)
        
        // Redirigir a la página de bienvenida después de iniciar sesión
        router.push('/welcome')
      }
    } catch (err: any) {
      console.error('Error en signIn:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  // Registrar nuevo usuario
  const signUp = async (userData: {
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
    try {
      setLoading(true);
      setError(null);
      
      if (!authRepository) {
        throw new Error('El sistema de autenticación no está disponible en este momento');
      }
      
      const { user: authUser } = await authRepository.signUp({
        phone: userData.phone,
        identityNumber: userData.identityNumber,
        identityType: userData.identityType,
        name: userData.name,
        lastName: userData.lastName,
        birthDate: userData.birthDate,
        acceptTerms: userData.acceptTerms,
        acceptMarketing: userData.acceptMarketing,
        acceptClubMembership: userData.acceptClubMembership,
      });
      
      if (authUser) {
        const appUser: AppUser = {
          id: authUser.id,
          phone: authUser.phone || authUser.user_metadata?.phone || '',
          user_metadata: {
            phone: authUser.user_metadata?.phone || '',
            identityNumber: authUser.user_metadata?.identityNumber || '',
            name: authUser.user_metadata?.name || '',
            lastName: authUser.user_metadata?.lastName || '',
            role: authUser.user_metadata?.role || 'client'
          }
        };
        setUser(appUser);
        
        // Redirigir a la página de bienvenida después de registrarse
        router.push('/welcome');
      }
    } catch (err: any) {
      console.error('Error en signUp:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Cerrar sesión
  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!authRepository) {
        throw new Error('El sistema de autenticación no está disponible en este momento');
      }
      
      await authRepository.signOut()
      setUser(null)
    } catch (err: any) {
      console.error('Error en signOut:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  // Proveer el contexto
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isLoggedIn: !!user,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
} 