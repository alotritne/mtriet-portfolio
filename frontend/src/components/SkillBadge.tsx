import { Code2, ShieldCheck, Network, Layers } from 'lucide-react'
import {
  siAndroid, siCplusplus, siDocker, siExpress, siGit, siGithub, siJavascript,
  siJetpackcompose, siKotlin, siMongodb, siMqtt, siMysql, siNodedotjs,
  siOpenjdk, siPrisma, siPython, siReact, siTailwindcss, siTypescript, siVite,
} from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'
import type { Locale } from '../types'
import { localizeSkillItem } from '../data'

const logos: Record<string, SimpleIcon> = {
  'C++': siCplusplus, Java: siOpenjdk, Kotlin: siKotlin, JavaScript: siJavascript,
  Python: siPython, TypeScript: siTypescript, React: siReact, Vite: siVite,
  TailwindCSS: siTailwindcss, 'Tailwind CSS': siTailwindcss, 'Node.js': siNodedotjs,
  Express: siExpress, Prisma: siPrisma, MySQL: siMysql, MongoDB: siMongodb,
  Android: siAndroid, 'Jetpack Compose': siJetpackcompose, MQTT: siMqtt,
  Git: siGit, GitHub: siGithub, Docker: siDocker,
}

export function TechnologyLogo({ name }: { name: string }) {
  const logo = logos[name]
  if (!logo) {
    const Icon = name === 'JWT Authentication' ? ShieldCheck : name === 'REST API' ? Network : name === 'MVVM' ? Layers : Code2
    return <Icon size={17} aria-hidden="true" />
  }
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={logo.path}/></svg>
}

export function SkillBadge({ name, locale }: { name: string; locale: Locale }) {
  return <span className="skill-badge"><TechnologyLogo name={name}/>{localizeSkillItem(name, locale)}</span>
}
