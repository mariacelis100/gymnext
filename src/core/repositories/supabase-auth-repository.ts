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
      // Validar teléfono y cédula
      this.validatePhone(phone);
      this.validateIdentityNumber(identityNumber);
      
      // Formatear el teléfono para asegurar formato correcto
      const formattedPhone = this.formatPhone(phone);
      console.log('Teléfono formateado para login:', formattedPhone);
      
      console.log(`Intentando iniciar sesión con teléfono: ${formattedPhone} y cédula: ${identityNumber}`);
      
      // Buscar usuario en la tabla members
      const { data: memberData, error: memberError } = await this.supabase
        .from('members')
        .select('id, phone, identity_number, identity_type, name, last_name, role_name, status')
        .eq('phone', formattedPhone)
        .eq('identity_number', identityNumber)
        .maybeSingle();
        
      if (memberError) {
        console.error('Error al buscar usuario en members:', memberError);
        throw new Error('Error al verificar credenciales. Por favor, intenta de nuevo.');
      }
      
      if (!memberData) {
        console.error(`No se encontró ningún usuario con teléfono: ${formattedPhone} y cédula: ${identityNumber}`);
        throw new Error('Teléfono o cédula incorrectos. Por favor, verifica tus datos.');
      }
      
      console.log('Usuario encontrado en members:', memberData.id);
      
      // Verificar que el usuario exista también en auth.users
      // pero solo para fines de integridad referencial
      try {
        const { data: validationData, error: validationError } = await this.supabase.rpc('create_session_for_phone', {
          p_phone: formattedPhone,
          p_identity_number: identityNumber
        });
        
        if (validationError) {
          console.error('Error en validación:', validationError);
          // Si hay un error específico sobre usuario no existente en auth.users, manejarlo
          if (validationError.message?.includes('auth.users')) {
            throw new Error('La cuenta existe pero no está configurada correctamente. Por favor, contacta a soporte.');
          }
          throw new Error(`Error de autenticación: ${validationError.message}`);
        }
        
        console.log('Validación exitosa, ID de usuario:', validationData.user_id);
        
        // Crear una sesión personalizada directamente en el almacenamiento local
        // sin usar signInWithPassword ni auth.sign
        this.storeUserSession(memberData);
        
      } catch (validationError: any) {
        console.error('Error en validación del usuario:', validationError);
        
        // Si el error no es sobre usuario en auth.users, propagarlo
        if (!validationError.message?.includes('auth.users')) {
          throw validationError;
        }
        
        // De lo contrario, aún podemos intentar crear una sesión manual
        this.storeUserSession(memberData);
      }
      
      // Construir un objeto de usuario manual con toda la información necesaria
      const manualUser = {
        id: memberData.id,
        phone: formattedPhone,
        user_metadata: {
          phone: formattedPhone,
          identityNumber: memberData.identity_number,
          identityType: memberData.identity_type || 'V',
          name: memberData.name,
          lastName: memberData.last_name,
          role: memberData.role_name,
          status: memberData.status
        },
        app_metadata: {
          provider: 'phone',
          role: memberData.role_name
        }
      };
      
      return { 
        user: manualUser as any
      };
      
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
      
      // 1. Verificar si ya existe un usuario con ese teléfono o cédula
      const { data: existingMember, error: checkError } = await this.supabase
        .from('members')
        .select('id, phone, identity_number')
        .or(`phone.eq.${formattedPhone},identity_number.eq.${userData.identityNumber}`)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error al verificar usuario existente:', checkError);
        // Continuar, asumiendo que no existe
      } else if (existingMember) {
        if (existingMember.phone === formattedPhone) {
          throw new Error('Ya existe un usuario con este número de teléfono.');
        } else if (existingMember.identity_number === userData.identityNumber) {
          throw new Error('Ya existe un usuario con este número de identidad.');
        }
        throw new Error('Ya existe un usuario con estos datos.');
      }
      
      // 2. Llamar a la función create_user_with_phone para crear el registro
      console.log('Usando función create_user_with_phone para crear usuario con integridad referencial');
      
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
      
      // 3. Obtener datos del usuario recién creado
      const { data: memberData, error: memberError } = await this.supabase
        .from('members')
        .select('*')
        .eq('id', registrationData.user_id)
        .single();
        
      if (memberError) {
        console.error('Error al obtener datos del miembro recién creado:', memberError);
        // No lanzar error, podemos continuar con los datos que tenemos
      }
      
      // 4. Crear sesión local y construir objeto de usuario
      if (memberData) {
        // Guardar sesión
        this.storeUserSession(memberData);
      }
      
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
}