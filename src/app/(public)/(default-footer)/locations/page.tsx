import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/sections/PageHeader'
import { CTABanner } from '@/components/sections/CTABanner'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { FAQSection } from '@/components/sections/FAQSection'
import { getLocations } from '@/lib/data/content'
import { generateCollectionSchema } from '@/lib/page-engine/schema'

export const metadata: Metadata = {
  title: 'Global & Regional SEO Agency Locations | SEO Expert Agency',
  description:
    'Explore our regional search engine optimization hubs across the UAE, UK, and global international markets.',
}

export const revalidate = 3600

export default async function LocationsDirectoryPage() {
  const locations = await getLocations()
  const schema = generateCollectionSchema({
    name: 'SEO Agency Regional Locations',
    description: 'Regional SEO hubs across the UAE, United Kingdom, and Global markets.',
    path: '/locations',
    items: locations.map(l => ({ name: l.name, path: `/locations/${l.slug}` })),
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Locations' }]}
        eyebrow="REGIONAL & GLOBAL HUBS"
        title="Regional & International Search Optimization Hubs"
        subtitle="Localized search engine dominance backed by global technical engineering depth across the UAE, UK, and worldwide markets."
      />

      {/* Locations Grid */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {locations.map(loc => (
              <div
                key={loc.slug}
                className="group card-premium p-8 rounded-3xl bg-slate-50/50 hover:bg-white border border-slate-200/80 hover:border-primary/40 flex flex-col justify-between transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white ring-1 ring-slate-200 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-[11px] font-bold text-primary bg-primary-50 px-3 py-1 rounded-full">
                      {loc.region}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors mb-3">
                    {loc.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {loc.subheadline}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60">
                  <Link
                    href={`/locations/${loc.slug}`}
                    className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5"
                  >
                    View {loc.name} SEO Strategy <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <ProcessSteps />

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <CTABanner
        title="Ready to Capture Local Search Market Share?"
        subtitle="Schedule a consultation with our regional search strategists for your target territory."
        ctaLabel="Get Regional SEO Audit"
        ctaHref="/contact"
      />
    </>
  )
}
