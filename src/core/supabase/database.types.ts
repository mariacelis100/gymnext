export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          phone: string | null
          name: string | null
          lastName: string | null
          identityNumber: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          phone?: string | null
          name?: string | null
          lastName?: string | null
          identityNumber?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          phone?: string | null
          name?: string | null
          lastName?: string | null
          identityNumber?: string | null
        }
      }
      // Puedes agregar más tablas aquí según necesites
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 