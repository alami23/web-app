import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeParse<T>(value: string | null, defaultValue: T): T {
  if (!value) return defaultValue
  const trimmed = value.trim()
  if (trimmed === 'undefined' || trimmed === '') return defaultValue
  try {
    return JSON.parse(trimmed) as T
  } catch (e) {
    console.error('Failed to parse JSON', e)
    return defaultValue
  }
}
