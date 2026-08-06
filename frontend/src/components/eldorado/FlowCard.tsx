type Props = { title: string; amount: string; formula: string; tone?: 'neutral' | 'bank' | 'crypto' }
export function FlowCard({ title, amount, formula, tone = 'neutral' }: Props) { return <article className={`eld-flow-card is-${tone}`}><span>{title}</span><strong>{amount}</strong><code>{formula}</code></article> }
