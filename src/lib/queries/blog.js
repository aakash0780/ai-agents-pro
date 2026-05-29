import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { fetchBlogPost, fetchBlogPosts } from '@/utils/api'

const POSTS_PAGE_SIZE = 9

export const postsQueryOptions = ({ tag = '', search = '' } = {}) =>
  infiniteQueryOptions({
    queryKey: ['posts', { tag, search }],
    queryFn: ({ pageParam = 1 }) =>
      fetchBlogPosts({ page: pageParam, limit: POSTS_PAGE_SIZE, tag, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
    staleTime: 2 * 60 * 1000,
  })

export const postQueryOptions = (slug) =>
  queryOptions({
    queryKey: ['post', slug],
    queryFn: () => fetchBlogPost(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  })
