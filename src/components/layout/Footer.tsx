import { EditableSetting } from '@/components/inline-edit/EditableSetting'
import { EditableLinkList } from '@/components/inline-edit/EditableLinkList'
import { EditModeLink } from '@/components/inline-edit/EditModeLink'
import Link from 'next/link'
import { Sparkles, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import type { SiteSettings } from '@/types/settings'
import { DEFAULT_SETTINGS } from '@/types/settings'
import { getServices, getLocations } from '@/lib/data/content'

interface FooterProps {
  settings: SiteSettings
  footerPages?: unknown
  brandsOverride?: unknown
}

// lucide-react dropped brand icons, so social links use small inline glyphs
// instead of a brand-icon package.
type SocialIconProps = { size: number }
const FacebookGlyph = ({ size }: SocialIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"/></svg>
)
const InstagramGlyph = ({ size }: SocialIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
)
const LinkedinGlyph = ({ size }: SocialIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.45 20h-3.37v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.97V20H9.68V8.5h3.24v1.57h.05c.45-.86 1.56-1.77 3.21-1.77 3.43 0 4.06 2.26 4.06 5.2V20Z"/></svg>
)
const TwitterGlyph = ({ size }: SocialIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 3H21.6l-5.8 6.63L22.6 21h-5.35l-4.19-5.48L8.24 21H5.53l6.2-7.09L4.4 3h5.48l3.79 5.01L18.9 3Zm-.94 16.34h1.49L7.1 4.58H5.5l12.46 14.76Z"/></svg>
)
const YoutubeGlyph = ({ size }: SocialIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12s0-3.2-.41-4.72a2.5 2.5 0 0 0-1.76-1.77C18.3 5.1 12 5.1 12 5.1s-6.3 0-7.83.41A2.5 2.5 0 0 0 2.41 7.28C2 8.8 2 12 2 12s0 3.2.41 4.72a2.5 2.5 0 0 0 1.76 1.77c1.53.41 7.83.41 7.83.41s6.3 0 7.83-.41a2.5 2.5 0 0 0 1.76-1.77C22 15.2 22 12 22 12Zm-12.5 3.02V8.98L15.5 12l-6 3.02Z"/></svg>
)

const SOCIAL_LINKS = (settings: SiteSettings) => [
  { href: settings.social_facebook_url, label: 'Facebook', Icon: FacebookGlyph },
  { href: settings.social_instagram_url, label: 'Instagram', Icon: InstagramGlyph },
  { href: settings.social_linkedin_url, label: 'LinkedIn', Icon: LinkedinGlyph },
  { href: settings.social_twitter_url, label: 'Twitter / X', Icon: TwitterGlyph },
  { href: settings.social_youtube_url, label: 'YouTube', Icon: YoutubeGlyph },
].filter((s): s is { href: string; label: string; Icon: typeof FacebookGlyph } => Boolean(s.href))

export async function Footer({ settings }: FooterProps) {
  const bgColor = settings.footer_background_color || '#0A1128'
  const textColor = settings.footer_text_color || '#FFFFFF'

  // No `|| fallback` here on purpose — an admin can clear this field to
  // remove the phone row entirely (see the `{phone && ...}` guard below).
  // getSettings() already supplies the typed default for a row that's never
  // been touched, so untouched sites keep showing today's number.
  const phone = settings.footer_business_phone
  const email = settings.footer_business_email || 'hello@seoexpertsagency.ae'
  const address = settings.footer_business_address || 'Level 24, Boulevard Plaza Tower 1, Downtown Dubai, UAE'

  const [services, locations] = await Promise.all([getServices(), getLocations()])
  const popularServices = services.slice(0, 8)
  const popularAreas = locations.slice(0, 8)
  const socialLinks = SOCIAL_LINKS(settings)

  return (
    <footer
      style={{ backgroundColor: bgColor, color: textColor }}
      role="contentinfo"
      className="relative overflow-hidden font-sans border-t border-slate-800"
    >
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Top brand & newsletter strip */}
        <div className="pb-12 mb-12 border-b border-slate-800/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                <Sparkles size={16} />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                SEO<span className="text-primary">Experts</span><span className="text-slate-400 font-normal text-sm ml-1">Agency</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              <EditableSetting
                settingKey="footer_tagline"
                multiline
                value={settings.footer_tagline || 'Leading data-driven search engine optimization agency delivering predictable organic revenue growth and high-intent customer acquisition.'}
              />
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center justify-start lg:justify-end gap-3">
            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <EditableSetting settingKey="footer_cta_label" value={settings.footer_cta_label || 'Ready to grow?'} />
              </p>
              <p className="text-sm font-bold text-white">
                <EditableSetting settingKey="footer_cta_heading" value={settings.footer_cta_heading || 'Get your free custom SEO strategy audit'} />
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold shadow-lg transition-all"
            >
              <EditableSetting settingKey="footer_cta_button_text" value={settings.footer_cta_button_text || 'Request Free Audit'} />
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 4-Column Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 text-xs">
          {/* Col 1: Company */}
          <EditableLinkList
            settingKey="footer_company_links"
            items={settings.footer_company_links?.length ? settings.footer_company_links : DEFAULT_SETTINGS.footer_company_links}
            heading={<EditableSetting settingKey="footer_column1_title" value={settings.footer_column1_title || 'Company'} />}
            headingClassName="text-xs font-bold uppercase tracking-wider text-white mb-4"
            listClassName="space-y-2.5 text-slate-400"
            linkClassName="hover:text-white hover:underline transition-colors"
          />

          {/* Col 2: Popular SEO Services */}
          <EditableLinkList
            settingKey="footer_services_links"
            items={settings.footer_services_links?.length ? settings.footer_services_links : popularServices.map(s => ({ label: s.name, url: s.linkUrl || '' }))}
            heading="Popular SEO Services"
            headingClassName="text-xs font-bold uppercase tracking-wider text-white mb-4"
            listClassName="space-y-2.5 text-slate-400"
            linkClassName="hover:text-white hover:underline transition-colors"
          />

          {/* Col 3: Popular Areas */}
          <EditableLinkList
            settingKey="footer_areas_links"
            items={settings.footer_areas_links?.length ? settings.footer_areas_links : popularAreas.map(a => ({ label: `SEO Agency in ${a.name}`, url: '' }))}
            heading="Popular Areas"
            headingClassName="text-xs font-bold uppercase tracking-wider text-white mb-4"
            listClassName="space-y-2.5 text-slate-400"
            linkClassName="hover:text-white hover:underline transition-colors"
          />

          {/* Col 4: Contact & HQ */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              <EditableSetting settingKey="footer_contact_heading" value={settings.footer_contact_heading || 'Contact & HQ'} />
            </h4>
            <div className="space-y-3 text-slate-400 mb-6">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-primary shrink-0 mt-0.5" />
                <EditableSetting settingKey="footer_business_address" className="leading-relaxed" value={address} />
              </div>
              {phone && (
                <div className="flex items-center gap-2">
                  <Phone size={15} className="text-primary shrink-0" />
                  <EditModeLink href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors"><EditableSetting settingKey="footer_business_phone" value={phone} /></EditModeLink>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-primary shrink-0" />
                <EditModeLink href={`mailto:${email}`} className="hover:text-white transition-colors"><EditableSetting settingKey="footer_business_email" value={email} /></EditModeLink>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2.5">
                {socialLinks.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom copyright notice and legal links */}
        <div className="mt-14 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>
            {settings.footer_copyright_text || '© 2026 SEO Expert Agency. All rights reserved.'}
          </p>
          <div className="flex gap-5 shrink-0 font-medium">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/faq" className="hover:text-slate-300 transition-colors">FAQs</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
