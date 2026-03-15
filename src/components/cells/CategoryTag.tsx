import { CATEGORY_LABELS, CATEGORY_EMOJIS } from '../../lib/constants'
import type { Category } from '../../types'

const COLORS: Record<Category, string> = {
  stroller: 'bg-milo-sky text-sky-700',
  safety_travel: 'bg-milo-lavender text-purple-700',
  sleep: 'bg-milo-mint text-teal-700',
  changing: 'bg-milo-blush text-pink-700',
  diapers: 'bg-milo-sunshine text-amber-700',
  bath: 'bg-milo-sky text-blue-700',
  care_hygiene: 'bg-milo-lavender text-indigo-700',
  feeding: 'bg-milo-blush text-rose-700',
  clothing: 'bg-milo-mint text-green-700',
  toys_activities: 'bg-milo-sunshine text-orange-700',
  hospital_bag: 'bg-milo-coral text-white',
}

interface CategoryTagProps {
  category: Category
}

export function CategoryTag({ category }: CategoryTagProps) {
  return (
    <span className={`category-chip ${COLORS[category]}`}>
      <span>{CATEGORY_EMOJIS[category]}</span>
      <span className="hidden sm:inline">{CATEGORY_LABELS[category]}</span>
    </span>
  )
}
