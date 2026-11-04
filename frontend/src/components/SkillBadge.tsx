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

// A distinct, legible tint for each technology on the dark portfolio surface.
const logoColors: Record<string, string> = {
  'C++': '#8AB8F2', Java: '#F29673', Kotlin: '#C4A6FF', JavaScript: '#F7DF1E',
  Python: '#FFD568', TypeScript: '#78BEFA', React: '#61DAFB', Vite: '#BDA7FF',
  TailwindCSS: '#67D7EC', 'Tailwind CSS': '#67D7EC', 'Node.js': '#8BD482',
  Express: '#E2F3E9', Prisma: '#A8CBD9', MySQL: '#7DBDE0', MongoDB: '#74D58A',
  Android: '#3DDC84', 'Jetpack Compose': '#9DCBFF', MQTT: '#CEADFF',
  Git: '#F9886B', GitHub: '#E2F3E9', Docker: '#69B8FF',
}

export function TechnologyLogo({ name }: { name: string }) {
  const logo = logos[name]
  if (!logo) {
    const Icon = name === 'JWT Authentication' ? ShieldCheck : name === 'REST API' ? Network : name === 'MVVM' ? Layers : Code2
    return <Icon size={17} aria-hidden="true" />
  }
  return <svg data-tech-logo="true" style={{ color: logoColors[name] ?? `#${logo.hex}` }} width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={logo.path}/></svg>
}

export function SkillBadge({ name, locale }: { name: string; locale: Locale }) {
  return <span className="skill-badge"><TechnologyLogo name={name}/>{localizeSkillItem(name, locale)}</span>
}
