import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Class-name helper the Componentry registry components import. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
