// One codebase, three deployments — each domain serves a different market:
//
//   seoexpertagency.com  → global. SEO pages carry NO country or state.
//   seoexpertagency.uk   → United Kingdom. Country is fixed to UK; the State
//                          dropdown lists UK locations.
//   seoexpertagency.ae   → United Arab Emirates. Country fixed to UAE; the
//                          State dropdown lists the emirates.
//
// The market is a property of the DEPLOYMENT, not of the content — an admin on
// the .ae site should never be choosing between "United Arab Emirates" and
// "United Kingdom", and an admin on .com should not see a country field at all.
//
// Set NEXT_PUBLIC_MARKET explicitly in each Vercel project (AE | GB | XX).
// Falling back to the site URL's TLD covers local dev, where NEXT_PUBLIC_MARKET
// is usually unset; the final fallback is AE because that is the only live
// deployment today.

export type MarketCode = 'AE' | 'GB' | 'XX'

export interface Market {
  code: MarketCode
  /** ISO-2 stamped on locations and shown in the SEO page's Country field. */
  countryCode: string
  countryName: string
  /** Global has no geography: SEO pages there have no country and no state. */
  hasGeo: boolean
}

const MARKETS: Record<MarketCode, Market> = {
  AE: { code: 'AE', countryCode: 'AE', countryName: 'United Arab Emirates', hasGeo: true },
  GB: { code: 'GB', countryCode: 'GB', countryName: 'United Kingdom', hasGeo: true },
  XX: { code: 'XX', countryCode: 'XX', countryName: 'Global / International', hasGeo: false },
}

function isMarketCode(value: string): value is MarketCode {
  return value === 'AE' || value === 'GB' || value === 'XX'
}

function resolveCode(): MarketCode {
  // Referenced as a literal so Next inlines it into the client bundle.
  const explicit = (process.env.NEXT_PUBLIC_MARKET ?? '').trim().toUpperCase()
  if (isMarketCode(explicit)) return explicit

  const host = (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim().toLowerCase()
  if (/\.ae(?:[:/]|$)/.test(host)) return 'AE'
  if (/\.uk(?:[:/]|$)/.test(host)) return 'GB'
  if (/\.com(?:[:/]|$)/.test(host)) return 'XX'
  return 'AE'
}

export function getMarket(): Market {
  return MARKETS[resolveCode()]
}
