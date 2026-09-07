import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, CheckCircle2 } from 'lucide-react'
import { HeroSection } from '@/components/sections/HeroSection'
import { HeroLeadForm } from '@/components/sections/HeroLeadForm'
import { ServiceFeatureCard } from '@/components/sections/ServiceFeatureCard'
import { FAQSection } from '@/components/sections/FAQSection'
import { CTABanner } from '@/components/sections/CTABanner'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { getLocations, getServices } from '@/lib/data/content'
import { generateServicePageSchema } from '@/lib/page-engine/schema'
import { CustomSchemas } from '@/components/seo/CustomSchemas'
import { getLocationSeo } from '@/lib/get-page-seo'

interface LocationPageProps {
  params: Promise<{ location: string }>
}

export async function generateStaticParams() {
  return (await getLocations()).map(l => ({ location: l.slug }))
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const locations = await getLocations()
  const { location: slug } = await params
  const location = locations.find(l => l.slug === slug)

  if (!location) {
    return { title: 'Location Not Found | SEO Expert Agency' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertagency.com'

  return {
    title: `SEO Agency in ${location.name} | SEO Expert Agency`,
    description: location.subheadline,
    alternates: {
      canonical: `${siteUrl}/locations/${location.slug}`,
    },
    openGraph: {
      title: `SEO Agency in ${location.name} | SEO Expert Agency`,
      description: location.subheadline,
      url: `${siteUrl}/locations/${location.slug}`,
      type: 'website',
    },
  }
}

export const revalidate = 3600

export default async function LocationDetailPage({ params }: LocationPageProps) {
  const locations = await getLocations()
  const services = await getServices()
  const { location: slug } = await params
  const location = locations.find(l => l.slug === slug)

  if (!location) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertagency.com'
  const locationUrl = `${siteUrl}/locations/${location.slug}`

  const seoJson = await getLocationSeo(slug)
  const schema = generateServicePageSchema({
    service: `SEO Services in ${location.name}`,
    location: location.name,
    url: locationUrl,
    faqs: location.faqs,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Locations', url: '/locations' },
      { name: location.name, url: `/locations/${location.slug}` },
    ],
  })

  const otherLocations = locations.filter(l => l.slug !== location.slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CustomSchemas seoJson={seoJson} faqs={location.faqs} />

      {/* 1. Location Hero */}
      <HeroSection
        breadcrumb={
          <Breadcrumb
            tone="dark"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Locations', href: '/locations' },
              { label: location.name },
            ]}
          />
        }
        badge={location.heroBadge}
        h1={location.headline}
        subtitle={location.subheadline}
        ctaLabel={`Get ${location.name} SEO Proposal`}
        ctaHref="#location-form"
        rightSlot={
          <HeroLeadForm
            sourcePageSlug={`location-${location.slug}`}
            heading={`SEO Consultation in ${location.name}`}
            subtitle="Capture high-intent local search queries and outrank competitors."
          />
        }
      />

      {/* 2. Regional Market Overview */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold text-primary tracking-wider uppercase">
              LOCAL SEARCH INSIGHTS
            </span>
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark mt-2">
              Navigating Organic Search Dynamics in {location.name}
            </h2>
          </div>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed text-pretty">
            {location.overview}
          </p>
        </div>
      </section>

      {/* 3. Key Regional Factors & Search Strategy */}
      <section className="py-16 lg:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-wider uppercase">
              REGIONAL FACTORS
            </span>
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark mt-2 mb-3">
              Strategic Factors Driving Rankings in {location.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {location.localFactors.map((factor, idx) => (
              <div key={idx} className="card-premium p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center font-bold mb-4">
                  <MapPin size={20} />
                </div>
                <h3 className="font-bold text-base text-dark mb-2">{factor.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Localized Deliverables */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-premium p-8 rounded-3xl bg-slate-50 border border-slate-200/80">
            <h3 className="text-base font-extrabold text-dark mb-4">
              Included in Our {location.name} SEO Engagement:
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              {location.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Core Services */}
      <section className="py-16 lg:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark">
              Core SEO Capabilities for {location.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 4).map(s => (
              <ServiceFeatureCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Other Locations */}
      {otherLocations.length > 0 && (
        <section className="py-12 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Other Regional Hubs:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {otherLocations.map(l => (
                <Link
                  key={l.slug}
                  href={`/locations/${l.slug}`}
                  className="bg-slate-50 border border-slate-200 text-slate-800 hover:border-primary hover:text-primary px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  {l.name} SEO →
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Location FAQs */}
      <FAQSection faqs={location.faqs} title={`${location.name} SEO FAQs`}
        includeSchema={false} />

      {/* 8. Conversion CTA */}
      <CTABanner
        title={`Dominate Search Rankings in ${location.name}`}
        subtitle="Schedule a free technical audit and geographic search opportunity presentation."
        ctaLabel={`Get ${location.name} SEO Proposal`}
        ctaHref="/contact"
      />
    </>
  )
}
