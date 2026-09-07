import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'
import { HeroSection } from '@/components/sections/HeroSection'
import { HeroLeadForm } from '@/components/sections/HeroLeadForm'
import { ServiceFeatureCard } from '@/components/sections/ServiceFeatureCard'
import { FAQSection } from '@/components/sections/FAQSection'
import { CTABanner } from '@/components/sections/CTABanner'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { getIndustries, getProjects, getServices } from '@/lib/data/content'
import { generateServicePageSchema } from '@/lib/page-engine/schema'
import { CustomSchemas } from '@/components/seo/CustomSchemas'
import { getIndustrySeo } from '@/lib/get-page-seo'

interface IndustryPageProps {
  params: Promise<{ industry: string }>
}

export async function generateStaticParams() {
  return (await getIndustries()).map(i => ({ industry: i.slug }))
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const industries = await getIndustries()
  const { industry: slug } = await params
  const industry = industries.find(i => i.slug === slug)

  if (!industry) {
    return { title: 'Industry Not Found | SEO Expert Agency' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertagency.com'

  return {
    title: `${industry.name} SEO Services | SEO Expert Agency`,
    description: industry.shortDescription,
    alternates: {
      canonical: `${siteUrl}/industries/${industry.slug}`,
    },
    openGraph: {
      title: `${industry.name} SEO Services | SEO Expert Agency`,
      description: industry.shortDescription,
      url: `${siteUrl}/industries/${industry.slug}`,
      type: 'website',
    },
  }
}

export const revalidate = 3600

export default async function IndustryDetailPage({ params }: IndustryPageProps) {
  const industries = await getIndustries()
  const services = await getServices()
  const projects = await getProjects()
  const { industry: slug } = await params
  const industry = industries.find(i => i.slug === slug)

  if (!industry) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertagency.com'
  const industryUrl = `${siteUrl}/industries/${industry.slug}`

  const seoJson = await getIndustrySeo(slug)
  const schema = generateServicePageSchema({
    service: `${industry.name} SEO`,
    industry: industry.name,
    url: industryUrl,
    faqs: industry.faqs,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Industries', url: '/industries' },
      { name: industry.name, url: `/industries/${industry.slug}` },
    ],
  })

  const matchedServices = services.filter(s =>
    industry.recommendedServices.includes(s.slug)
  )

  const relatedCaseStudy = projects.find(p =>
    p.industry.toLowerCase().includes(industry.slug) ||
    p.industry.toLowerCase().includes(industry.name.toLowerCase().split(' ')[0])
  ) || projects[0]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CustomSchemas seoJson={seoJson} faqs={industry.faqs} />

      {/* 1. Hero with Form */}
      <HeroSection
        breadcrumb={
          <Breadcrumb
            tone="dark"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Industries', href: '/industries' },
              { label: industry.name },
            ]}
          />
        }
        badge={industry.heroBadge}
        h1={industry.headline}
        subtitle={industry.subheadline}
        ctaLabel={`Get Free ${industry.name} Audit`}
        ctaHref="#industry-form"
        rightSlot={
          <HeroLeadForm
            sourcePageSlug={`industry-${industry.slug}`}
            heading={`${industry.name} SEO Consultation`}
            subtitle="Discover untapped commercial keyword market share."
          />
        }
      />

      {/* 2. Industry Overview & Search Dynamics */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold text-primary tracking-wider uppercase">
              SECTOR SEARCH DYNAMICS
            </span>
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark mt-2">
              How Search Works in the {industry.name} Sector
            </h2>
          </div>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed text-pretty">
            {industry.overview}
          </p>
        </div>
      </section>

      {/* 3. Industry-Specific Challenges */}
      <section className="py-16 lg:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-red-600 tracking-wider uppercase">
              BARRIERS TO RANKING
            </span>
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark mt-2 mb-3">
              Unique SEO Challenges in {industry.name}
            </h2>
            <p className="text-slate-600 text-sm">
              Overcoming intense aggregator dominance, compliance requirements, and algorithmic scrutiny.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industry.challenges.map((c, idx) => (
              <div key={idx} className="card-premium p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold mb-4">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="font-bold text-base text-dark mb-2">{c.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Tailored SEO Strategy & Playbook */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-wider uppercase">
              OUR STRATEGIC PLAYBOOK
            </span>
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark mt-2 mb-3">
              Proven Playbook for {industry.name} Domination
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industry.strategy.map((strat, idx) => (
              <div key={idx} className="card-premium p-6 sm:p-7 rounded-2xl bg-primary-50/50 border border-primary-200/60">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold mb-4 shadow-sm">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="font-bold text-base text-dark mb-2">{strat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{strat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Recommended Core Services */}
      <section className="py-16 lg:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold text-primary tracking-wider uppercase">
              RECOMMENDED STACK
            </span>
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark mt-2">
              Recommended SEO Services for {industry.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {matchedServices.map(s => (
              <ServiceFeatureCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Featured Proof of Work Case Study */}
      {relatedCaseStudy && (
        <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card-premium p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                  FEATURED PROOF OF WORK
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-4 mb-3 text-white">
                  {relatedCaseStudy.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {relatedCaseStudy.summary}
                </p>
                {relatedCaseStudy.results && relatedCaseStudy.results.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {relatedCaseStudy.results.map((r, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/10 text-center min-w-[120px]">
                        <p className="text-xl font-extrabold text-primary">{r.metric}</p>
                        <p className="text-[11px] text-slate-300 mt-0.5">{r.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="lg:col-span-4 text-left lg:text-right">
                <Link
                  href={`/projects/${relatedCaseStudy.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs shadow-lg transition-all"
                >
                  Read Case Study <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. Industry FAQs */}
      <FAQSection faqs={industry.faqs} title={`${industry.name} SEO FAQs`}
        includeSchema={false} />

      {/* 8. Conversion CTA */}
      <CTABanner
        title={`Scale Your ${industry.name} Search Visibility`}
        subtitle="Request your custom competitor gap audit and keyword strategy presentation."
        ctaLabel={`Get ${industry.name} Strategy Audit`}
        ctaHref="/contact"
      />
    </>
  )
}
