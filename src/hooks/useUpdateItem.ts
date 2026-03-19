import { useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { localUpdate, localDelete, localInsert } from '../lib/localStore'
import { USE_LOCAL } from './useItems'
import type { NestingItem } from '../types'

export function useUpdateItem(
  items: NestingItem[],
  setItems: React.Dispatch<React.SetStateAction<NestingItem[]>>
) {
  const updateItem = useCallback(
    async (id: string, updates: Partial<NestingItem>) => {
      // Optimistic update
      const previous = items.find((i) => i.id === id)
      setItems((prev) =>
        prev
          .map((item) => (item.id === id ? { ...item, ...updates } : item))
          .sort((a, b) => a.sort_order - b.sort_order)
      )

      if (USE_LOCAL) {
        localUpdate(id, updates)
        return
      }

      const { error } = await supabase.from('nesting_items').update(updates).eq('id', id)

      if (error && previous) {
        setItems((prev) => prev.map((item) => (item.id === id ? previous : item)))
        console.error('Update failed:', error.message)
      }
    },
    [items, setItems]
  )

  const deleteItem = useCallback(
    async (id: string): Promise<NestingItem | null> => {
      const target = items.find((i) => i.id === id) ?? null
      const previous = [...items]
      setItems((prev) => prev.filter((item) => item.id !== id))

      if (USE_LOCAL) {
        localDelete(id)
        return target
      }

      const { error } = await supabase.from('nesting_items').delete().eq('id', id)
      if (error) {
        setItems(previous)
        console.error('Delete failed:', error.message)
        return null
      }
      return target
    },
    [items, setItems]
  )

  const restoreItem = useCallback(
    async (item: NestingItem) => {
      setItems((prev) =>
        [...prev, item].sort((a, b) => a.sort_order - b.sort_order)
      )

      if (USE_LOCAL) {
        localInsert(item)
        return
      }

      const { error } = await supabase.from('nesting_items').insert(item)
      if (error) {
        setItems((prev) => prev.filter((i) => i.id !== item.id))
        console.error('Restore failed:', error.message)
      }
    },
    [setItems]
  )

  const addItem = useCallback(
    async (newItem: Omit<NestingItem, 'id' | 'created_at' | 'updated_at'>) => {
      if (USE_LOCAL) {
        const inserted = localInsert(newItem)
        setItems((prev) =>
          [...prev, inserted].sort((a, b) => a.sort_order - b.sort_order)
        )
        return inserted
      }

      const { data, error } = await supabase
        .from('nesting_items')
        .insert(newItem)
        .select()
        .single()

      if (error) {
        console.error('Insert failed:', error.message)
        return null
      }
      return data as NestingItem
    },
    [setItems]
  )

  return { updateItem, deleteItem, restoreItem, addItem }
}
