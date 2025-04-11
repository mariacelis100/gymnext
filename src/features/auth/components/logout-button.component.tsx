'use client'

import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/hooks/use-mock-auth';

export default function LogoutButton({ className = '' }: { className?: string }) {
  const { signOut, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 ${className}`}
    >
      {isLoading ? 'Saliendo...' : 'Cerrar Sesión'}
    </button>
  );
} 