export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'admin' | 'pm' | 'builder' | 'sme_approver' | 'executive' | 'viewer'
export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'archived'
export type StoryStatus = 'backlog' | 'ready' | 'in_progress' | 'review' | 'done'
export type StoryPriority = 'low' | 'medium' | 'high' | 'critical'
export type SignoffStatus = 'pending' | 'signed_off' | 'rejected'
export type DecisionType = 'outstanding' | 'key_design'
export type DecisionStatus = 'open' | 'resolved' | 'deferred'
export type RiskStatus = 'open' | 'mitigated' | 'closed'
export type FeedbackStatus = 'open' | 'in_review' | 'resolved' | 'closed'
export type LoeUnit = 'story_points' | 'hours'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          theme_color: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: ProjectStatus
          loe_unit: LoeUnit
          sprint_length_days: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: UserRole
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['project_members']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['project_members']['Insert']>
      }
      end_users: {
        Row: {
          id: string
          project_id: string
          name: string
          email: string | null
          role: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['end_users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['end_users']['Insert']>
      }
      epics: {
        Row: {
          id: string
          project_id: string
          title: string
          summary: string | null
          acceptance_criteria: string | null
          executive_signoff_by: string | null
          executive_signoff_date: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['epics']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['epics']['Insert']>
      }
      sprints: {
        Row: {
          id: string
          project_id: string
          name: string
          start_date: string
          end_date: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['sprints']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['sprints']['Insert']>
      }
      user_stories: {
        Row: {
          id: string
          epic_id: string
          title: string
          as_a: string
          i_want: string
          so_that: string
          acceptance_criteria: string
          problem_statement: string | null
          additional_details: string | null
          client_comments: string | null
          priority: StoryPriority
          loe: number
          original_loe: number | null
          is_post_signoff_addition: boolean
          sprint_id: string | null
          sme_approver_id: string | null
          assigned_builder_id: string | null
          status: StoryStatus
          percent_complete: number
          signoff_status: SignoffStatus
          signoff_date: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_stories']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['user_stories']['Insert']>
      }
      story_history: {
        Row: {
          id: string
          story_id: string
          changed_at: string
          changed_by: string
          field: string
          old_value: string | null
          new_value: string | null
        }
        Insert: Omit<Database['public']['Tables']['story_history']['Row'], 'id' | 'changed_at'>
        Update: never
      }
      decisions: {
        Row: {
          id: string
          project_id: string
          type: DecisionType
          title: string
          description: string | null
          owner: string | null
          due_date: string | null
          status: DecisionStatus
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['decisions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['decisions']['Insert']>
      }
      risks: {
        Row: {
          id: string
          project_id: string
          description: string
          likelihood: number
          impact: number
          mitigation: string | null
          owner: string | null
          status: RiskStatus
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['risks']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['risks']['Insert']>
      }
      feedback: {
        Row: {
          id: string
          project_id: string
          source: string | null
          description: string
          status: FeedbackStatus
          logged_at: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['feedback']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['feedback']['Insert']>
      }
      weekly_reports: {
        Row: {
          id: string
          project_id: string
          week_ending: string
          key_activities: string | null
          upcoming_activities: string | null
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['weekly_reports']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['weekly_reports']['Insert']>
      }
      time_tracking: {
        Row: {
          id: string
          project_id: string
          person_id: string
          week_ending: string
          estimated_hours: number
          actual_hours: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['time_tracking']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['time_tracking']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
      project_status: ProjectStatus
      story_status: StoryStatus
      story_priority: StoryPriority
      signoff_status: SignoffStatus
      decision_type: DecisionType
      decision_status: DecisionStatus
      risk_status: RiskStatus
      feedback_status: FeedbackStatus
      loe_unit: LoeUnit
    }
  }
}
