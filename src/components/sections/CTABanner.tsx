'use client'

import type { ReactNode } from 'react'
import { ArrowRight, Phone, Sparkles } from 'lucide-react'
import { EditModeLink } from '@/components/inline-edit/EditModeLink'
import { EditableText } from '@/components/inline-edit/EditableText'
import { useAdminEdit } from '@/components/inline-edit/AdminEditProvider'

interface CTABannerProps {
  badge?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  ctaLabel?: ReactNode
  ctaHref?: string
  /** Plain text, not a pre-wrapped EditableText — the button itself is
   *  conditionally rendered based on this being non-blank, so the visibility
   *  check needs the real string rather than an always-truthy React element
   *  (an EditableText wrapping an empty value is still a truthy node).
   *  Blank hides the button for visitors; an admin with edit mode on still
   *  sees it (via secondaryPath) so they can type a label back in. */
  secondaryLabel?: string
  secondaryPath?: string
  secondaryHref?: string
  bgColor?: string
}

export function CTABanner({
  badge = 'Zero Obligation · Custom Strategy',
  title = 'Ready to Grow Your Search Visibility?',
  subtitle = 'Schedule a 30-minute discovery call with our senior SEO strategists and receive a free comprehensive technical & keyword opportunity audit.',
  ctaLabel = 'Get Your Free SEO Consultation',
  ctaHref = '/contact',
  secondaryLabel = '',
  secondaryPath,
  secondaryHref = 'tel:+9714800736',
  bgColor,
}: CTABannerProps) {
  const { isAdmin, editMode } = useAdminEdit()
  const showSecondary = Boolean(secondaryLabel) || (isAdmin && editMode)

  return (
    <section className="py-14 lg:py-20 px-4 sm:px-6 lg:px-8" aria-labelledby="cta-heading">
      <div
        className={`relative overflow-hidden max-w-7xl mx-auto rounded-3xl px-6 py-12 sm:px-12 sm:py-16 text-center ${
          bgColor ? '' : 'bg-gradient-to-br from-primary via-primary-600 to-primary-800'
        } shadow-2xl`}
        style={bgColor ? { backgroundColor: bgColor } : undefined}
      >
        <div className="absolute inset-0 texture-dots opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

        <div className="relative max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
            <Sparkles size={13} className="text-white" />
            {badge}
          </span>

          <h2 id="cta-heading" className="display-tight text-balance text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {title}
          </h2>

          <p className="text-pretty text-blue-100 mt-4 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-3.5 mt-8">
            <EditModeLink
              href={ctaHref}
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-primary hover:bg-slate-50 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-xs sm:text-sm"
            >
              {ctaLabel}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </EditModeLink>
            {showSecondary && (
              <EditModeLink
                href={secondaryHref}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white font-semibold ring-1 ring-white/30 hover:bg-white/20 backdrop-blur transition-all text-xs sm:text-sm"
              >
                <Phone size={15} />
                {secondaryPath ? <EditableText path={secondaryPath} value={secondaryLabel} as="span" /> : secondaryLabel}
              </EditModeLink>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
