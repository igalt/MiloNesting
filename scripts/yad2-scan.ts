#!/usr/bin/env tsx
/**
 * Yad2 scanner — runs twice a day via cron.
 * For each item with second_hand acquisition type, searches Yad2
 * across multiple aliases and saves new listings to Supabase.
 *
 * Setup:
 *   1. cp .env.local.example .env.local  (fill in credentials)
 *   2. npx tsx scripts/yad2-scan.ts      (test run)
 *   3. crontab -e  →  0 8,20 * * * cd /path/to/MiloNesting && npx tsx scripts/yad2-scan.ts
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { getSearchTerms } from '../src/data/yad2Aliases'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing VITE_SUPABASE_URL / SUPABASE_SERVICE_KEY (or VITE_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

interface RawListing {
  title: string
  price: string | null
  url: string | null
}

/** Search Yad2 baby section via their internal API */
async function searchYad2(term: string): Promise<RawListing[]> {
  const encoded = encodeURIComponent(term)

  // Try Yad2's internal search API (used by their own frontend)
  const endpoints = [
    `https://gw.yad2.co.il/feed-search-legacy/baby?q=${encoded}&page=1&rows=8`,
    `https://www.yad2.co.il/api/pre-load/getFeedIndex/baby?q=${encoded}&page=1`,
  ]

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          Accept: 'application/json',
          Referer: 'https://www.yad2.co.il/',
        },
      })
      if (!res.ok) continue

      const data = await res.json()
      const list: any[] =
        data?.data?.feed?.list ??
        data?.data?.getFeedIndex?.feed?.list ??
        data?.feed?.list ??
        []

      const results = list
        .filter((i: any) => i.type !== 'commercial_ad' && i.type !== 'ad')
        .slice(0, 5)
        .map((i: any) => ({
          title: i.title ?? i.metaData?.title ?? i.line1 ?? '?',
          price: i.price != null ? `₪${Number(i.price).toLocaleString('he-IL')}` : null,
          url: i.link ? `https://www.yad2.co.il${i.link}` : null,
        }))

      if (results.length > 0) return results
    } catch {
      // try next endpoint
    }
  }
  return []
}

async function main() {
  const startTime = Date.now()
  console.log(`🔍 Yad2 scan started — ${new Date().toLocaleString('he-IL')}`)

  // Fetch all second_hand items that are not yet acquired
  const { data: items, error } = await supabase
    .from('nesting_items')
    .select('id, name_he, name_en, acquisition_types, got_it')

  if (error || !items) {
    console.error('❌ Failed to fetch items:', error?.message)
    process.exit(1)
  }

  const targets = items.filter(
    (i: any) =>
      !i.got_it &&
      Array.isArray(i.acquisition_types) &&
      i.acquisition_types.includes('second_hand')
  )

  console.log(`📋 Scanning ${targets.length} items...`)

  let totalFound = 0

  for (const item of targets) {
    const terms = getSearchTerms(item.name_he, item.name_en)
    let found = false

    for (const term of terms.slice(0, 3)) {
      await new Promise((r) => setTimeout(r, 600)) // polite delay
      const listings = await searchYad2(term)

      if (listings.length > 0) {
        // Save to Supabase
        const rows = listings.map((l) => ({
          item_id: item.id,
          title: l.title,
          price: l.price,
          url: l.url,
          search_term: term,
          is_read: false,
        }))

        const { error: insertError } = await supabase.from('yad2_listings').insert(rows)
        if (insertError) {
          console.error(`  ❌ Insert failed for "${item.name_he}":`, insertError.message)
        } else {
          console.log(`  ✅ "${item.name_he}" (${term}) → ${listings.length} תוצאות`)
          totalFound += listings.length
        }
        found = true
        break
      }
    }

    if (!found) {
      console.log(`  — "${item.name_he}" → אין תוצאות`)
    }
  }

  // Clean up: keep only the latest 15 listings per item to avoid DB bloat
  for (const item of targets) {
    const { data: old } = await supabase
      .from('yad2_listings')
      .select('id, found_at')
      .eq('item_id', item.id)
      .order('found_at', { ascending: false })
      .range(15, 1000)

    if (old && old.length > 0) {
      await supabase
        .from('yad2_listings')
        .delete()
        .in('id', old.map((r: any) => r.id))
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`\n✅ סיום — ${totalFound} ממצאים נשמרו (${elapsed}s)`)
}

main().catch(console.error)
