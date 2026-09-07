import type { Metadata } from 'next'
import { PageHeader } from '@/components/sections/PageHeader'
import { Accordion } from '@/components/ui/Accordion'
import { CTABanner } from '@/components/sections/CTABanner'
import { HOMEPAGE_FAQS } from '@/lib/data/agency-data'

const DEFAULT_TITLE = 'SEO Frequently Asked Questions | SEO Expert Agency'
const DEFAULT_DESC =
  'Detailed answers about our data-driven SEO methodologies, technical audits, time to results, retainers, and transparent reporting.'

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESC,
}

export const revalidate = 86400

const EXTENDED_FAQS = [
  ...HOMEPAGE_FAQS,
  {
    question: 'How do you perform keyword research and intent mapping?',
    answer: 'We analyze real search demand, commercial intent, customer search journey stages, and competitor content gaps using industry-standard tools and proprietary clustering scripts.',
  },
  {
    question: 'What is your stance on AI-generated content for SEO?',
    answer: 'We utilize AI strictly for research and data clustering. All published content is crafted, reviewed, and enhanced by subject-matter experts to ensure high E-E-A-T signals and original value.',
  },
  {
    question: 'How do you build backlinks safely?',
    answer: 'We exclusively execute digital PR, proprietary data surveys, original research studies, and editorial outreach to secure natural, high-DR citations that never risk Google algorithmic penalties.',
  },
]

export default function FAQPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: EXTENDED_FAQS.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'FAQs' }]}
        eyebrow="CLEAR, TRANSPARENT ANSWERS"
        title="Frequently Asked SEO Questions"
        subtitle="Everything you need to know about our data-driven search marketing methodology, deliverables, and retainers."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <Accordion items={EXTENDED_FAQS} />
      </div>

      <CTABanner
        title="Have a Question Not Listed Here?"
        subtitle="Schedule a 15-minute consultation with our senior SEO architects to discuss your specific website needs."
        ctaLabel="Ask Our SEO Team"
        ctaHref="/contact"
      />
    </>
  )
}
