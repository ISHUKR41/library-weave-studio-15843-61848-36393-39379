export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      // BGMI Tournament Registrations Table
      bgmi_registrations: {
        Row: {
          id: string
          tournament_type: 'solo' | 'duo' | 'squad'
          team_name: string | null
          team_leader_name: string
          team_leader_id: string
          team_leader_whatsapp: string
          player2_name: string | null
          player2_id: string | null
          player3_name: string | null
          player3_id: string | null
          player4_name: string | null
          player4_id: string | null
          payment_screenshot_url: string
          transaction_id: string
          status: 'pending' | 'approved' | 'rejected'
          slot_number: number | null
          youtube_streaming_vote: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tournament_type: 'solo' | 'duo' | 'squad'
          team_name?: string | null
          team_leader_name: string
          team_leader_id: string
          team_leader_whatsapp: string
          player2_name?: string | null
          player2_id?: string | null
          player3_name?: string | null
          player3_id?: string | null
          player4_name?: string | null
          player4_id?: string | null
          payment_screenshot_url: string
          transaction_id: string
          status?: 'pending' | 'approved' | 'rejected'
          slot_number?: number | null
          youtube_streaming_vote?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tournament_type?: 'solo' | 'duo' | 'squad'
          team_name?: string | null
          team_leader_name?: string
          team_leader_id?: string
          team_leader_whatsapp?: string
          player2_name?: string | null
          player2_id?: string | null
          player3_name?: string | null
          player3_id?: string | null
          player4_name?: string | null
          player4_id?: string | null
          payment_screenshot_url?: string
          transaction_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          slot_number?: number | null
          youtube_streaming_vote?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      // Free Fire Tournament Registrations Table
      freefire_registrations: {
        Row: {
          id: string
          tournament_type: 'solo' | 'duo' | 'squad'
          team_name: string | null
          team_leader_name: string
          team_leader_id: string
          team_leader_whatsapp: string
          player2_name: string | null
          player2_id: string | null
          player3_name: string | null
          player3_id: string | null
          player4_name: string | null
          player4_id: string | null
          payment_screenshot_url: string
          transaction_id: string
          status: 'pending' | 'approved' | 'rejected'
          slot_number: number | null
          youtube_streaming_vote: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tournament_type: 'solo' | 'duo' | 'squad'
          team_name?: string | null
          team_leader_name: string
          team_leader_id: string
          team_leader_whatsapp: string
          player2_name?: string | null
          player2_id?: string | null
          player3_name?: string | null
          player3_id?: string | null
          player4_name?: string | null
          player4_id?: string | null
          payment_screenshot_url: string
          transaction_id: string
          status?: 'pending' | 'approved' | 'rejected'
          slot_number?: number | null
          youtube_streaming_vote?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tournament_type?: 'solo' | 'duo' | 'squad'
          team_name?: string | null
          team_leader_name?: string
          team_leader_id?: string
          team_leader_whatsapp?: string
          player2_name?: string | null
          player2_id?: string | null
          player3_name?: string | null
          player3_id?: string | null
          player4_name?: string | null
          player4_id?: string | null
          payment_screenshot_url?: string
          transaction_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          slot_number?: number | null
          youtube_streaming_vote?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      // Admin Users Table
      admin_users: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
