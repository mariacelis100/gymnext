import { User } from "@supabase/supabase-js";

// Interfaz del repositorio de autenticación
export interface AuthRepository {
  // Para iniciar sesión con número de teléfono y cédula
  signIn(credentials: { phone: string; identityNumber: string }): Promise<{ user: User | null }>;
  
  // Para registrar un nuevo usuario
  signUp(userData: {
    phone: string;
    identityNumber: string;
    identityType: string;
    name: string;
    lastName: string;
    birthDate: string;
    acceptTerms: boolean;
    acceptMarketing: boolean;
    acceptClubMembership: boolean;
  }): Promise<{ user: User | null }>;
  
  // Método para vincular identidad por teléfono y cédula
  linkPhoneIdentity({ phone, identityNumber, userId }: {
    phone: string,
    identityNumber: string,
    userId: string
  }): Promise<{ success: boolean }>;
  
  // Método para buscar usuario por teléfono y cédula
  findUserByPhoneAndIdentity({ phone, identityNumber }: {
    phone: string,
    identityNumber: string
  }): Promise<{ user: any | null }>;
  
  // Para cerrar sesión
  signOut(): Promise<void>;
  
  // Para obtener la sesión actual
  getSession(): Promise<{
    user: User | null;
  }>;
  
  // Para recuperar contraseña
  resetPassword(phone: string): Promise<void>;
} 