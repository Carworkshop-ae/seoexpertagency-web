import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { ContentForm } from '@/components/admin/content/ContentForm'
import { serviceSections } from '@/components/admin/content/specs'

export const metadata = { title: 'New Service' }

export default function NewServicePage() {
  return (
    <>
      <AdminTopbar title="ADD SERVICE" />
      <div className="p-6">
        <ContentForm
          basePath="services"
          singular="Service"
          titleField="name"
          sections={serviceSections}
          initial={{ name: '', short_description: '', icon: '', starting_price_label: '', hero_badge: '', headline: '', subheadline: '', overview: '', problems_json: [], benefits_json: [], process_json: [], deliverables_json: [], faq_json: [], slug: '', status: 'draft', sort_order: 0, seo_title: '', seo_description: '', og_image_url: '' }}
        />
      </div>
    </>
  )
}
