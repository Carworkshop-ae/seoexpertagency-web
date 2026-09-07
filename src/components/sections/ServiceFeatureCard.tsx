import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SERVICE_ICON_MAP, DEFAULT_SERVICE_ICON } from '@/lib/service-icons'
import type { SEOServiceData } from '@/lib/data/agency-data'

interface ServiceFeatureCardProps {
  service?: Partial<SEOServiceData> & {
    name?: string
    slug?: string
    shortDescription?: string
    icon?: string
    startingPrice?: string
  }
}

export function ServiceFeatureCard({ service }: ServiceFeatureCardProps) {
  const name = service?.name || 'SEO Service'
  const slug = service?.slug || 'services'
  const href = `/services/${slug.replace(/^\//, '')}`
  const description = service?.shortDescription || ''
  const startingPrice = service?.startingPrice
  const iconKey = service?.icon || 'search'
  const Icon = SERVICE_ICON_MAP[iconKey] || DEFAULT_SERVICE_ICON

  return (
    <Link
      href={href}
      className="group card-premium flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 hover:border-primary/40 transition-all duration-200"
    >
      <div>
        <div className="w-12 h-12 rounded-xl bg-primary-50 ring-1 ring-primary-200/60 flex items-center justify-center mb-5 group-hover:bg-primary transition-all duration-200">
          <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-200" strokeWidth={1.8} />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-dark group-hover:text-primary transition-colors mb-2">
          {name}
        </h3>

        {description && (
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
            {description}
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Learn More <ArrowRight size={13} />
        </span>
        {startingPrice && (
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
            From {startingPrice}
          </span>
        )}
      </div>
    </Link>
  )
}
