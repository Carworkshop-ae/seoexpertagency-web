import Link from 'next/link'
import { Check, Sparkles, ArrowRight } from 'lucide-react'
import { SEO_PACKAGES, type SEOPackageData } from '@/lib/data/agency-data'

interface PackagesSectionProps {
  packages?: SEOPackageData[]
  title?: string
  subtitle?: string
  eyebrow?: string
}

export function PackagesSection({
  packages = SEO_PACKAGES,
  title = 'Predictable, Transparent SEO Packages',
  subtitle = 'Choose the ideal engagement tier engineered to outpace your competitors and scale organic customer acquisition.',
  eyebrow = 'TRANSPARENT PRICING',
}: PackagesSectionProps) {
  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-100" id="pricing" aria-labelledby="pricing-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
          {eyebrow && (
            <span className="inline-block text-xs font-extrabold text-primary tracking-wider uppercase mb-2">
              {eyebrow}
            </span>
          )}
          <h2 id="pricing-heading" className="display-tight text-balance text-3xl sm:text-4xl font-extrabold text-dark mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-pretty text-slate-600 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map(pkg => {
            const isFeatured = pkg.isPopular

            return (
              <div
                key={pkg.id}
                className={[
                  'relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200',
                  isFeatured
                    ? 'bg-gradient-to-b from-primary to-primary-600 text-white shadow-2xl ring-2 ring-primary lg:-translate-y-2'
                    : 'bg-white border border-slate-200/90 text-slate-900 shadow-md hover:shadow-xl hover:border-primary/30',
                ].join(' ')}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-dark text-white text-[11px] font-extrabold tracking-wider uppercase shadow-md inline-flex items-center gap-1.5">
                    <Sparkles size={13} className="text-primary" />
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={[
                        'text-base font-extrabold tracking-wider uppercase',
                        isFeatured ? 'text-white' : 'text-slate-900',
                      ].join(' ')}
                    >
                      {pkg.name}
                    </h3>
                    <span
                      className={[
                        'text-[11px] font-bold px-2.5 py-0.5 rounded-full',
                        isFeatured ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600',
                      ].join(' ')}
                    >
                      {pkg.tier.toUpperCase()} TIER
                    </span>
                  </div>

                  <div className="mb-4">
                    <span
                      className={[
                        'text-3xl sm:text-4xl font-extrabold tracking-tight',
                        isFeatured ? 'text-white' : 'text-dark',
                      ].join(' ')}
                    >
                      {pkg.price}
                    </span>
                    <span
                      className={[
                        'text-xs ml-2 font-medium',
                        isFeatured ? 'text-blue-100' : 'text-slate-500',
                      ].join(' ')}
                    >
                      /{pkg.billingPeriod}
                    </span>
                  </div>

                  <p
                    className={[
                      'text-xs sm:text-sm leading-relaxed mb-6',
                      isFeatured ? 'text-blue-50' : 'text-slate-600',
                    ].join(' ')}
                  >
                    {pkg.description}
                  </p>

                  <div
                    className={[
                      'pt-6 border-t mb-6 space-y-3 text-xs sm:text-sm',
                      isFeatured ? 'border-white/20 text-white' : 'border-slate-100 text-slate-700',
                    ].join(' ')}
                  >
                    <p
                      className={[
                        'text-xs font-bold uppercase tracking-wider mb-3',
                        isFeatured ? 'text-blue-200' : 'text-slate-400',
                      ].join(' ')}
                    >
                      What&apos;s Included:
                    </p>
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div
                          className={[
                            'shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5',
                            isFeatured ? 'bg-white text-primary' : 'bg-primary-50 text-primary',
                          ].join(' ')}
                        >
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4">
                  <Link
                    href={`/contact?package=${pkg.id}`}
                    className={[
                      'w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all',
                      isFeatured
                        ? 'bg-white text-primary hover:bg-slate-50 hover:shadow-lg'
                        : 'bg-primary text-white hover:bg-primary-600 hover:shadow-lg',
                    ].join(' ')}
                  >
                    {pkg.ctaLabel}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500">
            Need a custom enterprise scope, multi-lingual setup, or dedicated embedded team?{' '}
            <Link href="/contact" className="text-primary font-bold hover:underline">
              Request a Custom Retainer Proposal →
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
