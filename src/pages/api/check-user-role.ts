import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/core/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { phone, identityNumber } = req.body;

    if (!phone || !identityNumber) {
      return res.status(400).json({ message: 'Phone and identity number are required' });
    }

    // Consultar el usuario en la tabla de miembros
    const { data, error } = await supabase
      .from('members')
      .select('id, role_name')
      .eq('phone', phone)
      .eq('identity_number', identityNumber)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ message: 'Error checking user role', error: error.message });
    }

    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ 
      role: data.role_name,
      isAdmin: data.role_name === 'admin' || data.role_name === 'super_admin'
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
} 