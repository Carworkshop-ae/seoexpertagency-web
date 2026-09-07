import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { ContentTable, type ContentRow } from '@/components/admin/content/ContentTable'
import { createServiceClient } from '@/lib/supabase/service'
import { getActingUser } from '@/lib/auth-guard'

export const metadata = { title: 'Industries' }
export const dynamic = 'force-dynamic'

export default async function IndustryListPage() {
  const acting = await getActingUser()
  const service = createServiceClient()
  const { data } = await service
    .from('industries')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <>
      <AdminTopbar title="Industries" />
      <div className="p-6">
        <ContentTable
          rows={(data ?? []) as unknown as ContentRow[]}
          basePath="industries"
          publicPrefix="/industries"
          singular="Industry"
          plural="Industries"
          canDelete={acting?.role === 'super_admin' || acting?.role === 'admin'}
        />
      </div>
    </>
  )
}
