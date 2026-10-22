export type Locale = 'vi' | 'en'

export type LocalizedText = Record<Locale, string>

export interface BlogPost {
  id?: string
  slug: string
  title: LocalizedText
  excerpt: LocalizedText
  content: LocalizedText
  tags: string[]
  published: boolean
  publishedAt?: string | null
  createdAt?: string
  updatedAt?: string
}
export type BlogSummary = Omit<BlogPost, 'content'>

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
