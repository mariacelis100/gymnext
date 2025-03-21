'use client'

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/auth/auth-context';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phoneNumber: '0',
    identityNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn, loading } = useAuth();
  
  // Función para manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Función para manejar cambios específicos en el número de teléfono
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '' || value === '0') {
      setFormData({
        ...formData,
        phoneNumber: '0'
      });
    } else if (value.length <= 11 && value.startsWith('0')) {
      setFormData({
        ...formData,
        phoneNumber: value
      });
    } else if (value.length <= 10 && !value.startsWith('0')) {
      setFormData({
        ...formData,
        phoneNumber: '0' + value
      });
    }
  };
  
  // Valida el formato del teléfono venezolano (prefix + 7 dígitos)
  const isValidPhone = (phone: string): boolean => {
    return /^0\d{10}$/.test(phone);
  };
  
  // Mostrar mensaje de error de validación del teléfono
  const getPhoneErrorMessage = (phone: string): string => {
    if (!phone) return '';
    if (!isValidPhone(phone)) return 'El número de teléfono debe tener 11 dígitos y comenzar con cero (0)';
    return '';
  };
  
  // Obtener el número de teléfono completo
  const getFullPhone = (): string => {
    return formData.phoneNumber;
  };
  
  // Valida el formato de la cédula
  const isValidIdentityNumber = (): boolean => {
    return /^\d{7,8}$/.test(formData.identityNumber);
  };
  
  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    // Validaciones de formato
    if (!isValidPhone(getFullPhone())) {
      setError(getPhoneErrorMessage(getFullPhone()));
      return;
    }
    
    if (!isValidIdentityNumber()) {
      setError('El número de cédula debe tener entre 7 y 8 dígitos');
      return;
    }
    
    try {
      // Obtener el teléfono completo
      const phone = getFullPhone();
      console.log('Iniciando sesión con:', { phone, identityNumber: formData.identityNumber });
      
      await signIn(phone, formData.identityNumber);
      router.push('/dashboard'); // Redirigir al dashboard después de iniciar sesión
    } catch (err: any) {
      console.error('Error en inicio de sesión:', err);
      setError(err.message || 'Error al iniciar sesión');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A1A3F] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#0A1A3F]">Inicia Sesión</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handlePhoneNumberChange}
              className={`w-full px-3 py-2 border ${!formData.phoneNumber || isValidPhone(formData.phoneNumber) ? 'border-gray-300' : 'border-red-500'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B7FF] text-black`}
              placeholder="01234567890"
              disabled={loading}
              autoComplete="tel"
            />
            <p className="mt-1 text-xs text-gray-500">
              Formato: 11 dígitos (ej: 01234567890)
            </p>
            {formData.phoneNumber && !isValidPhone(formData.phoneNumber) && (
              <p className="text-xs text-red-500 mt-1">
                {getPhoneErrorMessage(formData.phoneNumber)}
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="identityNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Cédula
            </label>
            <div className="relative" style={{ zIndex: 90 }}>
              <input
                id="identityNumber"
                name="identityNumber"
                type={showPassword ? "text" : "password"}
                value={formData.identityNumber}
                onChange={(e) => setFormData({
                  ...formData,
                  identityNumber: e.target.value.replace(/\D/g, '').substring(0, 8)
                })}
                className={`w-full px-3 py-2 border ${!formData.identityNumber || isValidIdentityNumber() ? 'border-gray-300' : 'border-red-500'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B7FF] text-black`}
                style={{ position: 'relative', zIndex: 40 }}
                placeholder="12345678"
                disabled={loading}
                autoComplete="off"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-white px-1"
                style={{ zIndex: 45 }}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Debe tener entre 7 y 8 dígitos
            </p>
            {formData.identityNumber && !isValidIdentityNumber() && (
              <p className="mt-1 text-xs text-red-500">
                La cédula debe tener entre 7 y 8 dígitos
              </p>
            )}
          </div>
          
          <div className="mb-6 text-right">
            <Link 
              href="/recuperar-contrasena" 
              className="text-sm font-medium text-[#FF0000] hover:underline"
            >
              ¿Has olvidado tu contraseña?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={loading || !isValidPhone(getFullPhone()) || !isValidIdentityNumber()}
            className="w-full py-2 px-4 bg-[#00B7FF] text-white font-medium rounded-md hover:bg-[#0095D9] focus:outline-none focus:ring-2 focus:ring-[#00B7FF] focus:ring-opacity-50 disabled:bg-[#7DD8FF] disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Inicia Sesión'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Todavía no tienes una cuenta? <Link href="/register" className="font-medium text-[#0A1A3F] hover:underline">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 