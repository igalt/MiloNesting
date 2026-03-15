import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import { CategoryTag } from '../cells/CategoryTag'
import { PriorityBadge } from '../cells/PriorityBadge'
import { GotItCheckbox } from '../cells/GotItCheckbox'
import { ItemRowExpanded } from './ItemRowExpanded'
import { FOR_WHOM_LABELS } from '../../lib/constants'
import type { NestingItem } from '../../types'

interface ItemRowProps {
  item: NestingItem
  isDragDisabled: boolean
  onUpdate: (id: string, updates: Partial<NestingItem>) => void
  onDelete: (id: string) => void
}

export function ItemRow({ item, isDragDisabled, onUpdate, onDelete }: ItemRowProps) {
  const [expanded, setExpanded] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: isDragDisabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl overflow-hidden border transition-all duration-200 ${
        isDragging
          ? 'shadow-xl border-milo-lavender bg-milo-lavender/10 z-50'
          : item.got_it
          ? 'border-milo-mint bg-milo-mint/10 got-it-row'
          : 'border-milo-stone-light bg-white hover:border-milo-lavender hover:shadow-sm'
      }`}
    >
      {/* Main row */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Drag handle (right side, RTL = start) */}
        {!isDragDisabled && (
          <button
            {...attributes}
            {...listeners}
            className="text-milo-stone hover:text-milo-charcoal cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
            aria-label="גרור לשינוי סדר"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        )}

        {/* Got it */}
        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <GotItCheckbox
            checked={item.got_it}
            onChange={(v) => onUpdate(item.id, { got_it: v })}
          />
        </div>

        {/* Name */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => setExpanded((e) => !e)}
        >
          <span className={`text-sm font-medium item-name ${item.got_it ? 'line-through text-milo-stone' : 'text-milo-charcoal'}`}>
            {item.name_he}
          </span>
          {item.name_en && (
            <span className="text-xs text-milo-stone mr-1 hidden sm:inline">({item.name_en})</span>
          )}
        </div>

        {/* Category (hidden on mobile) */}
        <div className="hidden md:block flex-shrink-0">
          <CategoryTag category={item.category} />
        </div>

        {/* For whom badge */}
        <div className="hidden sm:block flex-shrink-0">
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-milo-blush text-milo-coral-dark">
            {FOR_WHOM_LABELS[item.for_whom]}
          </span>
        </div>

        {/* Priority */}
        <div className="flex-shrink-0">
          <PriorityBadge priority={item.priority} />
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex-shrink-0 text-milo-stone hover:text-milo-charcoal transition-colors"
          aria-label={expanded ? 'סגור' : 'פתח פרטים'}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <ItemRowExpanded item={item} onUpdate={onUpdate} onDelete={onDelete} />
      )}
    </div>
  )
}
