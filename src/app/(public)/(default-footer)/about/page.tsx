import type { Metadata } from 'next'
import { PageHeader } from '@/components/sections/PageHeader'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { FAQSection } from '@/components/sections/FAQSection'
import { CTABanner } from '@/components/sections/CTABanner'
import { generateOrganizationSchema, organizationDetailsFromSettings } from '@/lib/page-engine/schema'
import { getSettings } from '@/lib/hooks/useSettings'
import { TrendingUp, ShieldCheck, Target, Users } from 'lucide-react'

const DEFAULT_TITLE = 'About SEO Expert Agency | Data-Driven Search Engine Optimization'
const DEFAULT_DESC =
  'SEO Expert Agency is a data-driven search engine optimization consultancy delivering predictable organic revenue growth through technical rigor, semantic content, and white-hat link acquisition.'

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESC,
}

export const revalidate = 86400

const CORE_PILLARS = [
  {
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    title: 'Data-Driven Engineering',
    description: 'We treat SEO as a technical engineering discipline. Every recommendation is anchored in log analysis, crawl diagnostics, and statistical keyword intent.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: '100% White-Hat Integrity',
    description: 'Zero shortcuts or private blog networks. We build durable search visibility through authentic digital PR, editorial relevance, and flawless technical hygiene.',
  },
  {
    icon: <Target className="w-6 h-6 text-primary" />,
    title: 'Commercial Intent Focus',
    description: 'We prioritize search queries that drive qualified sales pipelines, inbound demos, and high-margin transactions over vanity impression spikes.',
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: 'Senior Strategist Direct Access',
    description: 'Every client partners directly with seasoned SEO directors and technical leads who have hands-on experience scaling high-traffic enterprise architectures.',
  },
]

export default async function AboutPage() {
  const schema = generateOrganizationSchema(organizationDetailsFromSettings(await getSettings()))

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
        eyebrow="OUR MISSION & PHILOSOPHY"
        title="Engineering Predictable Organic Search Growth"
        subtitle="We partner with ambitious enterprises and high-growth brands to transform search engines into their highest-ROI customer acquisition channel."
      />

      {/* Agency Philosophy Section */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 leading-relaxed text-base sm:text-lg">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-dark mb-4">
              Moving Beyond Superficial SEO Metrics
            </h2>
            <p>
              Traditional search marketing agencies often drown clients in vanity reports filled with impression metrics and ranking spikes for irrelevant queries. At <strong>SEO Expert Agency</strong>, we founded our consultancy on a radically transparent premise: <em>SEO only matters when it drives qualified pipeline, organic revenue, and measurable enterprise value.</em>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-dark mb-3">
              Our Technical Engineering Standard
            </h3>
            <p>
              Modern search engines are sophisticated neural information retrieval systems. Winning competitive commercial queries requires full-stack technical excellence: lightning-fast Core Web Vitals, pristine semantic schema architectures, crawl-budget optimization for millions of URLs, and structured topical entity authority.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="py-16 lg:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-wider uppercase mb-2 inline-block">
              OUR CORE VALUES
            </span>
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark">
              The Principles That Guide Every Campaign
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {CORE_PILLARS.map((pillar, idx) => (
              <div key={idx} className="card-premium p-7 sm:p-8 rounded-2xl bg-white border border-slate-200/80 flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base text-dark mb-1.5">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <ProcessSteps />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* FAQs */}
      <FAQSection />

      {/* CTA */}
      <CTABanner
        title="Ready to Partner With an Engineering-Grade SEO Agency?"
        subtitle="Schedule a free technical diagnostic and strategy presentation with our senior directors."
        ctaLabel="Book Strategy Discovery"
        ctaHref="/contact"
      />
    </div>
  )
}
