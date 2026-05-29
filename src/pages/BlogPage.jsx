import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { blogTags } from '@/constants/blog'
import { useBlogPosts } from '@/hooks/useBlogPosts'

function formatDate(value) {
  const date = new Date(value)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function authorInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function BlogPage() {
  const {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    tag,
    setTag,
    search,
    setSearch,
  } = useBlogPosts('All')

  return (
    <main className="bg-[var(--bg)] pt-28 text-[var(--text)]">
      <SEO
        title="Blog | AI Automation Insights — AI Agents Pro"
        description="Practical guides, case studies, and thought leadership on AI agents, automation, and B2B customer operations from the AI Agents Pro team."
        url="https://www.aiagentspro.in/blog"
      />

      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="font-[system-ui] text-[clamp(36px,5vw,52px)] font-light leading-[1.04] tracking-[-0.7px]">
            Insights & Resources
          </h1>
          <p className="mt-4 max-w-3xl text-[var(--text-2)]">
            Practical guides, case studies, and product thinking from the AI Agents Pro team.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {blogTags.map((tagOption) => (
              <button
                key={tagOption}
                type="button"
                onClick={() => setTag(tagOption)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] ${
                  tag === tagOption
                    ? 'border-[var(--border-accent)] bg-[var(--green-dim)] text-[var(--green)]'
                    : 'border-[var(--border-warm)] text-[var(--text-2)]'
                }`}
              >
                {tagOption}
              </button>
            ))}
          </div>

          <div className="relative mt-5 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search posts"
              className="h-11 w-full rounded-lg border border-[var(--border-warm)] bg-[var(--card)] pl-9 pr-3 text-sm text-[var(--text)] outline-none focus:border-[var(--green)]"
            />
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {error ? (
            <div className="rounded-lg border border-[#7f1d1d] bg-[#2a1111] px-4 py-3 text-sm text-[#ffb4b4]">
              {error}
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {loading && !posts.length
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`sk-${index}`}
                    className="animate-pulse rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-4"
                  >
                    <div className="aspect-video w-full rounded-md bg-[#17171d]" />
                    <div className="mt-4 h-3 w-16 rounded bg-[#17171d]" />
                    <div className="mt-3 h-5 w-full rounded bg-[#17171d]" />
                    <div className="mt-2 h-4 max-w-[85%] rounded bg-[#17171d]" />
                    <div className="mt-4 flex justify-between">
                      <div className="h-3 w-24 rounded bg-[#17171d]" />
                      <div className="h-3 w-20 rounded bg-[#17171d]" />
                    </div>
                  </div>
                ))
              : null}

            {!loading && !posts.length ? (
              <div className="col-span-full rounded-lg border border-[var(--border-warm)] bg-[var(--card)] px-6 py-16 text-center">
                <p className="text-lg text-[var(--text)]">No posts match your filters.</p>
                <p className="mt-2 text-sm text-[var(--text-3)]">Try another tag or clear your search.</p>
              </div>
            ) : null}

            {posts.map((post) => (
              <article key={post.slug} className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-4">
                <img
                  src={post.coverImage}
                  alt={`${post.title} cover image`}
                  width="1200"
                  height="630"
                  className="aspect-video w-full rounded-md border border-[var(--border)] object-cover"
                />
                <span className="mt-4 inline-flex rounded-full border border-[var(--border-accent)] bg-[var(--green-dim)] px-2.5 py-1 text-xs text-[var(--green)]">
                  {post.tag}
                </span>
                <h2 className="mt-3 text-lg font-semibold leading-snug">
                  <Link to={`/blog/${post.slug}`} className="no-underline hover:text-[var(--green)]">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--text-2)]">{post.excerpt}</p>

                <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-3)]">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[#0f1014] text-[11px] text-[var(--text)]">
                      {authorInitials(post.author)}
                    </span>
                    {post.author}
                  </span>
                  <span>
                    {formatDate(post.date)} · {post.readTime}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {loadingMore ? (
            <p className="mt-6 text-sm text-[var(--text-3)]">Loading more posts…</p>
          ) : null}

          {hasMore ? (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="rounded-xl border border-[var(--border-warm)] px-6 py-3 text-sm text-[var(--text-2)] disabled:opacity-60"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
