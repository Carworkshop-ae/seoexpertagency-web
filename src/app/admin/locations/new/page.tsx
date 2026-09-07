import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { ContentForm } from '@/components/admin/content/ContentForm'
import { locationSections } from '@/components/admin/content/specs'

export const metadata = { title: 'New Location' }

export default function NewLocationPage() {
  return (
    <>
      <AdminTopbar title="ADD LOCATION" />
      <div className="p-6">
        <ContentForm
          basePath="locations"
          publicPrefix="/locations"
          singular="Location"
          titleField="name"
          sections={locationSections}
          initial={{ name: '', region: '', country_code: '', address: '', hero_badge: '', headline: '', subheadline: '', overview: '', local_factors_json: [], deliverables_json: [], faq_json: [], slug: '', status: 'draft', sort_order: 0, seo_title: '', seo_description: '', og_image_url: '' }}
        />
      </div>
    </>
  )
}
