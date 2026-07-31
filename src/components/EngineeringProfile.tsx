import type { ReturnTypeCopy } from '../utility-types'

export function EngineeringProfile({ copy }: { copy: ReturnTypeCopy }) {
  const rows = [
    { label: copy.domains, value: 'Full-stack / Backend / Mobile' },
    { label: copy.focus, value: copy.focusValue },
    { label: copy.technology, value: 'TypeScript · Node.js · Kotlin · React · MySQL' },
  ]
  return (
    <aside className="profile-panel" aria-label={copy.profile}>
      <div className="profile-head"><span>{copy.profile}</span></div>
      <div className="profile-body">
        {rows.map((row) => <div className="profile-row" key={row.label}><span>{row.label}</span><strong>{row.value}</strong></div>)}
      </div>
    </aside>
  )
}
