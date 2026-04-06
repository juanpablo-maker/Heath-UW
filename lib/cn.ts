import { twMerge } from "tailwind-merge";

/**
 * Merges class names and resolves Tailwind conflicts (e.g. `py-16` vs `py-20`).
 */
export function cn(...inputs: Array<string | undefined | null | false>): string {
  const parts = inputs.filter(Boolean) as string[];
  if (parts.length === 0) return "";
  return twMerge(...parts);
}
