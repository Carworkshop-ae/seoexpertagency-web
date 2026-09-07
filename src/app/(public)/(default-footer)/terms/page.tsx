import type { Metadata } from 'next'
import { PageHeader } from '@/components/sections/PageHeader'

export const metadata: Metadata = {
  title: 'Terms of Service | SEO Expert Agency',
  description: 'Terms and conditions governing our search engine optimization services and digital retainers.',
}

export const revalidate = 86400

export default function TermsPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Terms of Service' }]}
        eyebrow="AGREEMENT & SERVICE TERMS"
        title="Terms of Service"
        subtitle="Last updated: January 2026"
        showTrust={false}
      />
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 rich-content text-slate-700 leading-relaxed text-base">
          <h2>1. Scope of Agreement</h2>
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern the professional search engine optimization services, consulting retainers, and digital roadmaps provided by SEO Expert Agency (&ldquo;Agency&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) to the Client.
          </p>

          <h2>2. Agency Commitments & Standards</h2>
          <p>
            The Agency agrees to execute all services in accordance with recognized industry best practices and strict compliance with Google Webmaster Guidelines. We do not engage in black-hat link schemes, deceptive cloaking, or automated spam tactics.
          </p>

          <h2>3. Client Responsibilities</h2>
          <p>
            To achieve optimal ranking results, the Client agrees to provide timely access to necessary CMS platforms, analytics properties, Search Console accounts, and technical developer resources where direct implementation is required.
          </p>

          <h2>4. Invoicing & Payment Terms</h2>
          <p>
            Monthly SEO retainers are billed in advance at the start of each service cycle. Customized enterprise projects and one-time technical architecture audits are billed according to the payment schedule agreed upon in the individual Statement of Work (SOW).
          </p>

          <h2>5. Month-to-Month Flexibility & Cancellation</h2>
          <p>
            Unless explicitly specified in an enterprise multi-year agreement, our standard retainer tiers operate with month-to-month flexibility. Either party may cancel the recurring agreement with 30 days&apos; written notice prior to the next billing cycle.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            All custom content, technical audits, schema markup, and strategy documentation created specifically for the Client become the exclusive property of the Client upon full payment of relevant invoices.
          </p>
        </div>
      </section>
    </div>
  )
}
