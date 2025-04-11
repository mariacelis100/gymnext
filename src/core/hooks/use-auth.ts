import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  role: string;
  name: string;
  phone: string;
  user_metadata: {
    phone: string;
    identityNumber: string;
    identityType: string;
    name: string;
    lastName: string;
    role: string;
    status: string;
  };
  app_metadata: {
    provider: string;
    role: string;
  };
}

function mapSupabaseUserToUser(supabaseUser: SupabaseUser): User {
  return {
    id: supabaseUser.id,
    role: supabaseUser.app_metadata.role || '',
    name: supabaseUser.user_metadata.name || '',
    phone: supabaseUser.user_metadata.phone || '',
    user_metadata: {
      phone: supabaseUser.user_metadata.phone || '',
      identityNumber: supabaseUser.user_metadata.identityNumber || '',
      identityType: supabaseUser.user_metadata.identityType || '',
      name: supabaseUser.user_metadata.name || '',
      lastName: supabaseUser.user_metadata.lastName || '',
      role: supabaseUser.user_metadata.role || '',
      status: supabaseUser.user_metadata.status || ''
    },
    app_metadata: {
      provider: supabaseUser.app_metadata.provider || '',
      role: supabaseUser.app_metadata.role || ''
    }
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapSupabaseUserToUser(session.user));
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUserToUser(session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
} 