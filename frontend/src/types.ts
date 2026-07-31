export type Locale = 'vi' | 'en'

export type LocalizedText = Record<Locale, string>

export interface Project {
  id: string
  databaseId?: string
  slug?: string
  name: string
  problem: LocalizedText
  approach: LocalizedText
  features: LocalizedText[]
  stack: string[]
  repository?: string
  featured?: boolean
  published?: boolean
  position?: number
}
