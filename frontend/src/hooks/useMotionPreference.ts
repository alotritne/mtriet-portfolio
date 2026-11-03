import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'mtriet-portfolio-motion'
const CHANGE_EVENT = 'mtriet-portfolio-motion-change'

export function motionIsEnabled() {
  try { return window.localStorage.getItem(STORAGE_KEY) !== 'off' } catch { return true }
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

export function useMotionEnabled() {
  return useSyncExternalStore(subscribe, motionIsEnabled, () => true)
}

export function setMotionEnabled(enabled: boolean) {
  document.documentElement.dataset.motion = enabled ? 'on' : 'off'
  try { window.localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off') } catch { /* private browsing */ }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}
