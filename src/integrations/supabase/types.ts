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
      cupping_evaluations: {
        Row: {
          acidity: number | null
          aftertaste: number | null
          balance: number | null
          body: number | null
          clean_cup: number | null
          created_at: string | null
          cupping_session_id: string
          defects: number | null
          flavor: number | null
          fragrance_aroma: number | null
          id: string
          notes: string | null
          overall: number | null
          roast_profile_id: string | null
          sample_name: string
          sweetness: number | null
          total_score: number | null
          uniformity: number | null
          updated_at: string | null
        }
        Insert: {
          acidity?: number | null
          aftertaste?: number | null
          balance?: number | null
          body?: number | null
          clean_cup?: number | null
          created_at?: string | null
          cupping_session_id: string
          defects?: number | null
          flavor?: number | null
          fragrance_aroma?: number | null
          id?: string
          notes?: string | null
          overall?: number | null
          roast_profile_id?: string | null
          sample_name: string
          sweetness?: number | null
          total_score?: number | null
          uniformity?: number | null
          updated_at?: string | null
        }
        Update: {
          acidity?: number | null
          aftertaste?: number | null
          balance?: number | null
          body?: number | null
          clean_cup?: number | null
          created_at?: string | null
          cupping_session_id?: string
          defects?: number | null
          flavor?: number | null
          fragrance_aroma?: number | null
          id?: string
          notes?: string | null
          overall?: number | null
          roast_profile_id?: string | null
          sample_name?: string
          sweetness?: number | null
          total_score?: number | null
          uniformity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cupping_evaluations_cupping_session_id_fkey"
            columns: ["cupping_session_id"]
            isOneToOne: false
            referencedRelation: "cupping_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cupping_evaluations_roast_profile_id_fkey"
            columns: ["roast_profile_id"]
            isOneToOne: false
            referencedRelation: "roast_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cupping_sessions: {
        Row: {
          created_at: string | null
          cupper_name: string | null
          cupping_date: string | null
          id: string
          notes: string | null
          session_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          cupper_name?: string | null
          cupping_date?: string | null
          id?: string
          notes?: string | null
          session_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          cupper_name?: string | null
          cupping_date?: string | null
          id?: string
          notes?: string | null
          session_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      green_assessments: {
        Row: {
          assessment_date: string | null
          created_at: string | null
          defects_primary: number | null
          defects_secondary: number | null
          density: number | null
          grade: string | null
          id: string
          lot_number: string
          moisture_content: number | null
          notes: string | null
          origin: string
          process: string | null
          screen_size: string | null
          updated_at: string | null
          user_id: string
          variety: string | null
        }
        Insert: {
          assessment_date?: string | null
          created_at?: string | null
          defects_primary?: number | null
          defects_secondary?: number | null
          density?: number | null
          grade?: string | null
          id?: string
          lot_number: string
          moisture_content?: number | null
          notes?: string | null
          origin: string
          process?: string | null
          screen_size?: string | null
          updated_at?: string | null
          user_id: string
          variety?: string | null
        }
        Update: {
          assessment_date?: string | null
          created_at?: string | null
          defects_primary?: number | null
          defects_secondary?: number | null
          density?: number | null
          grade?: string | null
          id?: string
          lot_number?: string
          moisture_content?: number | null
          notes?: string | null
          origin?: string
          process?: string | null
          screen_size?: string | null
          updated_at?: string | null
          user_id?: string
          variety?: string | null
        }
        Relationships: []
      }
      roast_profiles: {
        Row: {
          batch_size: number | null
          charge_temp: number | null
          created_at: string | null
          development_time: number | null
          drop_temp: number | null
          first_crack_temp: number | null
          first_crack_time: number | null
          green_assessment_id: string | null
          id: string
          notes: string | null
          preheat_temp: number | null
          profile_name: string
          roast_level: string | null
          total_roast_time: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          batch_size?: number | null
          charge_temp?: number | null
          created_at?: string | null
          development_time?: number | null
          drop_temp?: number | null
          first_crack_temp?: number | null
          first_crack_time?: number | null
          green_assessment_id?: string | null
          id?: string
          notes?: string | null
          preheat_temp?: number | null
          profile_name: string
          roast_level?: string | null
          total_roast_time?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          batch_size?: number | null
          charge_temp?: number | null
          created_at?: string | null
          development_time?: number | null
          drop_temp?: number | null
          first_crack_temp?: number | null
          first_crack_time?: number | null
          green_assessment_id?: string | null
          id?: string
          notes?: string | null
          preheat_temp?: number | null
          profile_name?: string
          roast_level?: string | null
          total_roast_time?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roast_profiles_green_assessment_id_fkey"
            columns: ["green_assessment_id"]
            isOneToOne: false
            referencedRelation: "green_assessments"
            referencedColumns: ["id"]
          },
        ]
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
