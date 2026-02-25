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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      allowances: {
        Row: {
          amount: number
          created_at: string
          id: number
          message: string | null
          promise_id: number | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: number
          message?: string | null
          promise_id?: number | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: number
          message?: string | null
          promise_id?: number | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "allowances_promise_id_fkey"
            columns: ["promise_id"]
            isOneToOne: false
            referencedRelation: "promises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allowances_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allowances_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_allowance_settings: {
        Row: {
          amount: number
          child_id: string
          created_at: string
          day: number
          enabled: boolean
          id: number
          last_sent_month: string | null
          parent_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          child_id: string
          created_at?: string
          day: number
          enabled?: boolean
          id?: never
          last_sent_month?: string | null
          parent_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          child_id?: string
          created_at?: string
          day?: number
          enabled?: boolean
          id?: never
          last_sent_month?: string | null
          parent_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "auto_allowance_settings_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_allowance_settings_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      family_relations: {
        Row: {
          child_id: string
          created_at: string
          parent_id: string
        }
        Insert: {
          child_id: string
          created_at?: string
          parent_id: string
        }
        Update: {
          child_id?: string
          created_at?: string
          parent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_relations_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_relations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nodam_badges: {
        Row: {
          badge_name: string
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          badge_name: string
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          badge_name?: string
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nodam_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nodam_history: {
        Row: {
          created_at: string
          fail_date: string
          id: number
          start_date: string
          success_days_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          fail_date: string
          id?: number
          start_date: string
          success_days_count: number
          user_id: string
        }
        Update: {
          created_at?: string
          fail_date?: string
          id?: number
          start_date?: string
          success_days_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nodam_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nodam_status: {
        Row: {
          created_at: string
          daily_smoke_cost: number
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_smoke_cost?: number
          start_date: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_smoke_cost?: number
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nodam_status_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auto_allowance_amount: number | null
          auto_allowance_day: number | null
          created_at: string
          id: string
          is_dukdam_active: boolean
          is_nodam_active: boolean
          monthly_budget: number
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          auto_allowance_amount?: number | null
          auto_allowance_day?: number | null
          created_at?: string
          id: string
          is_dukdam_active?: boolean
          is_nodam_active?: boolean
          monthly_budget?: number
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          auto_allowance_amount?: number | null
          auto_allowance_day?: number | null
          created_at?: string
          id?: string
          is_dukdam_active?: boolean
          is_nodam_active?: boolean
          monthly_budget?: number
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
      promises: {
        Row: {
          approved_at: string | null
          category: string
          child_id: string
          created_at: string
          due_date: string | null
          id: number
          message: string | null
          reward: number
          status: Database["public"]["Enums"]["promise_status"]
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          category?: string
          child_id: string
          created_at?: string
          due_date?: string | null
          id?: number
          message?: string | null
          reward?: number
          status?: Database["public"]["Enums"]["promise_status"]
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          category?: string
          child_id?: string
          created_at?: string
          due_date?: string | null
          id?: number
          message?: string | null
          reward?: number
          status?: Database["public"]["Enums"]["promise_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promises_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["transaction_category"]
          created_at: string
          end_date: string | null
          id: number
          is_fixed: boolean
          type: Database["public"]["Enums"]["tx_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["transaction_category"]
          created_at?: string
          end_date?: string | null
          id?: number
          is_fixed?: boolean
          type: Database["public"]["Enums"]["tx_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["transaction_category"]
          created_at?: string
          end_date?: string | null
          id?: number
          is_fixed?: boolean
          type?: Database["public"]["Enums"]["tx_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_promise: {
        Args: { p_parent_id: string; p_promise_id: number }
        Returns: undefined
      }
    }
    Enums: {
      promise_status:
        | "IN_PROGRESS"
        | "ACHIEVED"
        | "COMPLETED"
        | "PENDING_APPROVAL"
        | "FAILED"
        | "CANCELED"
        | "APPROVED"
      transaction_category:
        | "FOOD"
        | "CAFE"
        | "TRANSPORT"
        | "HOUSING"
        | "SHOPPING"
        | "MEDICAL"
        | "EDUCATION"
        | "LEISURE"
        | "ETC"
      tx_type: "IN" | "OUT"
      user_role: "PARENT" | "CHILD"
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
    Enums: {
      promise_status: [
        "IN_PROGRESS",
        "ACHIEVED",
        "COMPLETED",
        "PENDING_APPROVAL",
        "FAILED",
        "CANCELED",
        "APPROVED",
      ],
      transaction_category: [
        "FOOD",
        "CAFE",
        "TRANSPORT",
        "HOUSING",
        "SHOPPING",
        "MEDICAL",
        "EDUCATION",
        "LEISURE",
        "ETC",
      ],
      tx_type: ["IN", "OUT"],
      user_role: ["PARENT", "CHILD"],
    },
  },
} as const
