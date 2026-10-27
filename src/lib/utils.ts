import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** The resume lives in public/; replace that file to update it everywhere */
export const RESUME_URL = "/arpit-mishra-resume.pdf"
export const RESUME_FILENAME = "Arpit-Mishra-Resume.pdf"

/** Eased scroll to a section by id (easeInOutCubic, 800ms). Returns false if not found. */
export function smoothScrollTo(id: string, duration = 800) {
  const target = document.getElementById(id)
  if (!target) return false

  const startPosition = window.scrollY
  const distance = target.getBoundingClientRect().top + window.scrollY - startPosition
  const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  let start: number | null = null

  const step = (timestamp: number) => {
    if (start === null) start = timestamp
    const elapsed = timestamp - start
    window.scrollTo(0, startPosition + distance * easeInOutCubic(Math.min(elapsed / duration, 1)))
    if (elapsed < duration) window.requestAnimationFrame(step)
  }

  window.requestAnimationFrame(step)
  return true
}

export function formatTime(s: number) {
  if (!isFinite(s) || s < 0) return "0:00"
  const m = Math.floor(s / 60)
  const ss = Math.floor(s % 60)
  return `${m}:${ss.toString().padStart(2, "0")}`
}
