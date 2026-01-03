// utils/cn.ts
import { clsx, ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines Tailwind CSS classNames intelligently (conditional, dedupes, merges conflicts)
 * Usage: cn('p-4', isActive && 'bg-blue-500')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}
