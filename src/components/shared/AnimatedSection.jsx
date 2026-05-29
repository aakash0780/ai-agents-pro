import { motion as Motion } from 'framer-motion'

export function AnimatedSection({
  className = '',
  children,
  amount = 0.15,
  once = true,
}) {
  return (
    <Motion.section
      className={className}
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, staggerChildren: 0.1 }}
      viewport={{ once, amount }}
    >
      {children}
    </Motion.section>
  )
}
