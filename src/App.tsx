import { useState, useCallback, useRef } from 'react'
import { Plus } from 'lucide-react'
import { useItems } from './hooks/useItems'
import { useUpdateItem } from './hooks/useUpdateItem'
import { Header } from './components/layout/Header'
import { FilterBar } from './components/filters/FilterBar'
import { ItemTable } from './components/table/ItemTable'
import { AddItemModal } from './components/modals/AddItemModal'
import { CATEGORY_SORT_BLOCK } from './lib/constants'
import type { FilterState, NestingItem, SortConfig } from './types'

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  priorities: [],
  forWhom: 'all',
  gotIt: 'all',
  searchText: '',
}

export default function App() {
  const { items, setItems, loading, error } = useItems()
  const { updateItem, deleteItem, restoreItem, addItem } = useUpdateItem(items, setItems)

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: null, direction: 'asc' })
  const [showAddModal, setShowAddModal] = useState(false)
  const [lastDeleted, setLastDeleted] = useState<NestingItem | null>(null)
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSortChange(col: keyof NestingItem) {
    setSortConfig((prev) => ({
      column: col,
      direction: prev.column === col && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  function handleResetSort() {
    setSortConfig({ column: null, direction: 'asc' })
  }

  const handleDelete = useCallback(
    async (id: string) => {
      const deleted = await deleteItem(id)
      if (!deleted) return
      setLastDeleted(deleted)
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
      undoTimerRef.current = setTimeout(() => {
        setLastDeleted(null)
      }, 5000)
    },
    [deleteItem]
  )

  const handleUndo = useCallback(async () => {
    if (!lastDeleted) return
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    setLastDeleted(null)
    await restoreItem(lastDeleted)
  }, [lastDeleted, restoreItem])

  const handleReorder = useCallback(
    async (activeId: string, overId: string) => {
      const activeItem = items.find((i) => i.id === activeId)
      const overItem = items.find((i) => i.id === overId)
      if (!activeItem || !overItem) return

      const sameCategory = items.filter((i) => i.category === activeItem.category)
      const overIndexInCat = sameCategory.findIndex((i) => i.id === overId)

      let newSortOrder: number

      if (overIndexInCat <= 0) {
        newSortOrder = sameCategory[0].sort_order - 500
      } else if (overIndexInCat >= sameCategory.length - 1) {
        newSortOrder = sameCategory[sameCategory.length - 1].sort_order + 1000
      } else {
        const prev = sameCategory[overIndexInCat - 1]
        const next = sameCategory[overIndexInCat]
        newSortOrder = (prev.sort_order + next.sort_order) / 2
      }

      if (overItem.category !== activeItem.category) {
        const blockMax = Math.max(
          ...items.filter((i) => i.category === overItem.category).map((i) => i.sort_order),
          CATEGORY_SORT_BLOCK[overItem.category]
        )
        newSortOrder = blockMax + 1000
      }

      await updateItem(activeId, { sort_order: newSortOrder, category: overItem.category })
    },
    [items, updateItem]
  )

  const maxSortOrderByCategory: Record<string, number> = {}
  for (const item of items) {
    const cur = maxSortOrderByCategory[item.category] ?? 0
    if (item.sort_order > cur) maxSortOrderByCategory[item.category] = item.sort_order
  }

  const gotItCount = items.filter((i) => i.got_it).length

  if (loading) {
    return (
      <div className="min-h-screen bg-milo-cream flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="text-5xl mb-4">🐣</div>
          <p className="text-milo-stone text-sm">טוען את הרשימה...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-milo-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-milo-coral font-medium mb-2">שגיאה בטעינה</p>
          <p className="text-milo-stone text-xs">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-milo-cream" dir="rtl">
      <Header total={items.length} gotIt={gotItCount} />
      <FilterBar filters={filters} onChange={setFilters} />

      {sortConfig.column && (
        <div className="bg-milo-lavender/50 text-center py-1.5 text-xs text-purple-700">
          ממוין לפי עמודה — גרירה מושבתת.{' '}
          <button onClick={handleResetSort} className="underline font-medium hover:text-purple-900">
            חזור לסדר רגיל
          </button>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-2 sm:px-4 py-4">
        <ItemTable
          items={items}
          filters={filters}
          sortConfig={sortConfig}
          onSortChange={handleSortChange}
          onUpdate={updateItem}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />

        {/* Inline add button at bottom of list */}
        <div className="mt-4 mb-24 flex justify-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-dashed border-milo-coral/50 text-milo-coral hover:bg-milo-coral/5 hover:border-milo-coral transition-all text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            הוסף פריט חדש
          </button>
        </div>
      </main>

      {/* FAB — bottom right */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 h-14 rounded-full bg-milo-coral text-white shadow-lg hover:bg-milo-coral-dark active:scale-95 transition-all z-40"
        aria-label="הוסף פריט"
      >
        <Plus className="w-5 h-5" />
        <span className="text-sm font-semibold">הוסף פריט</span>
      </button>

      {showAddModal && (
        <AddItemModal
          onAdd={addItem}
          onClose={() => setShowAddModal(false)}
          maxSortOrderByCategory={maxSortOrderByCategory}
        />
      )}

      {/* Undo toast */}
      {lastDeleted && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className="flex items-center gap-3 bg-milo-charcoal text-white px-4 py-3 rounded-2xl shadow-xl text-sm">
            <span>🗑️ נמחק: {lastDeleted.name_he}</span>
            <button
              onClick={handleUndo}
              className="font-bold text-milo-sunshine hover:text-yellow-300 transition-colors underline"
            >
              ביטול
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
