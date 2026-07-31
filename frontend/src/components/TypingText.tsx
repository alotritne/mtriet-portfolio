import { useEffect, useMemo, useState } from 'react'
import { useReducedMotion } from 'motion/react'

type Phase = 'typing' | 'holding' | 'deleting'

export function TypingText({ texts }: { texts: readonly string[] }) {
  const reduceMotion = useReducedMotion()
  const [textIndex, setTextIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(0)
  const [phase, setPhase] = useState<Phase>('typing')
  const currentText = texts[textIndex] ?? ''
  const characters = useMemo(() => Array.from(currentText), [currentText])

  useEffect(() => {
    if (reduceMotion) return

    let delay = 52
    if (phase === 'typing' && visibleCount >= characters.length) delay = 1250
    if (phase === 'holding') delay = 80
    if (phase === 'deleting') delay = 28

    const timer = setTimeout(() => {
      if (phase === 'typing') {
        if (visibleCount < characters.length) setVisibleCount(count => count + 1)
        else setPhase('holding')
        return
      }

      if (phase === 'holding') {
        setPhase('deleting')
        return
      }

      if (visibleCount > 0) {
        setVisibleCount(count => count - 1)
      } else {
        setTextIndex(index => (index + 1) % texts.length)
        setPhase('typing')
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [characters.length, phase, reduceMotion, texts.length, visibleCount])

  if (reduceMotion) return <span>{texts[0]}</span>

  return (
    <span className="typing-text" aria-label={texts.join(', ')}>
      <span aria-hidden="true">{characters.slice(0, visibleCount).join('')}</span>
      <i aria-hidden="true" />
    </span>
  )
}
