import type { Metadata } from 'next'
import { PageHeader } from '@/components/sections/PageHeader'
import { IndustriesSection } from '@/components/sections/IndustriesSection'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { CTABanner } from '@/components/sections/CTABanner'
import { FAQSection } from '@/components/sections/FAQSection'
import { getIndustries } from '@/lib/data/content'
import { generateCollectionSchema } from '@/lib/page-engine/schema'

export const metadata: Metadata = {
  title: 'Industry-Specific SEO Strategies | SEO Expert Agency',
  description:
    'Explore customized search marketing playbooks tailored for SaaS, E-Commerce, Healthcare, Real Estate, Finance, and Professional Services.',
}

export const revalidate = 3600

export default async function IndustriesDirectoryPage() {
  const industries = await getIndustries()
  const schema = generateCollectionSchema({
    name: 'Industries We Serve',
    description: 'Specialized SEO frameworks tailored for key commercial verticals.',
    path: '/industries',
    items: industries.map(i => ({ name: i.name, path: `/industries/${i.slug}` })),
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Industries' }]}
        eyebrow="SECTOR-SPECIFIC SEARCH STRATEGY"
        title="SEO Playbooks Built for Your Exact Industry"
        subtitle="Search engine algorithms and buyer journeys differ radically across industries. We design targeted frameworks that win market share."
      />

      {/* Industries Grid */}
      <IndustriesSection />

      {/* Process */}
      <ProcessSteps />

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <CTABanner
        title="Ready for an Industry-Specific SEO Growth Strategy?"
        subtitle="Speak with our sector specialists and discover untapped search market share in your competitive vertical."
        ctaLabel="Book Industry Consultation"
        ctaHref="/contact"
      />
    </>
  )
}
