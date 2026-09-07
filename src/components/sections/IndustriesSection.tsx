import Link from 'next/link'
import { ArrowRight, Cpu, ShoppingBag, Activity, Home, TrendingUp, Briefcase } from 'lucide-react'
import type { SEOIndustryData } from '@/lib/data/agency-data'
import { getIndustries } from '@/lib/data/content'

const INDUSTRY_ICON_MAP: Record<string, React.ReactNode> = {
  cpu: <Cpu className="w-6 h-6 text-primary" />,
  'shopping-bag': <ShoppingBag className="w-6 h-6 text-primary" />,
  activity: <Activity className="w-6 h-6 text-primary" />,
  home: <Home className="w-6 h-6 text-primary" />,
  'trending-up': <TrendingUp className="w-6 h-6 text-primary" />,
  briefcase: <Briefcase className="w-6 h-6 text-primary" />,
}

interface IndustriesSectionProps {
  industries?: SEOIndustryData[]
  title?: string
  subtitle?: string
  eyebrow?: string
  viewMoreHref?: string
}

export async function IndustriesSection({
  industries: industriesProp,
  title = 'Tailored SEO for High-Growth Industries',
  subtitle = 'Every industry operates under distinct search dynamics. We build bespoke search strategies that address the exact buyer intent and competitive barriers of your market.',
  eyebrow = 'SPECIALIZED EXPERTISE',
  viewMoreHref = '/industries',
}: IndustriesSectionProps) {
  const industries = industriesProp ?? await getIndustries()
  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-100" aria-labelledby="industries-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
          {eyebrow && (
            <span className="inline-block text-xs font-extrabold text-primary tracking-wider uppercase mb-2">
              {eyebrow}
            </span>
          )}
          <h2 id="industries-heading" className="display-tight text-balance text-3xl sm:text-4xl font-extrabold text-dark mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-pretty text-slate-600 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {industries.map(industry => {
            const icon = INDUSTRY_ICON_MAP[industry.icon] || <TrendingUp className="w-6 h-6 text-primary" />

            return (
              <div
                key={industry.slug}
                className="group card-premium p-7 sm:p-8 rounded-2xl bg-slate-50/50 hover:bg-white border border-slate-200/80 hover:border-primary/40 flex flex-col justify-between transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white ring-1 ring-slate-200/80 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                      {icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      {industry.heroBadge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-dark group-hover:text-primary transition-colors mb-2.5">
                    {industry.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {industry.shortDescription}
                  </p>

                  <div className="space-y-2 mb-6 pt-4 border-t border-slate-200/60 text-xs">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Key Search Focus:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {industry.challenges.slice(0, 2).map((c, i) => (
                        <span key={i} className="bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-md text-[11px] font-medium">
                          {c.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5"
                  >
                    View Industry Strategy <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {viewMoreHref && (
          <div className="text-center mt-12">
            <Link
              href={viewMoreHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-50 border border-primary-200 hover:bg-primary hover:text-white px-6 py-3.5 text-xs font-bold text-primary transition-all"
            >
              Explore All Industry Playbooks
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
