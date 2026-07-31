import type { Project } from '../types'

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
let accessToken = ''
let csrfToken = ''
let refreshPromise: Promise<Admin> | null = null

type Admin = { email: string; role: 'admin' }
type AuthResponse = { accessToken: string; csrfToken: string; admin: Admin }

async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'Không thể hoàn tất yêu cầu')
  return body as T
}

async function getCsrf() {
  const response = await fetch(`${API_URL}/api/auth/csrf`, { credentials: 'include' })
  const body = await readJson<{ csrfToken: string }>(response)
  csrfToken = body.csrfToken
}

async function performRefresh() {
  if (!csrfToken) await getCsrf()
  const response = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST', credentials: 'include', headers: { 'X-CSRF-Token': csrfToken },
  })
  const body = await readJson<AuthResponse>(response)
  accessToken = body.accessToken
  csrfToken = body.csrfToken
  return body.admin
}

function refresh() {
  if (refreshPromise) return refreshPromise
  refreshPromise = performRefresh().finally(() => {
    refreshPromise = null
  })
  return refreshPromise
}

async function authorized<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init.headers, Authorization: `Bearer ${accessToken}` },
  })
  if (response.status === 401 && retry) {
    await refresh()
    return authorized<T>(path, init, false)
  }
  if (response.status === 204) return undefined as T
  return readJson<T>(response)
}

export const portfolioApi = {
  async publicProjects() {
    const response = await fetch(`${API_URL}/api/projects/public`)
    const body = await readJson<{ projects: Project[] }>(response)
    return body.projects.map(project => ({ ...project, databaseId: project.id, id: project.slug || project.id }))
  },
}

export const adminApi = {
  restore: refresh,
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
    })
    const body = await readJson<AuthResponse>(response)
    accessToken = body.accessToken
    csrfToken = body.csrfToken
    return body.admin
  },
  async logout() {
    if (!csrfToken) await getCsrf()
    await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include', headers: { 'X-CSRF-Token': csrfToken } })
    accessToken = ''
    csrfToken = ''
  },
  async projects() {
    const body = await authorized<{ projects: Project[] }>('/api/projects')
    return body.projects.map(project => ({ ...project, databaseId: project.id, id: project.slug || project.id }))
  },
  async save(project: Project) {
    const { databaseId } = project
    const payload: Partial<Project> = { ...project }
    delete payload.databaseId
    delete payload.id
    const path = databaseId ? `/api/projects/${databaseId}` : '/api/projects'
    const method = databaseId ? 'PUT' : 'POST'
    return authorized<{ project: Project }>(path, { method, body: JSON.stringify(payload) })
  },
  remove(databaseId: string) {
    return authorized<void>(`/api/projects/${databaseId}`, { method: 'DELETE' })
  },
}
