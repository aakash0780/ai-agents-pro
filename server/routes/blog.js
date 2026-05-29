import { Router } from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const postsPath = path.resolve(__dirname, '../data/blog-posts.json')

export const blogRouter = Router()

async function readPosts() {
  const raw = await fs.readFile(postsPath, 'utf8')
  const parsed = JSON.parse(raw)
  return Array.isArray(parsed)
    ? parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : []
}

blogRouter.get('/posts', async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 9))
    const tag = typeof req.query.tag === 'string' ? req.query.tag.trim() : ''
    const search = typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase() : ''

    let posts = await readPosts()

    if (tag) {
      posts = posts.filter((post) => post.tag.toLowerCase() === tag.toLowerCase())
    }

    if (search) {
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(search) ||
          post.excerpt.toLowerCase().includes(search),
      )
    }

    const total = posts.length
    const pages = Math.max(1, Math.ceil(total / limit))
    const offset = (page - 1) * limit
    const pagedPosts = posts.slice(offset, offset + limit)

    return res.status(200).json({
      posts: pagedPosts,
      total,
      page,
      pages,
    })
  } catch (error) {
    console.error('[blog] list failed:', error)
    return res.status(500).json({ error: 'Server error. Please try again.' })
  }
})

blogRouter.get('/posts/:slug', async (req, res) => {
  try {
    const posts = await readPosts()
    const post = posts.find((item) => item.slug === req.params.slug)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const relatedPosts = posts
      .filter((item) => item.slug !== post.slug)
      .sort((a, b) => {
        const scoreA = a.tag === post.tag ? 1 : 0
        const scoreB = b.tag === post.tag ? 1 : 0
        if (scoreA !== scoreB) return scoreB - scoreA
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
      .slice(0, 3)

    return res.status(200).json({ post, relatedPosts })
  } catch (error) {
    console.error('[blog] fetch failed:', error)
    return res.status(500).json({ error: 'Server error. Please try again.' })
  }
})
