'use client'

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/hooks/use-mock-auth';

export default function RegisterPage() {
  const { signUp, loading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    identityType: 'V',
    identityNumber: '',
    birthDate: '',
    phone: '0',
    acceptTerms: false,
    acceptMarketing: false,
    acceptClubMembership: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  
  // Lista de prefijos de operadoras venezolanas
  const venezuelanPrefixes = ['0412', '0414', '0424', '0416', '0426'];
  
  // Función para manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Función para validar la mayoría de edad (18 años)
  const validateAge = (birthDate: string): boolean => {
    if (!birthDate) return false;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= 18;
  };
  
  // Valida el formato del teléfono (04XX-XXXXXXX)
  const isValidPhone = (): boolean => {
    // Primero verificamos si tiene el formato sin guión (11 dígitos)
    if (/^04\d{2}\d{7}$/.test(formData.phone)) {
      return true;
    }
    // Verificamos si tiene el formato con guión (04XX-XXXXXXX)
    if (/^04\d{2}-\d{7}$/.test(formData.phone)) {
      return true;
    }
    return false;
  };
  
  // Valida el formato de la cédula
  const isValidIdentityNumber = (): boolean => {
    return /^\d{7,8}$/.test(formData.identityNumber);
  };
  
  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validar formulario
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Por favor ingresa tu nombre';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Por favor ingresa tus apellidos';
    }
    
    if (!isValidIdentityNumber()) {
      newErrors.identityNumber = 'El número de documento debe tener entre 7 y 8 dígitos';
    }
    
    if (!formData.birthDate || !validateAge(formData.birthDate)) {
      newErrors.birthDate = 'Debes ser mayor de edad para registrarte';
    }
    
    if (!isValidPhone()) {
      newErrors.phone = 'El número de teléfono debe tener el formato 04XX-XXXXXXX';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar las condiciones sobre protección de datos y cookies';
    }
    
    if (Object.keys(newErrors).length === 0) {
      try {
        // Formatear el teléfono al formato 04XX-XXXXXXX
        let formattedPhone = formData.phone;
        
        // Si el teléfono no tiene guión, añadirlo
        if (!/^04\d{2}-\d{7}$/.test(formData.phone)) {
          const cleanPhone = formData.phone.replace(/\D/g, '');
          formattedPhone = cleanPhone.substring(0, 4) + '-' + cleanPhone.substring(4, 11);
        }
        
        const formattedData = {
          ...formData,
          phone: formattedPhone
        };
        
        console.log('Enviando datos:', formattedData);
        await signUp(formattedData);
        setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
        
        // Redirigir a la página de bienvenida después de un registro exitoso
        setTimeout(() => {
          router.push('/welcome');
        }, 2000);
      } catch (err: any) {
        console.error('Error al registrar:', err);
        setError(err.message || 'Error al registrarse');
      }
    } else {
      setErrors(newErrors);
    }
  };
  
  // Mostrar el teléfono con guión conforme se va escribiendo
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '').substring(0, 11);
    let formatted = input;
    
    // Si tenemos 4 o más dígitos, insertamos el guión después del cuarto dígito
    if (input.length >= 4) {
      formatted = input.substring(0, 4) + '-' + input.substring(4);
    }
    
    setFormData({
      ...formData,
      phone: formatted
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A1A3F] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#0A1A3F]">Crea tu cuenta</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B7FF] text-black"
              placeholder="Introduce tu nombre"
              disabled={loading}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B7FF] text-black"
              placeholder="Introduce tus apellidos"
              disabled={loading}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo y número de documento de identidad
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                id="identityType"
                name="identityType"
                value={formData.identityType}
                onChange={handleChange}
                className="col-span-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B7FF] appearance-auto text-black"
                disabled={loading}
              >
                <option value="V">V</option>
                <option value="E">E</option>
                <option value="J">J</option>
              </select>
              <input
                id="identityNumber"
                name="identityNumber"
                type="text"
                value={formData.identityNumber}
                onChange={(e) => setFormData({
                  ...formData,
                  identityNumber: e.target.value.replace(/\D/g, '').substring(0, 8)
                })}
                className={`col-span-2 px-3 py-2 border ${!formData.identityNumber || isValidIdentityNumber() ? 'border-gray-300' : 'border-red-500'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B7FF] text-black`}
                placeholder="12345678"
                disabled={loading}
                autoComplete="off"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              La cédula debe tener entre 7 y 8 dígitos
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de nacimiento (dd/mm/aaaa)
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B7FF] appearance-auto text-black"
              placeholder="dd/mm/aaaa"
              disabled={loading}
            />
            {formData.birthDate && !validateAge(formData.birthDate) && (
              <p className="text-xs text-red-500 mt-1">
                ⚠ Tienes que ser mayor de edad
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              className={`w-full px-3 py-2 border ${!formData.phone || formData.phone.length === 11 ? 'border-gray-300' : 'border-red-500'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B7FF] text-black`}
              placeholder="04XXXXXXXXX"
              disabled={loading}
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-gray-500">
              Formato: 04XX-XXXXXXX (ej: 0412-1234567)
            </p>
          </div>
          
          <div className="mb-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({
                    ...formData,
                    acceptTerms: e.target.checked
                  })}
                  className="w-4 h-4 border border-gray-300 rounded accent-[#00B7FF] focus:ring-2 focus:ring-[#00B7FF]"
                  disabled={loading}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="acceptTerms" className="text-gray-600">
                  Acepto las condiciones sobre <span className="underline">protección de datos y cookies</span>.
                </label>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={
              loading || 
              !formData.name || 
              !formData.lastName || 
              !isValidPhone() || 
              !isValidIdentityNumber() || 
              !formData.birthDate || 
              !validateAge(formData.birthDate) || 
              !formData.acceptTerms
            }
            className="w-full py-3 px-4 bg-[#FF0000] text-white font-medium rounded-md hover:bg-[#D50000] focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-opacity-50 disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya eres cliente de COSMOS? <Link href="/login" className="font-medium text-[#0A1A3F] hover:underline">Inicia Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 