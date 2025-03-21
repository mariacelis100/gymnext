'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/auth/auth-context';

export default function RegisterForm() {
  const [phone, setPhone] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signUp, isLoading } = useAuth();
  const router = useRouter();

  // Función para dar formato al teléfono mientras se escribe
  const formatPhoneInput = (value: string) => {
    // Elimina cualquier carácter que no sea número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica formato según la longitud
    if (numbers.length <= 3) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else if (numbers.length <= 8) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)} ${numbers.slice(6, 8)} ${numbers.slice(8, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneInput(e.target.value));
  };

  const handleIdentityNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir números y limitar a 8 caracteres
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setIdentityNumber(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones básicas
    if (!phone || phone.length < 9) {
      setError('Por favor ingresa un número de teléfono válido');
      return;
    }

    if (!identityNumber || identityNumber.length < 7 || identityNumber.length > 8) {
      setError('El número de cédula debe tener 7 u 8 dígitos');
      return;
    }

    if (!name.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (!lastName.trim()) {
      setError('Por favor ingresa tu apellido');
      return;
    }

    try {
      await signUp(phone, identityNumber, name, lastName);
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      // Opcional: redirigir después de un registro exitoso
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
      
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
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Juan"
            className="w-full p-3 border rounded-md"
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="lastName" className="block mb-2 text-sm font-medium">
            Apellido
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Pérez"
            className="w-full p-3 border rounded-md"
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-2 text-sm font-medium">
            Número de Teléfono
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="(414) 123 45 67"
            className="w-full p-3 border rounded-md"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Formato: (414) 123 45 67
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="identityNumber" className="block mb-2 text-sm font-medium">
            Número de Cédula
          </label>
          <input
            id="identityNumber"
            type="text"
            value={identityNumber}
            onChange={handleIdentityNumberChange}
            placeholder="12345678"
            className="w-full p-3 border rounded-md"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            7 u 8 dígitos, sin puntos ni espacios
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
} 