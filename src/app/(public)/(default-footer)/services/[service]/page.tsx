import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, AlertTriangle, Layers, Building2 } from 'lucide-react'
import { HeroSection } from '@/components/sections/HeroSection'
import { HeroLeadForm } from '@/components/sections/HeroLeadForm'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { FAQSection } from '@/components/sections/FAQSection'
import { CTABanner } from '@/components/sections/CTABanner'
import { ServiceFeatureCard } from '@/components/sections/ServiceFeatureCard'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { getIndustries, getServices } from '@/lib/data/content'
import { generateServicePageSchema } from '@/lib/page-engine/schema'
import { CustomSchemas } from '@/components/seo/CustomSchemas'
import { getServiceSeo } from '@/lib/get-page-seo'

interface ServicePageProps {
  params: Promise<{ service: string }>
}

export async function generateStaticParams() {
  return (await getServices()).map(s => ({ service: s.slug }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const services = await getServices()
  const { service: slug } = await params
  const service = services.find(s => s.slug === slug)

  if (!service) {
    return { title: 'Service Not Found | SEO Expert Agency' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertagency.com'

  return {
    title: `${service.name} Services | SEO Expert Agency`,
    description: service.shortDescription,
    alternates: {
      canonical: `${siteUrl}/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.name} Services | SEO Expert Agency`,
      description: service.shortDescription,
      url: `${siteUrl}/services/${service.slug}`,
      type: 'website',
    },
  }
}

export const revalidate = 3600

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const services = await getServices()
  const industries = await getIndustries()
  const { service: slug } = await params
  const service = services.find(s => s.slug === slug)

  if (!service) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertagency.com'
  const serviceUrl = `${siteUrl}/services/${service.slug}`

  const seoJson = await getServiceSeo(slug)
  const schema = generateServicePageSchema({
    service: service.name,
    url: serviceUrl,
    price: service.startingPrice,
    faqs: service.faqs,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: service.name, url: `/services/${service.slug}` },
    ],
  })

  const relatedServices = services.filter(s => s.slug !== service.slug).slice(0, 4)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CustomSchemas seoJson={seoJson} faqs={service.faqs} />

      {/* 1. Hero with Inquiry Form */}
      <HeroSection
        breadcrumb={
          <Breadcrumb
            tone="dark"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: service.name },
            ]}
          />
        }
        badge={service.heroBadge}
        h1={service.headline}
        subtitle={service.subheadline}
        ctaLabel="Get a Free Service Audit"
        ctaHref="#service-form"
        rightSlot={
          <HeroLeadForm
            sourcePageSlug={`service-${service.slug}`}
            heading={`Request ${service.name} Proposal`}
            subtitle="Receive custom pricing and tailored keyword strategy."
          />
        }
      />

      {/* 2. Service Introduction & Overview */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold text-primary tracking-wider uppercase">
              OVERVIEW &amp; STRATEGY
            </span>
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark mt-2">
              Transforming {service.name} Into Predictable Revenue
            </h2>
          </div>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed text-pretty">
            {service.overview}
          </p>
        </div>
      </section>

      {/* 3. Problems We Solve */}
      <section className="py-16 lg:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-red-600 tracking-wider uppercase">
              CHALLENGES OVERCOME
            </span>
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark mt-2 mb-3">
              Common Bottlenecks We Eliminate
            </h2>
            <p className="text-slate-600 text-sm">
              We diagnose and fix the structural and algorithmic obstacles holding back your rankings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.problemsSolved.map((prob, idx) => (
              <div key={idx} className="card-premium p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-dark mb-1">{prob.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{prob.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Benefits & Deliverables */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-extrabold text-primary tracking-wider uppercase">
                DELIVERABLES &amp; IMPACT
              </span>
              <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark mt-2 mb-6">
                Measurable Value &amp; Technical Assets
              </h2>
              <div className="space-y-4">
                {service.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary flex items-center justify-center mt-0.5">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-dark">{b.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="card-premium p-7 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-base font-extrabold text-dark mb-4 flex items-center gap-2">
                  <Layers size={18} className="text-primary" />
                  What You Receive Each Month:
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {service.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-primary font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Execution Process */}
      <ProcessSteps
        title={`Our ${service.name} Process`}
        subtitle="A disciplined, engineering-grade execution framework that ensures consistent ranking momentum."
        steps={service.process.map(p => ({
          number: parseInt(p.step, 10) || 1,
          title: p.title,
          description: p.description,
        }))}
      />

      {/* 6. Why Choose Us for This Service */}
      <WhyChooseUs heading={`Why Choose Our ${service.name} Team`} />

      {/* 7. Industries Served */}
      <section className="py-16 lg:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-extrabold text-primary tracking-wider uppercase mb-2 inline-block">
            VERTICAL EXPERTISE
          </span>
          <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark mb-8">
            Industries That Excel With {service.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {industries.map(ind => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="card-premium p-4 rounded-xl bg-white text-center hover:border-primary transition-colors group"
              >
                <Building2 size={20} className="text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-xs text-dark group-hover:text-primary transition-colors">{ind.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Related Services */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="display-tight text-balance text-2xl font-extrabold text-dark mb-8 text-center">
            Complementary SEO Capabilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedServices.map(rel => (
              <ServiceFeatureCard key={rel.slug} service={rel} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. Service FAQs */}
      <FAQSection faqs={service.faqs} title={`${service.name} FAQs`}
        includeSchema={false} />

      {/* 10. CTA Banner */}
      <CTABanner
        title={`Accelerate Your Search Rankings With ${service.name}`}
        subtitle="Schedule a free technical diagnostic and strategy session with our senior SEO architects."
        ctaLabel={`Get ${service.name} Audit`}
        ctaHref="/contact"
      />
    </>
  )
}
