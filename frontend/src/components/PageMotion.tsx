import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import type { ReactNode } from 'react'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 180, damping: 35, restDelta: 0.001 })
  const reduced = useReducedMotion()
  return <motion.div className="reading-progress" style={{ scaleX: reduced ? scrollYProgress : smooth }} aria-hidden="true" />
}

// Content is readable before the observer fires, including keyboard navigation.
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={false} whileInView={reduced ? undefined : { y: [20, 0], opacity: [0.65, 1] }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
}
