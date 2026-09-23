import { stripHTML } from '@/lib/sanitize'
import type { FAQItem } from '@/types'

// SEO team members often paste AI-written page copy that already includes an
// FAQ section as plain "Q: ... / A: ..." paragraphs, into the freeform Long
// Description field, instead of using the dedicated FAQ repeater. Rendered as
// prose that looks like a raw text dump instead of the site's FAQ accordion.
// This extracts those Q/A pairs out of arbitrary rich-text HTML so callers can
// render them through the real FAQ component and strip them from the prose.

const HEADING_RE = /<h[2-4][^>]*>\s*Frequently Asked Questions\s*<\/h[2-4]>/i
const NEXT_HEADING_RE = /<h[2-4][^>]*>/i
const PARAGRAPH_RE = /<p[^>]*>([\s\S]*?)<\/p>/gi

function pairsFromParagraphs(paragraphHtmls: string[]): { pairs: { question: string; answer: string }[]; consumed: boolean[] } {
  const texts = paragraphHtmls.map(stripHTML)
  const consumed = texts.map(() => false)
  const pairs: { question: string; answer: string }[] = []

  for (let i = 0; i < texts.length; i++) {
    if (consumed[i] || !/^Q:/i.test(texts[i])) continue
    const next = texts[i + 1] ?? ''
    if (!/^A:/i.test(next)) continue
    pairs.push({
      question: texts[i].replace(/^Q:\s*/i, '').trim(),
      answer: next.replace(/^A:\s*/i, '').trim(),
    })
    consumed[i] = true
    consumed[i + 1] = true
    i++
  }

  return { pairs, consumed }
}

export function extractEmbeddedFaqs(html: string): { cleanHtml: string; faqs: FAQItem[] } {
  if (!html) return { cleanHtml: html, faqs: [] }

  const faqs: FAQItem[] = []
  let cleanHtml = html

  // Primary case: an explicit "Frequently Asked Questions" heading followed by
  // Q:/A: paragraphs, up to the next heading (or end of the document).
  const headingMatch = cleanHtml.match(HEADING_RE)
  if (headingMatch && headingMatch.index !== undefined) {
    const start = headingMatch.index
    const afterHeading = start + headingMatch[0].length
    const rest = cleanHtml.slice(afterHeading)
    const nextHeadingMatch = rest.match(NEXT_HEADING_RE)
    const end = nextHeadingMatch && nextHeadingMatch.index !== undefined
      ? afterHeading + nextHeadingMatch.index
      : cleanHtml.length

    const block = cleanHtml.slice(afterHeading, end)
    const paragraphs = [...block.matchAll(PARAGRAPH_RE)].map(m => m[1])
    const { pairs } = pairsFromParagraphs(paragraphs)

    if (pairs.length > 0) {
      faqs.push(...pairs)
      cleanHtml = cleanHtml.slice(0, start) + cleanHtml.slice(end)
    }
  }

  // Fallback case: no heading, but a run of 2+ consecutive Q:/A: paragraph
  // pairs pasted directly into the body — covers a writer who drops in just
  // the raw Q&A block with no "Frequently Asked Questions" heading at all.
  if (faqs.length === 0) {
    const allParagraphs = [...cleanHtml.matchAll(PARAGRAPH_RE)]
    const paragraphHtmls = allParagraphs.map(m => m[1])
    const { pairs, consumed } = pairsFromParagraphs(paragraphHtmls)

    if (pairs.length >= 2) {
      faqs.push(...pairs)
      // Remove only the consumed Q/A paragraphs, preserving everything else.
      let result = ''
      let cursor = 0
      allParagraphs.forEach((m, i) => {
        if (m.index === undefined) return
        if (consumed[i]) {
          result += cleanHtml.slice(cursor, m.index)
          cursor = m.index + m[0].length
        }
      })
      result += cleanHtml.slice(cursor)
      cleanHtml = result
    }
  }

  return { cleanHtml, faqs }
}

export function mergeFaqs(existing: FAQItem[], extracted: FAQItem[]): FAQItem[] {
  const seen = new Set(existing.map(f => f.question.trim().toLowerCase()))
  const merged = [...existing]
  for (const item of extracted) {
    const key = item.question.trim().toLowerCase()
    if (!seen.has(key)) {
      merged.push(item)
      seen.add(key)
    }
  }
  return merged
}
