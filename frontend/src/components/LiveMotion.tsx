import { TechnologyLogo } from './SkillBadge'
import { setMotionEnabled, useMotionEnabled } from '../hooks/useMotionPreference'

export function TechMarquee({ technologies }: { technologies: string[] }) {
  const unique = [...new Set(technologies)]
  if (!unique.length) return null
  const items = Array.from({ length: Math.max(1, Math.ceil(12 / unique.length)) }, () => unique).flat()
  return <div className="live-tech-marquee" aria-label={`Công nghệ: ${unique.join(', ')}`}>
    <div className="live-tech-track" aria-hidden="true">
      {[0, 1].map(copy => <div className="live-tech-group" key={copy}>{items.map((item, i) => <span className="live-tech-item" key={`${copy}-${i}`}><TechnologyLogo name={item}/>{item}<i aria-hidden="true">·</i></span>)}</div>)}
    </div>
  </div>
}

export function MorphingLoop() {
  return <div className="live-morph-scene" aria-hidden="true"><div className="live-morph-guide"/><div className="live-morph-ring"><div className="live-morph-core"/></div><span className="live-morph-spark"/></div>
}

export function MotionSwitch({ locale }: { locale: 'vi' | 'en' }) {
  const enabled = useMotionEnabled()
  return <button type="button" className="live-motion-switch" aria-pressed={enabled} onClick={() => setMotionEnabled(!enabled)}>
    <span aria-hidden="true">◉</span> {locale === 'vi' ? `Hiệu ứng: ${enabled ? 'Bật' : 'Tắt'}` : `Motion: ${enabled ? 'On' : 'Off'}`}
  </button>
}
