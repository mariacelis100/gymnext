import { SupabaseClient } from '@supabase/supabase-js';
import { User, Session } from '@supabase/supabase-js';
import { AuthRepository } from './auth-repository';
import { supabase as defaultSupabase } from '../supabase/client';

export class SupabaseAuthRepository implements AuthRepository {
  private supabase: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    console.log('Inicializando SupabaseAuthRepository con cliente');
    
    // Si no se proporciona un cliente, usar el predeterminado
    if (!supabaseClient) {
      console.log('No se proporcionó cliente explícito, usando el cliente defaultSupabase');
      if (!defaultSupabase) {
        console.error('ERROR CRÍTICO: No se pudo obtener el cliente de Supabase predeterminado');
        throw new Error('Error de conexión con el servidor. El cliente de Supabase no está disponible.');
      }
      this.supabase = defaultSupabase;
    } else {
      this.supabase = supabaseClient;
    }
    
    // Verificar que el cliente esté inicializado correctamente
    if (!this.supabase) {
      console.error('ERROR CRÍTICO: El cliente de Supabase es undefined después de la inicialización');
      throw new Error('Error de conexión con el servidor. El cliente de Supabase no está disponible.');
    }
    
    console.log('SupabaseAuthRepository inicializado correctamente');
  }

  async signIn({
    phone,
    identityNumber
  }: {
    phone: string;
    identityNumber: string;
  }): Promise<{ user: User | null }> {
    try {
      console.log('Iniciando inicio de sesión con teléfono:', phone);
      
      if (!this.supabase) {
        console.error('Error: Cliente de Supabase no inicializado');
        throw new Error('Error de conexión con el servidor. Por favor, intenta de nuevo más tarde.');
      }
      
      // Validar datos
      this.validatePhone(phone);
      this.validateIdentityNumber(identityNumber);
      
      // Formatear el teléfono para asegurar formato correcto
      const formattedPhone = this.formatPhone(phone);
      
      // Usar la función SQL login_with_phone para evitar uso de email
      console.log('Usando función SQL login_with_phone para iniciar sesión sin email');
      
      const { data: loginData, error: loginError } = await this.supabase.rpc(
        'login_with_phone',
        {
          p_phone: formattedPhone,
          p_identity_number: identityNumber
        }
      );
      
      if (loginError) {
        console.error('Error en la función login_with_phone:', loginError);
        
        if (loginError.message?.includes('no encontrado')) {
          throw new Error('Usuario no encontrado. Verifica el número de teléfono y la cédula.');
        }
        
        throw new Error(`Error al iniciar sesión: ${loginError.message}. Por favor, intenta de nuevo.`);
      }
      
      if (!loginData || !loginData.user_id) {
        throw new Error('No se recibió información del usuario. Por favor, intenta de nuevo.');
      }
      
      console.log('Inicio de sesión exitoso con ID:', loginData.user_id);
      
      // Guardar manualmente la sesión en localStorage
      this.storeCustomSession(loginData);
      
      // Construir objeto de usuario para retornar
      const user = {
        id: loginData.user_id,
        phone: formattedPhone,
        user_metadata: {
          phone: formattedPhone,
          identityNumber: identityNumber,
          identityType: loginData.identity_type || 'V',
          name: loginData.name,
          lastName: loginData.last_name,
          role: loginData.role,
          status: loginData.status
        },
        app_metadata: {
          provider: 'phone',
          role: loginData.role
        }
      };
      
      return { user: user as any };
    } catch (error: any) {
      console.error('Error en signIn:', error);
      throw error;
    }
  }

  // Método para validar teléfono
  private validatePhone(phone: string): void {
    if (!phone || phone.trim() === '') {
      throw new Error('El número de teléfono es requerido');
    }
    
    // Limpiar el número de teléfono (quitar espacios, guiones, paréntesis)
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    
    // Verificar si el número tiene el formato correcto (comenzando con 04XX)
    if (!/^04\d{2}\d{7}$/.test(cleanPhone)) {
      // Verificar si el número tiene 10 dígitos y comienza con 4
      if (cleanPhone.length === 10 && cleanPhone.startsWith('4')) {
        // Esto está bien, podemos formatear después
        return;
      }
      
      // Verificar si el número tiene 11 dígitos y comienza con 04
      if (cleanPhone.length === 11 && cleanPhone.startsWith('04')) {
        // Esto está bien, podemos formatear después
        return;
      }
      
      throw new Error('El número de teléfono debe tener el formato 04XX-XXXXXXX');
    }
  }
  
  // Método para formatear teléfono
  private formatPhone(phone: string): string {
    if (!phone) return phone;
    
    // Limpiar el número de teléfono (quitar todos los caracteres no numéricos)
    let cleanPhone = phone.replace(/\D/g, '');
    
    // Si comienza con 4 sin el 0, agregar el 0
    if (cleanPhone.length === 10 && cleanPhone.startsWith('4')) {
      cleanPhone = '0' + cleanPhone;
    }
    
    // Si ya tiene el formato correcto con guión, devolverlo
    if (/^04\d{2}-\d{7}$/.test(phone)) {
      return phone;
    }
    
    // Verificar que tengamos 11 dígitos para un número venezolano
    if (cleanPhone.length === 11 && cleanPhone.startsWith('04')) {
      // Formatear como 04XX-XXXXXXX
      return cleanPhone.substring(0, 4) + '-' + cleanPhone.substring(4);
    }
    
    // Si no pudimos formatear correctamente, tratar de extraer lo más cercano a un número válido
    if (cleanPhone.length > 11 && cleanPhone.includes('04')) {
      // Buscar la posición donde comienza "04"
      const pos = cleanPhone.indexOf('04');
      if (pos >= 0 && pos + 11 <= cleanPhone.length) {
        const validPart = cleanPhone.substring(pos, pos + 11);
        return validPart.substring(0, 4) + '-' + validPart.substring(4);
      }
    }
    
    // Si el número es demasiado corto pero comienza con 04, podría ser una entrada parcial
    if (cleanPhone.length < 11 && cleanPhone.startsWith('04')) {
      // No aplicar guión todavía si no tenemos al menos 4 dígitos
      if (cleanPhone.length <= 4) return cleanPhone;
      
      // Aplicar el guión después del código de operadora
      return cleanPhone.substring(0, 4) + '-' + cleanPhone.substring(4);
    }
    
    // En último caso, devolver el original
    return phone;
  }
  
  // Método para validar cédula
  private validateIdentityNumber(identityNumber: string): void {
    if (!identityNumber || identityNumber.trim() === '') {
      throw new Error('El número de identidad es requerido');
    }
    
    // Cédula venezolana (máximo 8 dígitos)
    if (!/^\d{1,8}$/.test(identityNumber)) {
      throw new Error('El número de identidad debe contener máximo 8 dígitos');
    }
  }

  // Método para registrar un nuevo usuario directamente con miembros
  async signUp(userData: {
    phone: string;
    identityNumber: string;
    identityType: string;
    name: string;
    lastName: string;
    birthDate: string;
    acceptTerms: boolean;
    acceptMarketing: boolean;
    acceptClubMembership: boolean;
  }): Promise<{ user: User | null }> {
    try {
      console.log('Iniciando registro con datos:', { ...userData, identityNumber: 'XXXX' });
      
      // Verificar que supabase esté inicializado
      if (!this.supabase) {
        console.error('Error: Cliente de Supabase no inicializado');
        throw new Error('Error de conexión con el servidor. Por favor, intenta de nuevo más tarde.');
      }
      
      // Validar datos
      this.validatePhone(userData.phone);
      this.validateIdentityNumber(userData.identityNumber);
      
      if (!userData.name || userData.name.trim() === '') {
        throw new Error('El nombre es requerido');
      }
      
      if (!userData.lastName || userData.lastName.trim() === '') {
        throw new Error('El apellido es requerido');
      }
      
      if (!userData.acceptTerms) {
        throw new Error('Debes aceptar los términos y condiciones');
      }
      
      // Formatear el teléfono para asegurar formato correcto
      const formattedPhone = this.formatPhone(userData.phone);
      console.log('Teléfono formateado para registro:', formattedPhone);
      
      // USAR LA FUNCIÓN SQL PERSONALIZADA para evitar el uso de email
      console.log('Usando función SQL create_user_with_phone para registro sin email');
      
      const { data: registrationData, error: registrationError } = await this.supabase.rpc(
        'create_user_with_phone',
        {
          p_phone: formattedPhone,
          p_identity_number: userData.identityNumber,
          p_identity_type: userData.identityType,
          p_name: userData.name,
          p_last_name: userData.lastName,
          p_birth_date: userData.birthDate,
          p_marketing_consent: userData.acceptMarketing,
          p_club_member: userData.acceptClubMembership
        }
      );
      
      if (registrationError) {
        console.error('Error en la función create_user_with_phone:', registrationError);
        
        // Mostrar detalles del error
        console.error('Código de error:', registrationError.code);
        console.error('Mensaje de error:', registrationError.message);
        console.error('Detalles:', registrationError.details);
        
        // Manejar errores específicos
        if (registrationError.message?.includes('duplicate key')) {
          if (registrationError.message?.includes('phone')) {
            throw new Error('Ya existe un usuario con este número de teléfono.');
          } else if (registrationError.message?.includes('identity_number')) {
            throw new Error('Ya existe un usuario con este número de identidad.');
          }
        }
        
        throw new Error(`Error al registrar usuario: ${registrationError.message}. Por favor, intenta de nuevo.`);
      }
      
      if (!registrationData || !registrationData.user_id) {
        throw new Error('No se recibió información del usuario registrado. Por favor, intenta de nuevo.');
      }
      
      console.log('Usuario registrado correctamente con ID:', registrationData.user_id);
      
      // Guardar manualmente la sesión en localStorage
      this.storeCustomSession(registrationData);
      
      // Construir objeto de usuario para retornar
      const user = {
        id: registrationData.user_id,
        phone: formattedPhone,
        user_metadata: {
          phone: formattedPhone,
          identityNumber: userData.identityNumber,
          identityType: userData.identityType,
          name: userData.name,
          lastName: userData.lastName,
          role: 'client',
          status: 'active'
        },
        app_metadata: {
          provider: 'phone',
          role: 'client'
        }
      };
      
      return { user: user as any };
    } catch (error: any) {
      console.error('Error en signUp:', error);
      throw error;
    }
  }

  // Implementación de linkPhoneIdentity
  async linkPhoneIdentity({ phone, identityNumber, userId }: {
    phone: string,
    identityNumber: string,
    userId: string
  }): Promise<{ success: boolean }> {
    try {
      // Validar datos
      this.validatePhone(phone);
      this.validateIdentityNumber(identityNumber);
      
      // Formatear teléfono
      const formattedPhone = this.formatPhone(phone);
      
      // Actualizar miembro con el nuevo teléfono y cédula
      const { data, error } = await this.supabase
        .from('members')
        .update({
          phone: formattedPhone,
          identity_number: identityNumber
        })
        .eq('id', userId)
        .select();
        
      if (error) {
        console.error('Error al vincular identidad:', error);
        throw new Error('Error al vincular teléfono y cédula. Por favor, intenta de nuevo.');
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error en linkPhoneIdentity:', error);
      throw error;
    }
  }

  // Implementación de findUserByPhoneAndIdentity
  async findUserByPhoneAndIdentity({ phone, identityNumber }: {
    phone: string,
    identityNumber: string
  }): Promise<{ user: any | null }> {
    try {
      // Validar datos
      this.validatePhone(phone);
      this.validateIdentityNumber(identityNumber);
      
      // Formatear teléfono
      const formattedPhone = this.formatPhone(phone);
      
      // Buscar miembro por teléfono y cédula
      const { data, error } = await this.supabase
        .from('members')
        .select('*')
        .eq('phone', formattedPhone)
        .eq('identity_number', identityNumber)
        .maybeSingle();
        
      if (error) {
        console.error('Error al buscar usuario:', error);
        throw new Error('Error al verificar datos. Por favor, intenta de nuevo.');
      }
      
      return { user: data };
    } catch (error: any) {
      console.error('Error en findUserByPhoneAndIdentity:', error);
      throw error;
    }
  }

  // Implementación de signOut
  async signOut(): Promise<void> {
    try {
      // Eliminar sesión local
      try {
        localStorage.removeItem('gymnext_user_session');
        console.log('Sesión local eliminada');
      } catch (localError) {
        console.error('Error al eliminar sesión local:', localError);
      }
      
      // También cerrar sesión en Supabase (para compatibilidad)
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        console.error('Error al cerrar sesión en Supabase:', error);
        // No lanzar error si la sesión local se eliminó correctamente
      }
    } catch (error: any) {
      console.error('Error en signOut:', error);
      throw error;
    }
  }

  // Implementación de getSession
  async getSession(): Promise<{
    user: User | null;
  }> {
    try {
      // Intentar recuperar sesión de localStorage
      let localUser = null;
      
      try {
        const savedSession = localStorage.getItem('gymnext_user_session');
        if (savedSession) {
          const sessionData = JSON.parse(savedSession);
          
          // Verificar si la sesión ha expirado
          if (sessionData.expires_at && new Date(sessionData.expires_at) > new Date()) {
            console.log('Recuperando sesión local');
            
            // Construir objeto de usuario
            localUser = {
              id: sessionData.id,
              phone: sessionData.phone,
              user_metadata: {
                phone: sessionData.phone,
                identityNumber: sessionData.identity_number,
                name: sessionData.name,
                lastName: sessionData.last_name,
                role: sessionData.role
              },
              app_metadata: {
                provider: 'phone',
                role: sessionData.role
              }
            };
          } else {
            console.log('Sesión expirada, eliminando');
            localStorage.removeItem('gymnext_user_session');
          }
        }
      } catch (localError) {
        console.error('Error al recuperar sesión local:', localError);
        // Continuar con Supabase
      }
      
      // Si tenemos un usuario en localStorage, usarlo
      if (localUser) {
        return { user: localUser as any };
      }
      
      // De lo contrario, intentar con Supabase (para compatibilidad)
      const { data, error } = await this.supabase.auth.getSession();
      if (error) {
        console.error('Error al obtener sesión de Supabase:', error);
        return { user: null };
      }
      
      return { user: data.session?.user || null };
    } catch (error: any) {
      console.error('Error en getSession:', error);
      return { user: null };
    }
  }

  // Implementación de resetPassword
  async resetPassword(phone: string): Promise<void> {
    try {
      this.validatePhone(phone);
      
      // Aquí implementarías la lógica para resetear contraseña
      // Como estamos usando teléfono y cédula, probablemente querrías
      // actualizar la tabla members o enviar un código de verificación
      
      // Ejemplo simplificado:
      const { error } = await this.supabase.rpc('request_reset_password_for_phone', {
        p_phone: phone
      });
      
      if (error) {
        console.error('Error al solicitar restablecimiento de contraseña:', error);
        throw new Error('Error al solicitar restablecimiento. Por favor, intenta de nuevo.');
      }
    } catch (error: any) {
      console.error('Error en resetPassword:', error);
      throw error;
    }
  }

  // Método auxiliar para almacenar información de sesión
  private storeUserSession(memberData: any): void {
    // Guardar información de sesión en localStorage para mantener al usuario autenticado
    try {
      const sessionData = {
        id: memberData.id,
        phone: memberData.phone,
        identity_number: memberData.identity_number,
        name: memberData.name,
        last_name: memberData.last_name,
        role: memberData.role_name,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días
      };
      
      localStorage.setItem('gymnext_user_session', JSON.stringify(sessionData));
      console.log('Sesión almacenada localmente');
    } catch (error) {
      console.error('Error al almacenar sesión:', error);
      // No lanzar error, es solo para mantener persistencia
    }
  }

  // Método para almacenar una sesión personalizada
  private storeCustomSession(sessionData: any) {
    // Crear un objeto de sesión manual
    const session = {
      access_token: sessionData.session_token || `manual_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      refresh_token: `refresh_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      user: {
        id: sessionData.user_id,
        phone: sessionData.phone,
        user_metadata: {
          phone: sessionData.phone,
          identityNumber: sessionData.identity_number,
          identityType: sessionData.identity_type || 'V',
          name: sessionData.name,
          lastName: sessionData.last_name,
          role: sessionData.role || 'client',
          status: sessionData.status || 'active'
        },
        app_metadata: {
          provider: 'phone',
          role: sessionData.role || 'client'
        }
      }
    };
    
    // Guardar la sesión en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: session
      }));
      
      // También guardar en formato personalizado
      localStorage.setItem('gymnext.user.session', JSON.stringify(sessionData));
    }
  }
}