export function SectionLabel({ children, centered = false }) {
  return (
    <p
      className={`text-xs uppercase tracking-[0.24em] text-[#00d992] ${
        centered ? 'text-center' : ''
      }`}
    >
      {children}
    </p>
  )
}
