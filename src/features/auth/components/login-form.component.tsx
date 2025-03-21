'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/auth/auth-context';

export default function LoginForm() {
  const [phone, setPhone] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [error, setError] = useState('');
  const { signIn, loading } = useAuth();
  const router = useRouter();

  // Función para dar formato al teléfono mientras se escribe
  const formatPhoneInput = (value: string) => {
    // Elimina cualquier carácter que no sea número
    const numbers = value.replace(/\D/g, '');
    
    // Si es un número de 10 dígitos que comienza con 4, añadir el 0 inicial
    let adjustedNumbers = numbers;
    if (numbers.length === 10 && numbers.startsWith('4')) {
      adjustedNumbers = '0' + numbers;
    }
    
    // Aplica formato según la longitud (formato 04XX-XXXXXXX)
    if (adjustedNumbers.length <= 4) {
      // Devolver solo los primeros 4 dígitos (o menos)
      return adjustedNumbers;
    } else {
      // Añadir guión después de los primeros 4 dígitos
      return `${adjustedNumbers.slice(0, 4)}-${adjustedNumbers.slice(4, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneInput(e.target.value);
    setPhone(formattedValue);
  };

  const handleIdentityNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir números y limitar a 8 caracteres
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setIdentityNumber(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!phone || phone.length < 9) {
      setError('Por favor ingresa un número de teléfono válido');
      return;
    }

    if (!identityNumber || identityNumber.length < 7 || identityNumber.length > 8) {
      setError('El número de cédula debe tener 7 u 8 dígitos');
      return;
    }

    try {
      await signIn(phone, identityNumber);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-2 text-sm font-medium">
            Número de Teléfono
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="0412-1234567"
            className="w-full p-3 border rounded-md"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Formato: 04XX-XXXXXXX (ej. 0412-1234567)
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
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            7 u 8 dígitos, sin puntos ni espacios
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
} 