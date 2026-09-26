'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Plus, X } from 'lucide-react'
import { useAdminEdit } from './AdminEditProvider'
import type { FooterLinkItem } from '@/types/settings'

interface Row extends FooterLinkItem { _id: string }

const uid = () => Math.random().toString(36).slice(2)
const toRows = (items: FooterLinkItem[]): Row[] => items.map(item => ({ ...item, _id: uid() }))
const toItems = (rows: Row[]): FooterLinkItem[] => rows.map(({ label, url }) => ({ label, url }))

interface EditableLinkListProps {
  /** website_settings key this list persists to, e.g. "footer_company_links". */
  settingKey: 'footer_company_links' | 'footer_services_links' | 'footer_areas_links'
  /** The effective current list — from the setting if non-empty, else a
   *  caller-computed fallback (e.g. today's live services/locations). */
  items: FooterLinkItem[]
  heading: ReactNode
  headingClassName?: string
  listClassName?: string
  linkClassName?: string
}

// Add/remove/edit-URL editor for one footer link column. Buffered like every
// other inline edit — applied locally and undoable, and PUT to
// /api/admin/settings/bulk (as one JSON array) only on "Done Editing". Hidden
// entirely for a non-admin (or edit-mode-off) view of an empty list, matching
// the column-hides-when-empty convention the rest of Footer.tsx already uses.
export function EditableLinkList({ settingKey, items, heading, headingClassName, listClassName, linkClassName }: EditableLinkListProps) {
  const { isAdmin, editMode, record, registerCommitter } = useAdminEdit()
  const [rows, setRows] = useState<Row[]>(() => toRows(items))
  const rowsRef = useRef<Row[]>(rows)
  const savedRef = useRef<FooterLinkItem[]>(items)

  // Follow the server value when it changes (e.g. after a publish + refresh).
  const [prevItems, setPrevItems] = useState(items)
  if (items !== prevItems) {
    setPrevItems(items)
    setRows(toRows(items))
  }
  useEffect(() => {
    rowsRef.current = rows
  }, [rows])
  useEffect(() => { savedRef.current = items }, [items])

  useEffect(() => {
    if (!isAdmin) return
    return registerCommitter(`setting:${settingKey}`, async () => {
      const plain = toItems(rowsRef.current)
      if (JSON.stringify(plain) === JSON.stringify(savedRef.current)) return
      const res = await fetch('/api/admin/settings/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: [{ key: settingKey, value: plain }] }),
      })
      if (!res.ok) throw new Error(res.status === 403 ? "Your role can't change site settings (footer links)" : 'Saving the footer links failed')
      savedRef.current = plain
    })
  }, [isAdmin, settingKey, registerCommitter])

  function apply(next: Row[], label: string) {
    const prev = rowsRef.current
    rowsRef.current = next
    setRows(next)
    record({
      label,
      undo: () => { rowsRef.current = prev; setRows(prev) },
      redo: () => { rowsRef.current = next; setRows(next) },
    })
  }

  const canEdit = isAdmin && editMode

  if (!canEdit && items.length === 0) return null

  if (!canEdit) {
    return (
      <div>
        <h4 className={headingClassName}>{heading}</h4>
        <ul className={listClassName}>
          {items.map((item, i) => (
            <li key={i}>
              {item.url ? <Link href={item.url} className={linkClassName}>{item.label}</Link> : <span>{item.label}</span>}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      <h4 className={headingClassName}>{heading}</h4>
      <ul className={`${listClassName} !space-y-2`}>
        {rows.map(row => (
          <li key={row._id} className="flex items-start gap-1.5">
            <div className="flex-1 min-w-0 space-y-0.5">
              <input
                key={`${row._id}:label:${row.label}`}
                defaultValue={row.label}
                placeholder="Label"
                aria-label="Link label"
                className="w-full bg-transparent outline-dashed outline-1 outline-offset-1 outline-primary/50 rounded-sm px-1 text-inherit"
                onBlur={e => {
                  const next = e.target.value.trim()
                  if (next === row.label) return
                  apply(rowsRef.current.map(r => r._id === row._id ? { ...r, label: next } : r), 'Edit footer link label')
                }}
              />
              <input
                key={`${row._id}:url:${row.url}`}
                defaultValue={row.url}
                placeholder="/page-url"
                aria-label="Link URL"
                className="w-full bg-transparent outline-dashed outline-1 outline-offset-1 outline-primary/30 rounded-sm px-1 text-[11px] opacity-80"
                onBlur={e => {
                  const next = e.target.value.trim()
                  if (next === row.url) return
                  apply(rowsRef.current.map(r => r._id === row._id ? { ...r, url: next } : r), 'Edit footer link URL')
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => apply(rowsRef.current.filter(r => r._id !== row._id), `Remove "${row.label || 'link'}"`)}
              aria-label={`Remove ${row.label || 'link'}`}
              className="mt-0.5 w-5 h-5 rounded-full bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center shrink-0 transition-colors"
            >
              <X size={11} />
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => apply([...rowsRef.current, { _id: uid(), label: 'New link', url: '' }], 'Add footer link')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-400"
          >
            <Plus size={12} /> Add link
          </button>
        </li>
      </ul>
    </div>
  )
}
