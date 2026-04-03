import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeParse<T>(value: string | null, defaultValue: T): T {
  if (!value || value === 'undefined') return defaultValue
  try {
    return JSON.parse(value) as T
  } catch (e) {
    console.error('Failed to parse JSON', e)
    return defaultValue
  }
}
