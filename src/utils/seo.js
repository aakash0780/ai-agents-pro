import { COMPANY, DOMAIN } from '@/utils/constants'

export function buildSeo({
  title,
  description,
  image = '/og-image.webp',
  url = DOMAIN,
}) {
  return {
    title,
    description,
    image,
    url,
    siteName: COMPANY,
  }
}
