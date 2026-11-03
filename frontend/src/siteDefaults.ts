import { getCopy, profile, skillGroups } from './data'
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
  skills: skillGroups.map(group => ({
    key: group.key,
    label: { vi: getCopy('vi').groupLabels[group.key], en: getCopy('en').groupLabels[group.key] },
    items: [...group.items],
  })),
}
