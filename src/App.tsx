import { useState, useCallback } from 'react'
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
  const { updateItem, deleteItem, addItem } = useUpdateItem(items, setItems)

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: null, direction: 'asc' })
  const [showAddModal, setShowAddModal] = useState(false)

  function handleSortChange(col: keyof NestingItem) {
    setSortConfig((prev) => ({
      column: col,
      direction: prev.column === col && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  function handleResetSort() {
    setSortConfig({ column: null, direction: 'asc' })
  }

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
          onDelete={deleteItem}
          onReorder={handleReorder}
        />
      </main>

      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-milo-coral text-white shadow-lg hover:bg-milo-coral-dark active:scale-95 transition-all flex items-center justify-center z-40"
        aria-label="הוסף פריט"
      >
        <Plus className="w-7 h-7" />
      </button>

      {showAddModal && (
        <AddItemModal
          onAdd={addItem}
          onClose={() => setShowAddModal(false)}
          maxSortOrderByCategory={maxSortOrderByCategory}
        />
      )}
    </div>
  )
}
