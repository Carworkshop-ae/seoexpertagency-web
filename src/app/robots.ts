import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.startsWith('http')
  ? process.env.NEXT_PUBLIC_SITE_URL
  : 'https://seoexpertsagency.ae'

// Explicit allow-list of major search + AI crawlers, per client request —
// functionally equivalent to a bare `userAgent: '*'` allow, but each bot is
// named explicitly so it's unambiguous to anyone auditing the file by eye.
const CRAWLERS = [
  'Googlebot',
  'Googlebot-Image',
  'Googlebot-Video',
  'Googlebot-News',
  'Google-Extended',
  'Bingbot',
  'msnbot-media',
  'Slurp',
  'DuckDuckBot',
  'YandexBot',
  'Applebot',
  'Applebot-Extended',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Amazonbot',
  'meta-externalagent',
  'DuckAssistBot',
  'MistralAI-User',
  'CCBot',
]

const DISALLOW = ['/admin/', '/api/', '/cart/', '/checkout/', '/my-account/', '/*?s=', '/search/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...CRAWLERS.map(userAgent => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
