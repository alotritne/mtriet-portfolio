import { profile } from './data'
import type { SiteData } from './types'

export const defaultSite: SiteData = {
  name: profile.name,
  major: { ...profile.major },
  studentYear: profile.studentYear,
  gpa: profile.gpa,
  location: { ...profile.location },
  email: profile.email,
  github: profile.github,
  facebook: profile.facebook,
  website: profile.website,
  roles: [...profile.roles],
  // Keep the public portfolio and the admin's initial content in sync with the
  // four-column skill layout from the selected design.
  skills: [
    {
      key: 'languages',
      label: { vi: 'Ngôn ngữ', en: 'Languages' },
      items: ['JavaScript', 'TypeScript', 'Java', 'Kotlin', 'Python', 'C++'],
    },
    {
      key: 'webBackend',
      label: { vi: 'Web & Backend', en: 'Web & Backend' },
      items: ['React', 'Node.js', 'Express', 'Prisma', 'REST API', 'Vite'],
    },
    {
      key: 'dataMobile',
      label: { vi: 'Data & Mobile', en: 'Data & Mobile' },
      items: ['MySQL', 'MongoDB', 'Android', 'Jetpack Compose', 'MQTT'],
    },
    {
      key: 'workflow',
      label: { vi: 'Công cụ', en: 'Tools' },
      items: ['Git', 'GitHub', 'Docker (cơ bản)', 'Tailwind CSS'],
    },
  ],
}
