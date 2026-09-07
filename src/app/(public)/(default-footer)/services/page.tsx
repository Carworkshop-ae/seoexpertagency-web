import type { Metadata } from 'next'
import { PageHeader } from '@/components/sections/PageHeader'
import { ServiceFeatureCard } from '@/components/sections/ServiceFeatureCard'
import { CTABanner } from '@/components/sections/CTABanner'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { FAQSection } from '@/components/sections/FAQSection'
import { getServices } from '@/lib/data/content'
import { generateCollectionSchema } from '@/lib/page-engine/schema'

export const metadata: Metadata = {
  title: 'Comprehensive SEO Services | SEO Expert Agency',
  description:
    'Explore our data-driven SEO services: Technical SEO, Local SEO, E-Commerce SEO, Enterprise SEO, Content Strategy, and High-Authority Link Building.',
}

export const revalidate = 3600

export default async function ServicesDirectoryPage() {
  const services = await getServices()
  const schema = generateCollectionSchema({
    name: 'SEO Services Directory',
    description: 'Complete catalog of professional search engine optimization services.',
    path: '/services',
    items: services.map(s => ({ name: s.name, path: `/services/${s.slug}` })),
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'SEO Services' }]}
        eyebrow="FULL-SPECTRUM SEARCH CAPABILITIES"
        title="Data-Driven Search Engine Optimization Services"
        subtitle="Every service is engineered to solve specific organic bottlenecks, outrank aggressive competitors, and generate predictable business revenue."
      />

      {/* Services Grid */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(service => (
              <ServiceFeatureCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <ProcessSteps />

      {/* FAQ */}
      <FAQSection />

      {/* Conversion Banner */}
      <CTABanner
        title="Need a Custom SEO Strategy for Your Brand?"
        subtitle="Contact our search strategists to receive a free, personalized 20-page technical audit and keyword opportunity roadmap."
        ctaLabel="Get Your Free Strategy Audit"
        ctaHref="/contact"
      />
    </>
  )
}
