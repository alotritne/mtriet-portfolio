import type { Project } from '../types'

// Keep the three primary case studies in the editorial sequence of the
// reference design, independent of the database's creation order.
function priority(project: Project) {
  const key = `${project.id} ${project.name}`.toLowerCase().replace(/[\s_-]/g, '')
  if (key.includes('smarthomebackend')) return 0
  if (key.includes('smarthomeandroid')) return 1
  if (key.includes('vsign')) return 2
  return 3
}

export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) =>
    priority(a) - priority(b) ||
    (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER),
  )
}
