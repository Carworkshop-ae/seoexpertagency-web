import type { Metadata } from 'next'
import { ContactForm } from './ContactForm'
import { getServices } from '@/lib/data/content'
import { FAQSection } from '@/components/sections/FAQSection'
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
  const services = await getServices()
  const schema = generateOrganizationSchema(organizationDetailsFromSettings(await getSettings()))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ContactForm services={services} />
      <FAQSection />
    </>
  )
}
