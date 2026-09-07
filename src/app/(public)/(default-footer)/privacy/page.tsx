import type { Metadata } from 'next'
import { PageHeader } from '@/components/sections/PageHeader'

export const metadata: Metadata = {
  title: 'Privacy Policy | SEO Expert Agency',
  description: 'How SEO Expert Agency collects, handles, and protects client and visitor data.',
}

export const revalidate = 86400

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]}
        eyebrow="LEGAL & DATA PROTECTION"
        title="Privacy Policy"
        subtitle="Last updated: January 2026"
        showTrust={false}
      />
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 rich-content text-slate-700 leading-relaxed text-base">
          <h2>1. Introduction</h2>
          <p>
            SEO Expert Agency (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to respecting and protecting the privacy of our website visitors, clients, and prospective partners. This Privacy Policy details how we collect, process, and safeguard your data when using our website and services.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            When you request an SEO audit, submit an inquiry form, or subscribe to our research insights, we may collect:
          </p>
          <ul>
            <li>Full Name and Job Title</li>
            <li>Business Email Address and Phone Number</li>
            <li>Company Name and Website URL</li>
            <li>Search marketing objectives, target markets, and project details</li>
            <li>Technical data such as IP address, browser type, and interaction metrics</li>
          </ul>

          <h2>3. How We Use Your Data</h2>
          <p>We process your data strictly to:</p>
          <ul>
            <li>Deliver customized search engine optimization audits and proposals</li>
            <li>Communicate project deliverables, reporting dashboards, and updates</li>
            <li>Maintain website security, fraud prevention, and rate-limiting safeguards</li>
            <li>Comply with applicable legal and statutory regulations</li>
          </ul>

          <h2>4. Data Confidentiality & Non-Disclosure</h2>
          <p>
            We strictly enforce non-disclosure and confidentiality standards. We do not sell, rent, or trade your personal or business data to third-party advertisers or brokers.
          </p>

          <h2>5. Your Rights & Contact</h2>
          <p>
            You have the right to request access to, correction of, or deletion of your personal data stored in our systems. To submit a data request, please contact our privacy compliance team at <a href="mailto:privacy@seoexpertagency.com">privacy@seoexpertagency.com</a>.
          </p>
        </div>
      </section>
    </div>
  )
}
