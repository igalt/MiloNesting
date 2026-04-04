import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { CATEGORY_LABELS, CATEGORY_EMOJIS, CATEGORY_ORDER, PRIORITY_ORDER } from '../../lib/constants'
import type { NestingItem, FilterState, SortConfig, Category } from '../../types'
import { ItemRow } from './ItemRow'

interface ItemTableProps {
  items: NestingItem[]
  filters: FilterState
  sortConfig: SortConfig
  onSortChange: (col: keyof NestingItem) => void
  onUpdate: (id: string, updates: Partial<NestingItem>) => void
  onDelete: (id: string) => void
  onReorder: (activeId: string, overId: string) => void
}

function applyFilters(items: NestingItem[], filters: FilterState): NestingItem[] {
  return items.filter((item) => {
    if (filters.categories.length > 0 && !filters.categories.includes(item.category)) return false
    if (filters.priorities.length > 0 && !filters.priorities.includes(item.priority)) return false
    if (filters.forWhom !== 'all' && item.for_whom !== filters.forWhom) return false
    if (filters.gotIt === 'got' && !item.got_it) return false
    if (filters.gotIt === 'found' && !item.found_it) return false
    if (filters.gotIt === 'pending' && (item.got_it || item.found_it)) return false
    if (filters.searchText) {
      const q = filters.searchText.toLowerCase()
      const searchFields = [
        item.name_he,
        item.name_en,
        item.notes,
        item.borrow_from,
        item.category,
        item.acquisition_type,
        item.priority,
        item.for_whom,
        ...(item.store_links ?? []).flatMap((l) => [l.label, l.url]),
      ]
      const matches = searchFields.some((f) => f?.toLowerCase().includes(q))
      if (!matches) return false
    }
    return true
  })
}

function applySorting(items: NestingItem[], sortConfig: SortConfig): NestingItem[] {
  if (!sortConfig.column) return items

  return [...items].sort((a, b) => {
    const col = sortConfig.column!
    const dir = sortConfig.direction === 'asc' ? 1 : -1

    if (col === 'priority') {
      return (PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority)) * dir
    }
    if (col === 'category') {
      return (CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)) * dir
    }
    if (col === 'got_it') {
      return ((a.got_it ? 1 : 0) - (b.got_it ? 1 : 0)) * dir
    }
    if (col === 'name_he') {
      return a.name_he.localeCompare(b.name_he, 'he') * dir
    }
    return 0
  })
}

export function ItemTable({
  items,
  filters,
  sortConfig,
  onSortChange,
  onUpdate,
  onDelete,
  onReorder,
}: ItemTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const [expandedId, setExpandedId] = useState<string | null>(null)

  const isDragDisabled = sortConfig.column !== null

  const filtered = applyFilters(items, filters)
  const sorted = applySorting(filtered, sortConfig)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    onReorder(String(active.id), String(over.id))
  }

  // Group by category when no sort is active
  const shouldGroup = sortConfig.column === null

  function SortHeader({ col, label }: { col: keyof NestingItem; label: string }) {
    const isActive = sortConfig.column === col
    return (
      <button
        onClick={() => onSortChange(col)}
        className={`text-xs font-medium transition-colors hover:text-milo-coral ${
          isActive ? 'text-milo-coral' : 'text-milo-stone'
        }`}
      >
        {label} {isActive && (sortConfig.direction === 'asc' ? '↑' : '↓')}
      </button>
    )
  }

  if (sorted.length === 0) {
    return (
      <div className="text-center py-16 text-milo-stone">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-sm">לא נמצאו פריטים תואמים לסינון</p>
      </div>
    )
  }

  // Sort header bar
  const header = (
    <div className="flex gap-2 px-3 py-1.5 text-milo-stone text-xs border-b border-milo-stone-light bg-milo-cream/50 sticky top-0 z-10">
      {!isDragDisabled && <span className="w-6" />}
      <span className="w-7" />
      <div className="flex-1">
        <SortHeader col="name_he" label="שם פריט" />
      </div>
      <div className="hidden md:block w-28">
        <SortHeader col="category" label="קטגוריה" />
      </div>
      <div className="hidden sm:block w-16">
        <SortHeader col="for_whom" label="עבור" />
      </div>
      <div className="w-24">
        <SortHeader col="priority" label="עדיפות" />
      </div>
      <div className="w-20">
        <SortHeader col="got_it" label="יש לנו" />
      </div>
      <div className="w-5" />
    </div>
  )

  if (!shouldGroup) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        {header}
        <SortableContext items={sorted.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1 p-2">
            {sorted.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                isDragDisabled={isDragDisabled}
                onUpdate={onUpdate}
                onDelete={onDelete}
                expandedId={expandedId}
                onExpandedChange={setExpandedId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    )
  }

  // Grouped by category
  const grouped: Partial<Record<Category, NestingItem[]>> = {}
  for (const item of sorted) {
    if (!grouped[item.category]) grouped[item.category] = []
    grouped[item.category]!.push(item)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      {header}
      <div className="p-2 space-y-4">
        {CATEGORY_ORDER.map((cat) => {
          const catItems = grouped[cat]
          if (!catItems || catItems.length === 0) return null
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
                <span className="text-lg">{CATEGORY_EMOJIS[cat]}</span>
                <h3 className="font-semibold text-milo-charcoal text-sm">
                  {CATEGORY_LABELS[cat]}
                </h3>
                <span className="text-xs text-milo-stone">
                  ({catItems.filter((i) => i.got_it || i.found_it).length}/{catItems.length})
                </span>
              </div>
              <SortableContext items={catItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1">
                  {(expandedId && catItems.some((i) => i.id === expandedId)
                    ? catItems
                    : [...catItems].sort((a, b) =>
                        PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority) ||
                        a.sort_order - b.sort_order
                      )
                  ).map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      isDragDisabled={isDragDisabled}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      expandedId={expandedId}
                      onExpandedChange={setExpandedId}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          )
        })}
      </div>
    </DndContext>
  )
}
