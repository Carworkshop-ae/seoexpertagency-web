import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { ContentForm } from '@/components/admin/content/ContentForm'
import { industrySections } from '@/components/admin/content/specs'

export const metadata = { title: 'New Industry' }

export default function NewIndustryPage() {
  return (
    <>
      <AdminTopbar title="ADD INDUSTRY" />
      <div className="p-6">
        <ContentForm
          basePath="industries"
          publicPrefix="/industries"
          singular="Industry"
          titleField="name"
          sections={industrySections}
          initial={{ name: '', short_description: '', icon: '', hero_badge: '', headline: '', subheadline: '', overview: '', challenges_json: [], strategy_json: [], recommended_services: [], deliverables_json: [], faq_json: [], slug: '', status: 'draft', sort_order: 0, seo_title: '', seo_description: '', og_image_url: '' }}
        />
      </div>
    </>
  )
}
