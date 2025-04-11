import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultSupabase } from '../supabase/client';

export interface ClientExercise {
  id: string;
  client_id: string;
  trainer_id: string;
  exercise_name: string;
  description: string;
  sets: number;
  reps: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export class ClientExercisesRepository {
  private supabase: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || defaultSupabase;
  }

  async getClientExercises(clientId: string): Promise<ClientExercise[]> {
    const { data, error } = await this.supabase
      .from('client_exercises')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async assignExercise(exercise: Omit<ClientExercise, 'id' | 'created_at' | 'updated_at'>): Promise<ClientExercise> {
    const { data, error } = await this.supabase
      .from('client_exercises')
      .insert([exercise])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeExercise(exerciseId: string): Promise<void> {
    const { error } = await this.supabase
      .from('client_exercises')
      .delete()
      .eq('id', exerciseId);

    if (error) throw error;
  }

  async updateExercise(exerciseId: string, updates: Partial<ClientExercise>): Promise<ClientExercise> {
    const { data, error } = await this.supabase
      .from('client_exercises')
      .update(updates)
      .eq('id', exerciseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getTrainerClients(trainerId: string): Promise<{ id: string; name: string; last_name: string }[]> {
    const { data, error } = await this.supabase
      .from('members')
      .select('id, name, last_name')
      .eq('trainer_id', trainerId)
      .eq('role_name', 'client');

    if (error) throw error;
    return data || [];
  }
} 