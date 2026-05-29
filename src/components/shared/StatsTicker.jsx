export function StatsTicker({ items }) {
  return (
    <section aria-label="Performance statistics ticker" className="relative overflow-hidden border-y border-[var(--border)] bg-[#07090b] py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-[#050507] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-[#050507] to-transparent" />
      <div className="marquee-track flex w-max items-center gap-4 whitespace-nowrap px-4">
        {[...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`} className="text-sm text-[#b8b3b0]">
            {item}
            <span className="ml-4 text-[#3d3a39]">•</span>
          </span>
        ))}
      </div>
    </section>
  )
}
