import { Search, X } from 'lucide-react'
import {
  CATEGORY_LABELS,
  CATEGORY_EMOJIS,
  CATEGORY_ORDER,
  PRIORITY_LABELS,
  PRIORITY_EMOJIS,
  FOR_WHOM_LABELS,
} from '../../lib/constants'
import type { FilterState, Category, Priority, ForWhom } from '../../types'

interface FilterBarProps {
  filters: FilterState
  onChange: (f: FilterState) => void
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  function toggleCategory(cat: Category) {
    const has = filters.categories.includes(cat)
    onChange({
      ...filters,
      categories: has
        ? filters.categories.filter((c) => c !== cat)
        : [...filters.categories, cat],
    })
  }

  function togglePriority(p: Priority) {
    const has = filters.priorities.includes(p)
    onChange({
      ...filters,
      priorities: has
        ? filters.priorities.filter((x) => x !== p)
        : [...filters.priorities, p],
    })
  }

  function setForWhom(fw: ForWhom | 'all') {
    onChange({ ...filters, forWhom: fw })
  }

  function setGotIt(v: 'all' | 'got' | 'pending') {
    onChange({ ...filters, gotIt: v })
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priorities.length > 0 ||
    filters.forWhom !== 'all' ||
    filters.gotIt !== 'all' ||
    filters.searchText !== ''

  function clearAll() {
    onChange({ categories: [], priorities: [], forWhom: 'all', gotIt: 'all', searchText: '' })
  }

  return (
    <div className="bg-white border-b border-milo-stone-light">
      <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">
        {/* Search + Hide Complete toggle */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-milo-stone pointer-events-none" />
            <input
              type="text"
              placeholder="חיפוש פריט..."
              value={filters.searchText}
              onChange={(e) => onChange({ ...filters, searchText: e.target.value })}
              className="w-full pr-9 pl-3 py-2 rounded-xl border border-milo-stone-light bg-milo-cream text-sm focus:outline-none focus:ring-2 focus:ring-milo-lavender text-right"
            />
          </div>
          <button
            onClick={() => onChange({ ...filters, gotIt: filters.gotIt === 'pending' ? 'all' : 'pending' })}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
              filters.gotIt === 'pending'
                ? 'bg-milo-coral border-milo-coral text-white'
                : 'bg-white border-milo-stone-light text-milo-stone hover:border-milo-coral hover:text-milo-coral'
            }`}
          >
            <span>{filters.gotIt === 'pending' ? '✓' : '👁'}</span>
            <span className="hidden sm:inline">{filters.gotIt === 'pending' ? 'מציג חסרים' : 'הסתר שהושג'}</span>
          </button>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_ORDER.map((cat) => {
            const active = filters.categories.includes(cat)
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`filter-chip ${
                  active
                    ? 'bg-milo-lavender border-milo-lavender text-milo-charcoal active'
                    : 'bg-white border-milo-stone-light text-milo-stone hover:border-milo-lavender hover:text-milo-charcoal'
                }`}
              >
                <span>{CATEGORY_EMOJIS[cat]}</span>
                <span>{CATEGORY_LABELS[cat]}</span>
              </button>
            )
          })}
        </div>

        {/* Priority + ForWhom + GotIt row */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Priority */}
          <span className="text-xs text-milo-stone font-medium">עדיפות:</span>
          {(['must_have', 'nice_to_have', 'question_mark'] as Priority[]).map((p) => {
            const active = filters.priorities.includes(p)
            return (
              <button
                key={p}
                onClick={() => togglePriority(p)}
                className={`filter-chip text-xs ${
                  active
                    ? p === 'must_have'
                      ? 'bg-milo-coral border-milo-coral text-white active'
                      : p === 'nice_to_have'
                      ? 'bg-milo-sage border-milo-sage text-white active'
                      : 'bg-milo-sunshine border-yellow-300 text-milo-charcoal active'
                    : 'bg-white border-milo-stone-light text-milo-stone hover:border-milo-lavender hover:text-milo-charcoal'
                }`}
              >
                {PRIORITY_EMOJIS[p]} {PRIORITY_LABELS[p]}
              </button>
            )
          })}

          <div className="w-px h-5 bg-milo-stone-light mx-1" />

          {/* For whom */}
          <span className="text-xs text-milo-stone font-medium">עבור:</span>
          {(['all', 'baby', 'mother', 'both'] as const).map((fw) => {
            const active = filters.forWhom === fw
            return (
              <button
                key={fw}
                onClick={() => setForWhom(fw)}
                className={`filter-chip text-xs ${
                  active
                    ? 'bg-milo-sky border-milo-sky text-milo-charcoal active'
                    : 'bg-white border-milo-stone-light text-milo-stone hover:border-milo-sky'
                }`}
              >
                {fw === 'all' ? 'הכל' : fw === 'both' ? 'שניהם' : FOR_WHOM_LABELS[fw as ForWhom]}
              </button>
            )
          })}

          <div className="w-px h-5 bg-milo-stone-light mx-1" />

          {/* Got it */}
          {(['all', 'pending', 'got'] as const).map((g) => {
            const active = filters.gotIt === g
            return (
              <button
                key={g}
                onClick={() => setGotIt(g)}
                className={`filter-chip text-xs ${
                  active
                    ? 'bg-milo-mint border-milo-mint text-milo-charcoal active'
                    : 'bg-white border-milo-stone-light text-milo-stone hover:border-milo-mint'
                }`}
              >
                {g === 'all' ? '✓ הכל' : g === 'got' ? '✓ יש לנו' : '⏳ חסר'}
              </button>
            )
          })}

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-milo-coral hover:text-milo-coral-dark transition-colors mr-2"
            >
              <X className="w-3 h-3" />
              נקה סינון
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
