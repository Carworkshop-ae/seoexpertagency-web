import type { Metadata } from 'next'
import { createPublicSupabase } from '@/lib/supabase/public'
import { HeroSection } from '@/components/sections/HeroSection'
import { HeroLeadForm } from '@/components/sections/HeroLeadForm'
import { TrustBar } from '@/components/sections/TrustBar'
import { ServiceCardsSection } from '@/components/sections/ServiceCardsSection'
import { PackagesSection } from '@/components/sections/PackagesSection'
import { CTABanner } from '@/components/sections/CTABanner'
import { IndustriesSection } from '@/components/sections/IndustriesSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { BlogPreview } from '@/components/sections/BlogPreview'
import { FAQSection } from '@/components/sections/FAQSection'
import { FinalCTASection } from '@/components/sections/FinalCTASection'
import { Reveal } from '@/components/ui/Reveal'
import { generateOrganizationSchema, organizationDetailsFromSettings } from '@/lib/page-engine/schema'
import { getSettings } from '@/lib/hooks/useSettings'
import { resolveSEO, seoToMetadata } from '@/lib/seo'
import { getStaticPageSeo, getStaticPageMetaKeyword } from '@/lib/get-page-seo'
import { HOMEPAGE_FAQS } from '@/lib/data/agency-data'
import { getServices } from '@/lib/data/content'
import type { BlogPost } from '@/types'

const DEFAULT_TITLE = 'SEO Expert Agency — Data-Driven Search Engine Optimization'
const DEFAULT_DESC =
  'Grow your business with data-driven SEO strategies, technical excellence, and white-hat digital PR. Dominate high-intent search queries and scale organic revenue.'

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createPublicSupabase()
  const { data } = await supabase
    .from('static_pages')
    .select('seo_title, seo_description')
    .eq('slug', 'home')
    .eq('status', 'published')
    .maybeSingle()

  const title = data?.seo_title || DEFAULT_TITLE
  const description = data?.seo_description || DEFAULT_DESC
  const seo = resolveSEO(await getStaticPageSeo('home'), {
    title,
    description,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertagency.com',
  })
  return seoToMetadata(
    seo,
    process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertagency.com',
    await getStaticPageMetaKeyword('home')
  )
}

export const revalidate = 3600

export default async function HomePage() {
  const supabase = createPublicSupabase()

  const [{ data: posts }, servicesToRender] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3),
    getServices(),
  ])

  const orgSchema = generateOrganizationSchema(organizationDetailsFromSettings(await getSettings()))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* 1. Hero Section with Lead Capture Form */}
      <HeroSection
        h1="Grow Your Business With Data-Driven SEO"
        subtitle="We help ambitious brands scale organic search traffic, dominate high-intent keywords, and convert qualified visitors into predictable revenue."
        badge="RESULT-DRIVEN SEO AGENCY"
        ctaLabel="Get a Free SEO Consultation"
        ctaHref="#lead-form"
        secondaryLabel="Explore Our Services"
        secondaryHref="/services"
        rightSlot={<HeroLeadForm sourcePageSlug="homepage-hero" />}
      />

      {/* 2. Trust Bar */}
      <TrustBar />

      {/* 3. Core SEO Services */}
      <Reveal>
        <ServiceCardsSection
          services={servicesToRender}
          title="Our Core SEO Services"
          subtitle="Data-backed search optimization strategies engineered to scale high-intent traffic, dominate keywords, and grow organic revenue."
          eyebrow="WHAT WE DELIVER"
          viewMoreHref="/services"
        />
      </Reveal>

      {/* 4. Packages / Pricing */}
      <Reveal>
        <PackagesSection />
      </Reveal>

      {/* 5. High-Impact CTA Banner */}
      <Reveal>
        <CTABanner
          title="Ready to Grow Your Search Visibility?"
          subtitle="Schedule a 30-minute discovery call with our senior SEO strategists and receive a free comprehensive technical & keyword opportunity audit."
          ctaLabel="Get Your Free SEO Consultation"
          ctaHref="/contact"
        />
      </Reveal>

      {/* 6. Industries We Serve */}
      <Reveal>
        <IndustriesSection />
      </Reveal>

      {/* 7. Projects / Case Studies */}
      <Reveal>
        <ProjectsSection />
      </Reveal>

      {/* 8. 4-Step SEO Framework */}
      <Reveal>
        <ProcessSteps />
      </Reveal>

      {/* 9. Why Choose Us */}
      <Reveal>
        <WhyChooseUs />
      </Reveal>

      {/* 10. Client Testimonials */}
      <Reveal>
        <TestimonialsSection />
      </Reveal>

      {/* 11. SEO Blog Preview */}
      <Reveal>
        <BlogPreview posts={(posts as unknown as BlogPost[]) ?? []} />
      </Reveal>

      {/* 12. FAQ Section with Schema */}
      <Reveal>
        <FAQSection faqs={HOMEPAGE_FAQS} />
      </Reveal>

      {/* 13. Final Conversion CTA */}
      <Reveal>
        <FinalCTASection />
      </Reveal>
    </>
  )
}
