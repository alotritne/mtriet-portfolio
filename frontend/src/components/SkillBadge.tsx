import { Braces, Code2, Coffee, Database, FileCode2, GitBranch, Layers, Network, Radio, Server, ShieldCheck, Smartphone, Wind, Container, Atom, Triangle } from 'lucide-react'
import type { Locale } from '../types'
import { localizeSkillItem } from '../data'

const icons: Record<string, typeof Code2> = {
  'C++': Braces, Java: Coffee, Kotlin: Code2, JavaScript: FileCode2, Python: Code2, TypeScript: FileCode2,
  React: Atom, Vite: Triangle, TailwindCSS: Wind, 'Node.js': Server, Express: Network, Prisma: Layers,
  MySQL: Database, MongoDB: Database, Android: Smartphone, 'Jetpack Compose': Layers,
  MQTT: Radio, Git: GitBranch, GitHub: GitBranch, 'Git & GitHub': GitBranch, 'REST API': Network,
  'JWT Authentication': ShieldCheck,
}
export function SkillBadge({ name, locale }: { name: string; locale: Locale }) {
  const Icon = name.startsWith('Docker') ? Container : icons[name] || Code2
  return <span className="skill-badge"><Icon aria-hidden="true" size={17} />{localizeSkillItem(name, locale)}</span>
}
