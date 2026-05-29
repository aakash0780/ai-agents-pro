import { useMemo, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { INTEGRATIONS } from '@/constants/integrations'

export function IntegrationShowcase({
  title = 'Powered by an integration ecosystem your team already uses',
  description = 'Connect payments, CRM, analytics, communication, and automation tools into one AI operating layer.',
  className = '',
}) {
  const [sortKey, setSortKey] = useState('name')
  const [direction, setDirection] = useState('asc')

  const sortedRows = useMemo(() => {
    const cloned = [...INTEGRATIONS]
    cloned.sort((left, right) => {
      const a = String(left[sortKey] ?? '').toLowerCase()
      const b = String(right[sortKey] ?? '').toLowerCase()
      if (a === b) return 0
      const comparison = a > b ? 1 : -1
      return direction === 'asc' ? comparison : -comparison
    })
    return cloned
  }, [sortKey, direction])

  const toggleSort = (key) => {
    if (sortKey === key) {
      setDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setDirection('asc')
  }

  return (
    <section className={`relative overflow-hidden border-b border-[#3d3a39] py-16 md:py-24 ${className}`}>
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
        <span className="absolute left-[8%] top-12 h-px w-48 bg-gradient-to-r from-transparent via-[#00d992]/40 to-transparent" />
        <span className="absolute right-[12%] top-24 h-40 w-40 rounded-full border border-[#00d992]/10 shadow-[0_0_60px_rgba(0,217,146,0.08)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[14px] font-semibold uppercase tracking-[2.5px] text-[#00d992]">Works With</p>
          <h2 className="mt-5 font-[system-ui] text-[32px] leading-[1.11] tracking-[-0.9px] text-[#f2f2f2] sm:text-[36px]">
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 text-[#b8b3b0]">{description}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedRows.map((integration) => (
            <Link
              key={integration.slug}
              to={integration.link}
              className="group relative min-h-[176px] overflow-hidden rounded-lg border border-[#3d3a39] bg-[#101010] p-5 no-underline shadow-[rgba(0,0,0,0.4)_0_14px_30px] transition-[transform,box-shadow,border-color] duration-300 motion-safe:hover:-translate-y-1.5 motion-safe:hover:border-[#00d992]/35 motion-safe:hover:shadow-[0_20px_48px_-12px_rgba(0,217,146,0.2)]"
              aria-label={`${integration.name} integration`}
            >
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `radial-gradient(circle at 16% 14%, #${integration.color}2b, transparent 50%)` }}
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div
                  className="grid h-12 w-12 place-items-center rounded-lg border bg-[#050507] text-sm font-bold tracking-[0.04em]"
                  style={{
                    borderColor: `#${integration.color}70`,
                    color: `#${integration.color}`,
                    boxShadow: `0 0 22px #${integration.color}1f, inset 0 1px 0 rgba(255,255,255,0.08)`,
                  }}
                  aria-hidden="true"
                >
                  {integration.badge}
                </div>
                <p className="mt-4 text-[15px] font-semibold text-[#f2f2f2]">{integration.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8b949e]">{integration.category}</p>
              </div>

              <div className="absolute inset-x-5 bottom-5 rounded-[10px] border border-[#3d3a39] bg-[#050507]/95 px-3 py-2 text-xs leading-5 text-[#b8b3b0] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-safe:translate-y-2">
                {integration.description}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-[12px] border border-[#3d3a39] bg-[#101010]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0b0b0d] text-[#8b949e]">
                <tr>
                  <th className="sticky top-0 px-4 py-3 text-left font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort('name')}
                      className="inline-flex items-center gap-2 text-left text-[#8b949e] transition-colors hover:text-[#f2f2f2]"
                    >
                      Integration
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </th>
                  <th className="sticky top-0 px-4 py-3 text-left font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort('category')}
                      className="inline-flex items-center gap-2 text-left text-[#8b949e] transition-colors hover:text-[#f2f2f2]"
                    >
                      Category
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </th>
                  <th className="sticky top-0 px-4 py-3 text-left font-medium">Automation Use Case</th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((integration, index) => (
                  <tr key={integration.slug} className={index % 2 === 0 ? 'bg-[#101010]' : 'bg-[#0d0d10]'}>
                    <td className="px-4 py-3">
                      <Link
                        to={integration.link}
                        className="font-medium text-[#d8fff2] no-underline transition-colors hover:text-[#00d992]"
                      >
                        {integration.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[#8b949e]">{integration.category}</td>
                    <td className="px-4 py-3 text-[#b8b3b0]">{integration.useCase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
