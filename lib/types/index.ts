import type { Database, UserRole } from './database.types'

// ─── Table Row convenience aliases ────────────────────────────────────────────
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectMember = Database['public']['Tables']['project_members']['Row']
export type EndUser = Database['public']['Tables']['end_users']['Row']
export type Epic = Database['public']['Tables']['epics']['Row']
export type Sprint = Database['public']['Tables']['sprints']['Row']
export type UserStory = Database['public']['Tables']['user_stories']['Row']
export type StoryHistory = Database['public']['Tables']['story_history']['Row']
export type Decision = Database['public']['Tables']['decisions']['Row']
export type Risk = Database['public']['Tables']['risks']['Row']
export type Feedback = Database['public']['Tables']['feedback']['Row']
export type WeeklyReport = Database['public']['Tables']['weekly_reports']['Row']
export type TimeTracking = Database['public']['Tables']['time_tracking']['Row']

// ─── Insert convenience aliases ───────────────────────────────────────────────
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectMemberInsert = Database['public']['Tables']['project_members']['Insert']
export type EndUserInsert = Database['public']['Tables']['end_users']['Insert']
export type EpicInsert = Database['public']['Tables']['epics']['Insert']
export type SprintInsert = Database['public']['Tables']['sprints']['Insert']
export type UserStoryInsert = Database['public']['Tables']['user_stories']['Insert']
export type DecisionInsert = Database['public']['Tables']['decisions']['Insert']
export type RiskInsert = Database['public']['Tables']['risks']['Insert']
export type FeedbackInsert = Database['public']['Tables']['feedback']['Insert']
export type WeeklyReportInsert = Database['public']['Tables']['weekly_reports']['Insert']
export type TimeTrackingInsert = Database['public']['Tables']['time_tracking']['Insert']

// ─── Update convenience aliases ───────────────────────────────────────────────
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']
export type EpicUpdate = Database['public']['Tables']['epics']['Update']
export type UserStoryUpdate = Database['public']['Tables']['user_stories']['Update']
export type DecisionUpdate = Database['public']['Tables']['decisions']['Update']
export type RiskUpdate = Database['public']['Tables']['risks']['Update']
export type FeedbackUpdate = Database['public']['Tables']['feedback']['Update']
export type WeeklyReportUpdate = Database['public']['Tables']['weekly_reports']['Update']
export type TimeTrackingUpdate = Database['public']['Tables']['time_tracking']['Update']

// ─── Domain enum re-exports ───────────────────────────────────────────────────
export type {
  UserRole,
  ProjectStatus,
  StoryStatus,
  StoryPriority,
  SignoffStatus,
  DecisionType,
  DecisionStatus,
  RiskStatus,
  FeedbackStatus,
  LoeUnit,
} from './database.types'

// ─── Composite / derived types ────────────────────────────────────────────────

/** Project row enriched with the requesting user's role. */
export type ProjectWithRole = Project & {
  userRole: UserRole
}

/** Epic enriched with its stories (used in list views). */
export type EpicWithStories = Epic & {
  user_stories: UserStory[]
}

/** Sprint enriched with its stories. */
export type SprintWithStories = Sprint & {
  user_stories: UserStory[]
}

/** Project member enriched with the linked profile (for display). */
export type ProjectMemberWithProfile = ProjectMember & {
  profile: Pick<Profile, 'id' | 'full_name' | 'email' | 'avatar_url'>
}

/** Kanban column type derived from StoryStatus. */
export interface KanbanColumn {
  id: UserStory['status']
  label: string
  stories: UserStory[]
}

/** Summary stats used in the dashboard. */
export interface ProjectStats {
  totalStories: number
  completedStories: number
  inProgressStories: number
  totalLoe: number
  completedLoe: number
  openRisks: number
  openDecisions: number
}
