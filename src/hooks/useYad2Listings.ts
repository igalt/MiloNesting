import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { USE_LOCAL } from './useItems'
import type { Yad2Listing } from '../types'

/** Fetches Yad2 listings for a single item, with real-time updates. */
export function useYad2Listings(itemId: string) {
  const [listings, setListings] = useState<Yad2Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (USE_LOCAL) {
      setLoading(false)
      return
    }

    // Initial fetch
    supabase
      .from('yad2_listings')
      .select('*')
      .eq('item_id', itemId)
      .order('found_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setListings((data as Yad2Listing[]) ?? [])
        setLoading(false)
      })

    // Real-time subscription for new listings
    const channel = supabase
      .channel(`yad2_listings:${itemId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'yad2_listings', filter: `item_id=eq.${itemId}` },
        (payload) => {
          setListings((prev) => [payload.new as Yad2Listing, ...prev].slice(0, 10))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [itemId])

  async function markRead(id: string) {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, is_read: true } : l)))
    await supabase.from('yad2_listings').update({ is_read: true }).eq('id', id)
  }

  const unreadCount = listings.filter((l) => !l.is_read).length

  return { listings, loading, unreadCount, markRead }
}
