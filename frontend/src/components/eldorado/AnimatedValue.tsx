import { useEffect, useRef, useState } from 'react'

export function AnimatedValue({ value, formatter }: { value: number; formatter: (value: number) => string }) {
  const [display, setDisplay] = useState(value)
  const displayRef = useRef(value)
  useEffect(() => {
    const start = displayRef.current
    const delta = value - start
    const began = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min((now - began) / 280, 1)
      const next = start + delta * (1 - Math.pow(1 - progress, 3))
      displayRef.current = next
      setDisplay(next)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])
  return <>{formatter(display)}</>
}
