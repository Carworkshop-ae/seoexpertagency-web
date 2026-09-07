import { cache } from 'react'
import { createPublicSupabase } from '@/lib/supabase/public'
import {
  SEO_SERVICES, SEO_INDUSTRIES, SEO_PROJECTS, SEO_LOCATIONS,
  type SEOServiceData, type SEOIndustryData, type SEOProjectData, type SEOLocationData,
} from '@/lib/data/agency-data'

// Public content loaders: read the CMS, fall back to the typed constants in
// agency-data.ts when a table is empty.
//
// The fallback is what lets the site build and render against an empty
// database — which is the state of any fresh clone, and of CI. Per-row merge
// (rather than all-or-nothing) means an editor can publish one service in the
// CMS without the other seven disappearing from the grid.
//
// Wrapped in React `cache()` so a page rendering both a listing and a detail
// view issues one query, not two.

type Row = Record<string, unknown>

const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])

/** Rows the CMS has published, or [] if the table is empty or unreachable. */
async function published(table: 'services' | 'industries' | 'projects' | 'locations'): Promise<Row[]> {
  try {
    const supabase = createPublicSupabase()
    const { data } = await supabase
      .from(table)
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
    return (data ?? []) as Row[]
  } catch {
    // A broken DB connection must not take the public site down — the static
    // fallback still renders a complete, correct page.
    return []
  }
}

export const getServices = cache(async (): Promise<SEOServiceData[]> => {
  const rows = await published('services')
  if (rows.length === 0) return SEO_SERVICES

  return rows.map(r => {
    const slug = str(r.slug)
    const fb = SEO_SERVICES.find(f => f.slug === slug)
    return {
      id: str(r.id) || slug,
      slug,
      name: str(r.name) || fb?.name || slug,
      shortDescription: str(r.short_description) || fb?.shortDescription || '',
      icon: str(r.icon) || fb?.icon || 'search',
      startingPrice: str(r.starting_price_label) || fb?.startingPrice || '',
      heroBadge: str(r.hero_badge) || fb?.heroBadge || 'CORE SERVICE',
      headline: str(r.headline) || fb?.headline || str(r.name),
      subheadline: str(r.subheadline) || fb?.subheadline || '',
      overview: str(r.overview) || fb?.overview || '',
      problemsSolved: arr<{ title: string; description: string }>(r.problems_json).length
        ? arr(r.problems_json) : (fb?.problemsSolved ?? []),
      benefits: arr<{ title: string; description: string }>(r.benefits_json).length
        ? arr(r.benefits_json) : (fb?.benefits ?? []),
      deliverables: arr<string>(r.deliverables_json).length
        ? arr<string>(r.deliverables_json) : (fb?.deliverables ?? []),
      process: arr<{ step: string; title: string; description: string }>(r.process_json).length
        ? arr(r.process_json) : (fb?.process ?? []),
      faqs: arr<{ question: string; answer: string }>(r.faq_json).length
        ? arr(r.faq_json) : (fb?.faqs ?? []),
    }
  })
})

export const getIndustries = cache(async (): Promise<SEOIndustryData[]> => {
  const rows = await published('industries')
  if (rows.length === 0) return SEO_INDUSTRIES

  return rows.map(r => {
    const slug = str(r.slug)
    const fb = SEO_INDUSTRIES.find(f => f.slug === slug)
    return {
      id: str(r.id) || slug,
      slug,
      name: str(r.name) || fb?.name || slug,
      shortDescription: str(r.short_description) || fb?.shortDescription || '',
      icon: str(r.icon) || fb?.icon || 'briefcase',
      heroBadge: str(r.hero_badge) || fb?.heroBadge || 'INDUSTRY EXPERTISE',
      headline: str(r.headline) || fb?.headline || str(r.name),
      subheadline: str(r.subheadline) || fb?.subheadline || '',
      overview: str(r.overview) || fb?.overview || '',
      challenges: arr<{ title: string; description: string }>(r.challenges_json).length
        ? arr(r.challenges_json) : (fb?.challenges ?? []),
      strategy: arr<{ title: string; description: string }>(r.strategy_json).length
        ? arr(r.strategy_json) : (fb?.strategy ?? []),
      recommendedServices: arr<string>(r.recommended_services).length
        ? arr<string>(r.recommended_services) : (fb?.recommendedServices ?? []),
      deliverables: arr<string>(r.deliverables_json).length
        ? arr<string>(r.deliverables_json) : (fb?.deliverables ?? []),
      faqs: arr<{ question: string; answer: string }>(r.faq_json).length
        ? arr(r.faq_json) : (fb?.faqs ?? []),
    }
  })
})

export const getProjects = cache(async (): Promise<SEOProjectData[]> => {
  const rows = await published('projects')
  // No fallback: SEO_PROJECTS is intentionally empty, because a case study is
  // publishable only once the client has approved it.
  if (rows.length === 0) return SEO_PROJECTS

  return rows.map(r => {
    const slug = str(r.slug)
    const results = arr<{ metric: string; label: string }>(r.results_json)
    return {
      id: str(r.id) || slug,
      slug,
      title: str(r.title),
      client: str(r.client),
      industry: str(r.industry),
      timeline: str(r.timeline),
      services: arr<string>(r.services),
      summary: str(r.summary),
      challenge: str(r.challenge),
      strategy: str(r.strategy),
      implementation: arr<{ phase: string; title: string; details: string }>(r.implementation_json),
      // Left undefined when empty so the templates omit the results block
      // rather than rendering an empty grid.
      results: results.length > 0 ? results : undefined,
      deliverables: arr<string>(r.deliverables_json),
    }
  })
})

export const getLocations = cache(async (): Promise<SEOLocationData[]> => {
  const rows = await published('locations')
  if (rows.length === 0) return SEO_LOCATIONS

  return rows.map(r => {
    const slug = str(r.slug)
    const fb = SEO_LOCATIONS.find(f => f.slug === slug)
    return {
      id: str(r.id) || slug,
      slug,
      name: str(r.name) || fb?.name || slug,
      region: str(r.region) || fb?.region || '',
      countryCode: str(r.country_code) || fb?.countryCode || '',
      heroBadge: str(r.hero_badge) || fb?.heroBadge || 'LOCAL SEO',
      headline: str(r.headline) || fb?.headline || str(r.name),
      subheadline: str(r.subheadline) || fb?.subheadline || '',
      overview: str(r.overview) || fb?.overview || '',
      localFactors: arr<{ title: string; description: string }>(r.local_factors_json).length
        ? arr(r.local_factors_json) : (fb?.localFactors ?? []),
      deliverables: arr<string>(r.deliverables_json).length
        ? arr<string>(r.deliverables_json) : (fb?.deliverables ?? []),
      faqs: arr<{ question: string; answer: string }>(r.faq_json).length
        ? arr(r.faq_json) : (fb?.faqs ?? []),
    }
  })
})

export const getService = cache(async (slug: string) => (await getServices()).find(s => s.slug === slug))
export const getIndustry = cache(async (slug: string) => (await getIndustries()).find(i => i.slug === slug))
export const getProject = cache(async (slug: string) => (await getProjects()).find(p => p.slug === slug))
export const getLocation = cache(async (slug: string) => (await getLocations()).find(l => l.slug === slug))
