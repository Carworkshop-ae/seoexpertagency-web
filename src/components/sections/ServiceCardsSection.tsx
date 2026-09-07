import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ServiceFeatureCard } from '@/components/sections/ServiceFeatureCard'
import type { SEOServiceData } from '@/lib/data/agency-data'
import { getServices } from '@/lib/data/content'

interface ServiceCardsSectionProps {
  services?: SEOServiceData[]
  title?: string
  subtitle?: string
  eyebrow?: string
  viewMoreHref?: string
  limit?: number
}

export async function ServiceCardsSection({
  services: servicesProp,
  title = 'Our Core SEO Services',
  subtitle = 'Data-backed search optimization strategies engineered to scale high-intent traffic, dominate keywords, and grow organic revenue.',
  eyebrow = 'WHAT WE DELIVER',
  viewMoreHref = '/services',
  limit,
}: ServiceCardsSectionProps) {
  const services = servicesProp ?? await getServices()
  const displayedServices = limit ? services.slice(0, limit) : services

  if (displayedServices.length === 0) return null

  return (
    <section className="py-16 lg:py-24 bg-slate-50/50 border-b border-slate-100" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
          {eyebrow && (
            <span className="inline-block text-xs font-extrabold text-primary tracking-wider uppercase mb-2">
              {eyebrow}
            </span>
          )}
          <h2 id="services-heading" className="display-tight text-balance text-3xl sm:text-4xl font-extrabold text-dark mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-pretty text-slate-600 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedServices.map(service => (
            <ServiceFeatureCard key={service.slug} service={service} />
          ))}
        </div>

        {viewMoreHref && (
          <div className="text-center mt-12">
            <Link
              href={viewMoreHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-primary px-6 py-3.5 text-xs font-bold text-slate-800 hover:text-primary shadow-sm transition-all"
            >
              Explore All SEO Services
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
