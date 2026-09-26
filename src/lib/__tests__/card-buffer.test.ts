import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { commitCardState, EMPTY_CARD_STATE, cardKey, type CardState } from '@/lib/inline-edit/card-buffer'

describe('commitCardState', () => {
  const calls: Array<{ url: string; method: string; body?: unknown }> = []
  beforeEach(() => {
    calls.length = 0
    vi.stubGlobal('fetch', vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, method: init.method ?? 'GET', body: init.body ? JSON.parse(String(init.body)) : undefined })
      return { ok: true, json: async () => ({}) }
    }))
  })
  afterEach(() => vi.unstubAllGlobals())

  it('does nothing for an empty buffer', async () => {
    const result = await commitCardState(EMPTY_CARD_STATE)
    expect(calls).toEqual([])
    expect(result).toEqual({ remaining: EMPTY_CARD_STATE, errors: [] })
  })

  it('deletes, then patches, then creates — and skips patches for deleted cards', async () => {
    const state: CardState = {
      patches: {
        [cardKey('industries', 'a')]: { name: 'A2' },
        [cardKey('industries', 'gone')]: { name: 'never sent' },
      },
      removed: { [cardKey('industries', 'gone')]: true },
      created: [{ tempId: 'new-1', table: 'services', body: { name: 'New' } }],
    }
    const result = await commitCardState(state)
    expect(calls.map(c => `${c.method} ${c.url}`)).toEqual([
      'DELETE /api/admin/industries/gone',
      'PATCH /api/admin/industries/a',
      'POST /api/admin/services',
    ])
    expect(calls[1].body).toEqual({ name: 'A2' })
    // Everything succeeded — nothing should be left pending.
    expect(result).toEqual({ remaining: EMPTY_CARD_STATE, errors: [] })
  })

  it('names the failing card with the server message', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({ error: 'The slug "energy" is already in use' }) })))
    const result = await commitCardState({ ...EMPTY_CARD_STATE, created: [{ tempId: 'x', table: 'industries', body: { name: 'Energy' } }] })
    expect(result.errors).toEqual(['Adding "Energy": The slug "energy" is already in use'])
    // The failed create must stay pending so it isn't silently dropped.
    expect(result.remaining.created).toEqual([{ tempId: 'x', table: 'industries', body: { name: 'Energy' } }])
  })

  it('does not let one failing item block unrelated items in the same batch', async () => {
    vi.stubGlobal('fetch', vi.fn(async (_url: string, init: RequestInit) => {
      const body = init.body ? JSON.parse(String(init.body)) as { name?: string } : {}
      if (body.name === 'duplicate-slug') return { ok: false, json: async () => ({ error: 'Slug already in use' }) }
      return { ok: true, json: async () => ({}) }
    }))
    const state: CardState = {
      patches: {},
      removed: {},
      created: [
        { tempId: 'fail', table: 'industries', body: { name: 'duplicate-slug' } },
        { tempId: 'ok', table: 'industries', body: { name: 'Fine' } },
      ],
    }
    const result = await commitCardState(state)
    // The failing create stays pending, but the unrelated one is not blocked.
    expect(result.remaining.created).toEqual([{ tempId: 'fail', table: 'industries', body: { name: 'duplicate-slug' } }])
    expect(result.errors).toHaveLength(1)
  })

  it('does not re-send a create that already succeeded when the remaining state is retried', async () => {
    let attempts = 0
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.includes('/industries')) {
        attempts++
        return attempts === 1 ? { ok: true, json: async () => ({}) } : { ok: false, json: async () => ({ error: 'should not be called again' }) }
      }
      return { ok: false, json: async () => ({ error: 'Slug already in use' }) }
    }))
    const state: CardState = {
      patches: {},
      removed: {},
      created: [
        { tempId: 'ok', table: 'industries', body: { name: 'Fine' } },
        { tempId: 'fail', table: 'services', body: { name: 'duplicate-slug' } },
      ],
    }
    const first = await commitCardState(state)
    expect(first.remaining.created).toEqual([{ tempId: 'fail', table: 'services', body: { name: 'duplicate-slug' } }])

    // Retrying with only what's still pending must not re-POST the succeeded one.
    const second = await commitCardState(first.remaining)
    expect(attempts).toBe(1)
    expect(second.errors).toHaveLength(1)
  })
})
