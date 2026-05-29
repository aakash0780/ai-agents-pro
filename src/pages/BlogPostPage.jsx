import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Copy, MessageCircle } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { DOMAIN } from '@/utils/constants'
import { subscribeNewsletter } from '@/utils/api'
import { postQueryOptions } from '@/lib/queries/blog'

function formatDate(value) {
  const date = new Date(value)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function extractToc(content = '') {
  const matches = [...content.matchAll(/<h2>(.*?)<\/h2>/g)]
  return matches.map((match) => match[1].replace(/<[^>]+>/g, '').trim())
}

function slugifyHeading(value) {
  return value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function withHeadingAnchors(html = '') {
  return html.replace(/<h2>(.*?)<\/h2>/g, (_, title) => {
    const clean = title.replace(/<[^>]+>/g, '').trim()
    return `<h2 id="${slugifyHeading(clean)}">${title}</h2>`
  })
}

export function BlogPostPage() {
  const { slug } = useParams()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState('')

  const { data, isLoading, error } = useQuery(postQueryOptions(slug))
  const post = data?.post ?? null
  const related = data?.relatedPosts ?? []

  const toc = useMemo(() => extractToc(post?.content), [post?.content])
  const htmlContent = useMemo(() => withHeadingAnchors(post?.content || ''), [post?.content])

  const shareLink = slug ? `${DOMAIN.replace(/\/$/, '')}/blog/${slug}` : DOMAIN

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setNewsletterMessage('Link copied to clipboard.')
    } catch {
      setNewsletterMessage('Unable to copy link.')
    }
  }

  const onSubscribe = async (event) => {
    event.preventDefault()

    if (!newsletterEmail.trim()) {
      setNewsletterMessage('Enter an email address.')
      return
    }

    try {
      await subscribeNewsletter({ email: newsletterEmail, source: 'blog_post_sidebar' })
      setNewsletterMessage('Subscribed. You\'ll receive new updates.')
      setNewsletterEmail('')
    } catch (requestError) {
      setNewsletterMessage(
        requestError?.error || requestError?.message || 'Unable to subscribe right now.',
      )
    }
  }

  if (isLoading) {
    return (
      <main className="bg-[var(--bg)] pt-28 text-[var(--text)]">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-[var(--text-3)]">Loading post...</p>
        </div>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="bg-[var(--bg)] pt-28 text-[var(--text)]">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-[#ffb4b4]">{error?.message || 'Post not found.'}</p>
          <Link to="/blog" className="mt-4 inline-flex text-sm text-[var(--green)] no-underline hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[var(--bg)] pt-28 text-[var(--text)]">
      <SEO
        title={`${post.title} | AI Agents Pro`}
        description={post.excerpt}
        image={post.coverImage}
        url={shareLink}
      />

      <div className="mx-auto grid min-w-0 max-w-7xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
        <article className="min-w-0">
          <Link to="/blog" className="text-sm text-[var(--green)] no-underline hover:underline">
            ← Back to Blog
          </Link>

          <header className="mt-6">
            <img
              src={post.coverImage}
              alt={`${post.title} cover`}
              width="1200"
              height="630"
              className="max-h-[400px] w-full rounded-lg border border-[var(--border)] object-cover"
            />
            <span className="mt-6 inline-flex rounded-full border border-[var(--border-accent)] bg-[var(--green-dim)] px-3 py-1 text-xs text-[var(--green)]">
              {post.tag}
            </span>
            <h1 className="mt-4 font-[system-ui] text-[clamp(34px,5vw,48px)] font-light leading-[1.06] tracking-[-0.7px]">
              {post.title}
            </h1>
            <p className="mt-3 text-sm text-[var(--text-3)]">
              {post.author} · {formatDate(post.date)} · {post.readTime}
            </p>
          </header>

          <div className="blog-html mt-8" dangerouslySetInnerHTML={{ __html: htmlContent }} />

          <section className="mt-12 rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-5">
            <h2 className="text-xl font-semibold text-[var(--text)]">About the author</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-2)]">
              {post.authorBio || `Insights from ${post.author} at AI Agents Pro.`}
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl">Related Posts</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <article key={item.slug} className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-3">
                  <img
                    src={item.coverImage}
                    alt={`${item.title} thumbnail`}
                    width="1200"
                    height="630"
                    className="aspect-video w-full rounded-md border border-[var(--border)] object-cover"
                  />
                  <h3 className="mt-3 text-sm leading-snug">
                    <Link to={`/blog/${item.slug}`} className="no-underline hover:text-[var(--green)]">
                      {item.title}
                    </Link>
                  </h3>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-lg border border-[var(--green)] bg-[var(--card)] px-6 py-8 text-center">
            <h2 className="font-[system-ui] text-[32px] leading-[1.1] tracking-[-0.8px]">
              Ready to automate your business?
            </h2>
            <Link
              to="/get-started"
              className="mt-5 inline-flex rounded-xl bg-[var(--green)] px-6 py-3 text-sm font-semibold text-[#050507] no-underline transition hover:shadow-[0_0_24px_rgba(0,217,146,0.3)]"
            >
              Get Started Free
            </Link>
          </section>
        </article>

        <aside className="h-fit min-w-0 space-y-5 lg:sticky lg:top-28">
          <section className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-4">
            <h2 className="text-sm uppercase tracking-[0.18em] text-[var(--text-3)]">Table of contents</h2>
            {toc.length ? (
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-2)]">
                {toc.map((item, index) => (
                  <li key={`${index}-${slugifyHeading(item)}`}>
                    <a href={`#${slugifyHeading(item)}`} className="break-words no-underline hover:text-[var(--green)]">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[var(--text-3)]">Sections will appear when this post includes headings.</p>
            )}
          </section>

          <section className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-4">
            <h2 className="text-sm uppercase tracking-[0.18em] text-[var(--text-3)]">Share this post</h2>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={copyLink}
                aria-label="Copy blog link"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-2)]"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy Link
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - ${shareLink}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-2)] no-underline"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-4">
            <h2 className="text-sm uppercase tracking-[0.18em] text-[var(--text-3)]">
              Get AI automation tips
            </h2>
            <form className="mt-3 space-y-2" onSubmit={onSubscribe}>
              <input
                type="email"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                placeholder="you@company.com"
                className="h-10 w-full rounded-lg border border-[var(--border-warm)] bg-[#101010] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--green)]"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-[var(--green)] px-4 py-2 text-xs font-semibold text-[#050507]"
              >
                Subscribe
              </button>
            </form>
            {newsletterMessage ? <p className="mt-2 text-xs text-[var(--text-2)]">{newsletterMessage}</p> : null}
          </section>
        </aside>
      </div>
    </main>
  )
}
