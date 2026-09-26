// Pure state + persistence for the inline-edit draft buffer's "card" edits —
// changes to rows in services / industries / projects / packages made from the
// public page. Kept out of the React provider so the commit order and error
// reporting are unit-testable.

export type CardTable = 'services' | 'industries' | 'projects' | 'packages'

export interface PendingCreate { tempId: string; table: CardTable; body: Record<string, unknown> }

export interface CardState {
  /** `${table}:${id}` → fields edited so far, as API column names. */
  patches: Record<string, Record<string, unknown>>
  /** `${table}:${id}` → true when the admin deleted the card in this session. */
  removed: Record<string, true>
  created: PendingCreate[]
}

export const EMPTY_CARD_STATE: CardState = { patches: {}, removed: {}, created: [] }

export const cardKey = (table: CardTable, id: string) => `${table}:${id}`

async function send(url: string, method: string, body: Record<string, unknown> | undefined, what: string) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.ok) return
  const data = await res.json().catch(() => null) as { error?: string; details?: Record<string, string[]> } | null
  const detail = data?.details ? Object.values(data.details).flat()[0] : data?.error
  throw new Error(detail ? `${what}: ${detail}` : `${what} failed`)
}

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : 'Something went wrong')

export interface CommitResult {
  /** Only the items that failed — everything else has been persisted and
   *  should stop showing as "Unpublished" even though the batch overall
   *  didn't fully succeed. */
  remaining: CardState
  /** One message per failure, in the order they occurred. */
  errors: string[]
}

/** Persists the buffered card edits: deletes, then field patches, then creates.
 *  Every item is attempted regardless of earlier failures — one bad card (a
 *  duplicate slug, a validation error) must not leave unrelated cards stuck
 *  forever, and must not cause a retry to re-POST a create that already
 *  succeeded (see `remaining`). */
export async function commitCardState(state: CardState): Promise<CommitResult> {
  const remaining: CardState = {
    patches: { ...state.patches },
    removed: { ...state.removed },
    created: [...state.created],
  }
  const errors: string[] = []

  for (const key of Object.keys(state.removed)) {
    const [table, id] = key.split(':')
    try {
      await send(`/api/admin/${table}/${id}`, 'DELETE', undefined, 'Deleting a card')
      delete remaining.removed[key]
      delete remaining.patches[key] // deleted — any pending patch for it is moot
    } catch (err) {
      errors.push(errorMessage(err))
    }
  }
  for (const [key, patch] of Object.entries(state.patches)) {
    if (state.removed[key]) continue // handled (or attempted) above
    const [table, id] = key.split(':')
    try {
      await send(`/api/admin/${table}/${id}`, 'PATCH', patch, 'Saving a card')
      delete remaining.patches[key]
    } catch (err) {
      errors.push(errorMessage(err))
    }
  }
  for (const c of state.created) {
    try {
      await send(`/api/admin/${c.table}`, 'POST', c.body, `Adding "${String(c.body.name ?? c.body.title ?? 'card')}"`)
      remaining.created = remaining.created.filter(x => x.tempId !== c.tempId)
    } catch (err) {
      errors.push(errorMessage(err))
    }
  }

  return { remaining, errors }
}
