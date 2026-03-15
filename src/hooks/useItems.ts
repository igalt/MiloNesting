import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { localGetAll } from '../lib/localStore'
import type { NestingItem } from '../types'

export const USE_LOCAL =
  !import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co'

export function useItems() {
  const [items, setItems] = useState<NestingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    if (USE_LOCAL) {
      setItems(localGetAll())
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('nesting_items')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setItems(data as NestingItem[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchItems()

    if (USE_LOCAL) return

    const channel = supabase
      .channel('nesting_items_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'nesting_items' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems((prev) =>
              [...prev, payload.new as NestingItem].sort((a, b) => a.sort_order - b.sort_order)
            )
          } else if (payload.eventType === 'UPDATE') {
            setItems((prev) =>
              prev
                .map((item) => (item.id === payload.new.id ? (payload.new as NestingItem) : item))
                .sort((a, b) => a.sort_order - b.sort_order)
            )
          } else if (payload.eventType === 'DELETE') {
            setItems((prev) => prev.filter((item) => item.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchItems])

  return { items, setItems, loading, error }
}
