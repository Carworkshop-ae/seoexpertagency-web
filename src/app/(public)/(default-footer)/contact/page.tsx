import type { Metadata } from 'next'
import { ContactForm } from './ContactForm'
import { getServices, getContactContent } from '@/lib/data/content'
import { FAQSection } from '@/components/sections/FAQSection'
import { StaticPageEditProvider } from '@/components/inline-edit/StaticPageEditProvider'
import { EditableText } from '@/components/inline-edit/EditableText'
import { generateOrganizationSchema, organizationDetailsFromSettings } from '@/lib/page-engine/schema'
import { getSettings } from '@/lib/hooks/useSettings'

const DEFAULT_TITLE = 'Contact Our Senior SEO Strategists | SEO Expert Agency'
const DEFAULT_DESC =
  'Schedule a free organic search consultation, request a custom technical audit, or discuss enterprise SEO retainers with our senior directors.'

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESC,
}

export const revalidate = 3600

export default async function ContactPage() {
  const [services, schema, content] = await Promise.all([
    getServices(),
    getSettings().then(s => generateOrganizationSchema(organizationDetailsFromSettings(s))),
    getContactContent(),
  ])

  return (
    <StaticPageEditProvider slug="contact" initialContent={content}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ContactForm
        services={services}
        heroH1={<EditableText path="hero.h1" value={content.hero.h1} as="span" />}
        heroSubtitle={<EditableText path="hero.subheadline" value={content.hero.subheadline} as="span" multiline />}
        formHeading={<EditableText path="form.heading" value={content.form.heading} as="span" />}
        successMessage={<EditableText path="form.success_message" value={content.form.success_message} as="span" multiline />}
        contactPhone={<EditableText path="details.phone" value={content.details.phone} as="span" />}
        contactPhoneHref={`tel:${content.details.phone.replace(/[^0-9+]/g, '')}`}
        contactEmail={<EditableText path="details.email" value={content.details.email} as="span" />}
        contactEmailHref={`mailto:${content.details.email}`}
        workingHours={<EditableText path="details.weekday_hours" value={content.details.weekday_hours} as="span" />}
        nextStepsHeading={<EditableText path="next_steps.heading" value={content.next_steps.heading} as="span" />}
        nextSteps={content.next_steps.steps.map((step, i) => (
          <EditableText key={i} path={`next_steps.steps.${i}`} value={step} as="span" multiline />
        ))}
      />
      <FAQSection />
    </StaticPageEditProvider>
  )
}
