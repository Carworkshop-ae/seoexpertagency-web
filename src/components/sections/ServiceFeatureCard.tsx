'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { SERVICE_ICON_MAP, DEFAULT_SERVICE_ICON } from '@/lib/service-icons'
import { EditableText } from '@/components/inline-edit/EditableText'
import type { SEOServiceData } from '@/lib/data/agency-data'

interface ServiceFeatureCardProps {
  service?: Partial<SEOServiceData> & {
    name?: string
    slug?: string
    shortDescription?: string
    icon?: string
  }
}

async function patchService(id: string, field: 'name' | 'short_description', value: string) {
  const res = await fetch(`/api/admin/services/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ [field]: value }),
  })
  if (!res.ok) throw new Error('Save failed')
}

export function ServiceFeatureCard({ service }: ServiceFeatureCardProps) {
  const router = useRouter()
  const name = service?.name || 'SEO Service'
  const description = service?.shortDescription || ''
  const iconKey = service?.icon || 'search'
  const Icon = SERVICE_ICON_MAP[iconKey] || DEFAULT_SERVICE_ICON
  const id = service?.id

  async function save(field: 'name' | 'short_description', value: string) {
    if (!id) return
    try {
      await patchService(id, field, value)
      toast.success('Saved')
      router.refresh()
    } catch {
      toast.error('Save failed — please try again')
    }
  }

  return (
    <div className="card-premium flex flex-col p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 transition-all duration-200">
      <div className="w-12 h-12 rounded-xl bg-primary-50 ring-1 ring-primary-200/60 flex items-center justify-center mb-5">
        <Icon className="w-6 h-6 text-primary" strokeWidth={1.8} />
      </div>

      <EditableText
        as="h3"
        className="text-base sm:text-lg font-bold text-dark mb-2"
        value={name}
        onSave={id ? v => save('name', v) : undefined}
      />

      {(description || id) && (
        <EditableText
          as="p"
          multiline
          className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed"
          value={description}
          onSave={id ? v => save('short_description', v) : undefined}
        />
      )}
    </div>
  )
}
