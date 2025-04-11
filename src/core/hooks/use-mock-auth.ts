import { useState, useEffect } from 'react';

export const mockUser = {
  id: 'mock-user-id',
  role: 'admin',
  name: 'Admin',
  phone: '0414-1234567',
  user_metadata: {
    phone: '0414-1234567',
    identityNumber: '12345678',
    identityType: 'V',
    name: 'Admin',
    lastName: 'Test',
    role: 'admin',
    status: 'active'
  },
  app_metadata: {
    provider: 'phone',
    role: 'admin'
  }
};

export function useAuth() {
  const [user] = useState(mockUser);
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (phone: string, identityNumber: string) => {
    // Mock sign in
    return { user: mockUser };
  };

  const signUp = async (data: any) => {
    // Mock sign up
    return { user: mockUser };
  };

  const signOut = async () => {
    // Mock sign out
    return { error: null };
  };

  return { 
    user, 
    loading, 
    error,
    signIn,
    signUp,
    signOut,
    isLoading: loading 
  };
} 