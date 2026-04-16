import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns a Tailwind text-color class based on a proficiency score (0–100).
 * 0–40  → neutral slate   ("building foundation")
 * 40–70 → sky blue        ("making progress")
 * 70–85 → navy blue       ("proficient")
 * 85+   → emerald green   ("mastered")
 */
export function getProficiencyColor(score: number): string {
  if (score >= 85) return 'text-emerald-500'
  if (score >= 70) return 'text-blue-600'
  if (score >= 40) return 'text-sky-500'
  return 'text-slate-400'
}
