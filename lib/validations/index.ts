import { z } from 'zod'

// ─── Project ──────────────────────────────────────────────────────────────────
export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(120, 'Name must be 120 characters or fewer'),
  description: z.string().max(1000, 'Description must be 1000 characters or fewer').nullable().optional(),
  status: z.enum(['active', 'on_hold', 'completed', 'archived']).default('active'),
  loe_unit: z.enum(['story_points', 'hours']).default('story_points'),
  sprint_length_days: z.number().int().min(1).max(90).default(14),
})

export type ProjectFormValues = z.infer<typeof projectSchema>

// ─── Epic ─────────────────────────────────────────────────────────────────────
export const epicSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  title: z.string().min(1, 'Epic title is required').max(200, 'Title must be 200 characters or fewer'),
  summary: z.string().max(2000, 'Summary must be 2000 characters or fewer').nullable().optional(),
  acceptance_criteria: z.string().max(5000, 'Acceptance criteria must be 5000 characters or fewer').nullable().optional(),
  executive_signoff_by: z.string().max(100).nullable().optional(),
  executive_signoff_date: z.string().nullable().optional(),
})

export type EpicFormValues = z.infer<typeof epicSchema>

// ─── User Story ───────────────────────────────────────────────────────────────
export const userStorySchema = z.object({
  epic_id: z.string().uuid('Invalid epic ID'),
  title: z.string().min(1, 'Story title is required').max(200, 'Title must be 200 characters or fewer'),
  as_a: z.string().min(1, '"As a" is required — who is this story for?').max(200),
  i_want: z.string().min(1, '"I want" is required — what does the user want to do?').max(500),
  so_that: z.string().min(1, '"So that" is required — what is the user goal?').max(500),
  acceptance_criteria: z.string().min(1, 'Acceptance criteria are required').max(5000),
  problem_statement: z.string().max(2000).nullable().optional(),
  additional_details: z.string().max(5000).nullable().optional(),
  client_comments: z.string().max(2000).nullable().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  loe: z.number().min(0, 'LOE must be non-negative').max(9999),
  original_loe: z.number().min(0).max(9999).nullable().optional(),
  is_post_signoff_addition: z.boolean().default(false),
  sprint_id: z.string().uuid().nullable().optional(),
  sme_approver_id: z.string().uuid().nullable().optional(),
  assigned_builder_id: z.string().uuid().nullable().optional(),
  status: z.enum(['backlog', 'ready', 'in_progress', 'review', 'done']).default('backlog'),
  percent_complete: z.number().int().min(0).max(100).default(0),
  signoff_status: z.enum(['pending', 'signed_off', 'rejected']).default('pending'),
  signoff_date: z.string().nullable().optional(),
})

export type UserStoryFormValues = z.infer<typeof userStorySchema>

// ─── Sprint ───────────────────────────────────────────────────────────────────
export const sprintSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  name: z.string().min(1, 'Sprint name is required').max(100),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return new Date(data.end_date) > new Date(data.start_date)
  }
  return true
}, {
  message: 'End date must be after start date',
  path: ['end_date'],
})

export type SprintFormValues = z.infer<typeof sprintSchema>

// ─── Decision ─────────────────────────────────────────────────────────────────
export const decisionSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  type: z.enum(['outstanding', 'key_design']),
  title: z.string().min(1, 'Decision title is required').max(200),
  description: z.string().max(2000).nullable().optional(),
  owner: z.string().max(100).nullable().optional(),
  due_date: z.string().nullable().optional(),
  status: z.enum(['open', 'resolved', 'deferred']).default('open'),
})

export type DecisionFormValues = z.infer<typeof decisionSchema>

// ─── Risk ─────────────────────────────────────────────────────────────────────
export const riskSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  description: z.string().min(1, 'Risk description is required').max(1000),
  likelihood: z.number().int().min(1, 'Likelihood must be 1–5').max(5, 'Likelihood must be 1–5'),
  impact: z.number().int().min(1, 'Impact must be 1–5').max(5, 'Impact must be 1–5'),
  mitigation: z.string().max(2000).nullable().optional(),
  owner: z.string().max(100).nullable().optional(),
  status: z.enum(['open', 'mitigated', 'closed']).default('open'),
})

export type RiskFormValues = z.infer<typeof riskSchema>

// ─── Feedback ─────────────────────────────────────────────────────────────────
export const feedbackSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  source: z.string().max(200).nullable().optional(),
  description: z.string().min(1, 'Feedback description is required').max(2000),
  status: z.enum(['open', 'in_review', 'resolved', 'closed']).default('open'),
  logged_at: z.string().min(1, 'Logged date is required'),
})

export type FeedbackFormValues = z.infer<typeof feedbackSchema>

// ─── Weekly Report ────────────────────────────────────────────────────────────
export const weeklyReportSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  week_ending: z.string().min(1, 'Week ending date is required'),
  key_activities: z.string().max(5000).nullable().optional(),
  upcoming_activities: z.string().max(5000).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
})

export type WeeklyReportFormValues = z.infer<typeof weeklyReportSchema>

// ─── Time Tracking ────────────────────────────────────────────────────────────
export const timeTrackingSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  person_id: z.string().uuid('Invalid person ID'),
  week_ending: z.string().min(1, 'Week ending date is required'),
  estimated_hours: z.number().min(0, 'Hours must be non-negative').max(168, 'Cannot exceed 168 hours/week'),
  actual_hours: z.number().min(0, 'Hours must be non-negative').max(168, 'Cannot exceed 168 hours/week'),
})

export type TimeTrackingFormValues = z.infer<typeof timeTrackingSchema>

// ─── Auth schemas ─────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1, 'Full name is required').max(120),
})

export type SignupFormValues = z.infer<typeof signupSchema>
