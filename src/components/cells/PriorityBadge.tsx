import { PRIORITY_LABELS, PRIORITY_EMOJIS } from '../../lib/constants'
import type { Priority } from '../../types'

const COLORS: Record<Priority, string> = {
  must_have: 'bg-milo-blush text-milo-coral-dark border border-milo-coral',
  nice_to_have: 'bg-milo-mint text-milo-sage-dark border border-milo-sage',
  question_mark: 'bg-milo-sunshine text-amber-700 border border-yellow-300',
}

interface PriorityBadgeProps {
  priority: Priority
  onClick?: (p: Priority) => void
}

export function PriorityBadge({ priority, onClick }: PriorityBadgeProps) {
  const cls = `priority-badge ${COLORS[priority]} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`

  return (
    <span className={cls} onClick={() => onClick?.(priority)}>
      <span>{PRIORITY_EMOJIS[priority]}</span>
      <span>{PRIORITY_LABELS[priority]}</span>
    </span>
  )
}
