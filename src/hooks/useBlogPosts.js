import { useMemo, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { postsQueryOptions } from '@/lib/queries/blog'

export function useBlogPosts(initialTag = 'All') {
  const [tag, setTag] = useState(initialTag)
  const [search, setSearch] = useState('')

  const normalizedTag = tag === 'All' ? '' : tag

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, error } =
    useInfiniteQuery(postsQueryOptions({ tag: normalizedTag, search }))

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.posts ?? []) ?? [],
    [data],
  )

  return {
    posts,
    total: data?.pages[0]?.total ?? posts.length,
    loading: isFetching && !isFetchingNextPage,
    loadingMore: isFetchingNextPage,
    error: error?.message ?? '',
    hasMore: !!hasNextPage,
    loadMore: fetchNextPage,
    tag,
    setTag,
    search,
    setSearch,
  }
}
