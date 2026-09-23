import type { ReactNode } from 'react'
import { ShieldCheck, TrendingUp, Award, BarChart3 } from 'lucide-react'

interface TrustItem {
  icon?: ReactNode
  value: ReactNode
  label: ReactNode
  sublabel?: ReactNode
}

const DEFAULT_SEO_TRUST_ITEMS: TrustItem[] = [
  {
    icon: <TrendingUp className="w-5 h-5 text-primary" />,
    value: 'Data-Driven SEO',
    label: 'Search Strategies',
    sublabel: 'Custom tailored roadmaps',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    value: '100% White-Hat',
    label: 'Safe Link Building',
    sublabel: 'Penalty-proof compliance',
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-primary" />,
    value: 'Transparent ROI',
    label: 'Live Analytics & KPIs',
    sublabel: 'No vanity metric fluff',
  },
  {
    icon: <Award className="w-5 h-5 text-primary" />,
    value: 'Senior Strategists',
    label: 'Dedicated SEO Team',
    sublabel: 'Direct expert access',
  },
]

interface TrustBarProps {
  items?: TrustItem[]
}

// Tailwind's JIT scanner needs literal class names, so the column count per
// item total is a lookup rather than an interpolated `lg:grid-cols-${n}` —
// without this a 4-item bar renders in a 5-col track with a blank trailing
// column, leaving the row looking left-aligned instead of centered.
const LG_COLS_CLASS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
}

export function TrustBar({ items = DEFAULT_SEO_TRUST_ITEMS }: TrustBarProps) {
  const lgColsClass = LG_COLS_CLASS[Math.min(items.length, 5)] ?? 'lg:grid-cols-5'

  return (
    <section className="bg-white py-8 lg:py-10 border-b border-slate-100" aria-label="Agency trust indicators">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className={`grid grid-cols-1 sm:grid-cols-2 ${lgColsClass} gap-4`}>
          {items.map((item, index) => (
            <li
              key={index}
              // items-start (not -center) + no truncate: boxes vary in text
              // length, so a fixed single line was clipping the longer ones
              // ("50% Money-Back Guara…") — wrapping keeps every box the same
              // height within its row (grid rows stretch by default) without
              // cutting text off.
              className="card-premium flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-slate-50/50 hover:bg-white transition-all border border-slate-200/80"
            >
              <div className="shrink-0 h-11 w-11 rounded-xl bg-primary-50 flex items-center justify-center ring-1 ring-primary-200/50">
                {item.icon ?? <TrendingUp className="w-5 h-5 text-primary" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-dark leading-tight">{item.value}</p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{item.label}</p>
                {item.sublabel && <p className="text-[11px] text-slate-400">{item.sublabel}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
