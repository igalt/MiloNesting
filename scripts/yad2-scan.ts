#!/usr/bin/env tsx
/**
 * Yad2 scanner — runs twice a day via scheduled task.
 * For each item with second_hand acquisition type, searches Yad2
 * across multiple search terms and collects new listings.
 *
 * Usage: npx tsx scripts/yad2-scan.ts
 * Env:   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_KEY)
 */

import { createClient } from '@supabase/supabase-js'
import { getSearchTerms } from '../src/data/yad2Aliases'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_KEY / VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

interface Yad2Listing {
  title: string
  price: string
  url: string
  date: string
}

/** Fetch listings from Yad2 for a search term via their undocumented feed API */
async function searchYad2(term: string): Promise<Yad2Listing[]> {
  const encoded = encodeURIComponent(term)
  // Yad2 RSS / search API (baby section)
  const url = `https://www.yad2.co.il/api/pre-load/getFeedIndex/baby?q=${encoded}&page=1`

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MiloNesting/1.0)',
        Accept: 'application/json',
      },
    })
    if (!res.ok) return []
    const data = await res.json()

    // Yad2 returns { data: { feed: { list: [...] } } }
    const list = data?.data?.feed?.list ?? []
    return list
      .filter((item: any) => item.type !== 'ad') // skip promoted ads
      .slice(0, 5) // top 5 per term
      .map((item: any) => ({
        title: item.title ?? item.metaData?.title ?? '?',
        price: item.price ? `₪${item.price}` : 'ללא מחיר',
        url: item.link ? `https://www.yad2.co.il${item.link}` : '',
        date: item.date ?? '',
      }))
  } catch {
    return []
  }
}

async function main() {
  console.log('🔍 Starting Yad2 scan...')

  // Fetch items that have second_hand in acquisition_types
  const { data: items, error } = await supabase
    .from('nesting_items')
    .select('id, name_he, name_en, acquisition_types, got_it')

  if (error || !items) {
    console.error('Failed to fetch items:', error?.message)
    process.exit(1)
  }

  const secondHandItems = items.filter(
    (i: any) =>
      !i.got_it &&
      Array.isArray(i.acquisition_types) &&
      i.acquisition_types.includes('second_hand')
  )

  console.log(`Found ${secondHandItems.length} second-hand items to scan`)

  const results: Array<{
    item: string
    term: string
    listings: Yad2Listing[]
  }> = []

  for (const item of secondHandItems) {
    const terms = getSearchTerms(item.name_he, item.name_en)
    console.log(`  Scanning "${item.name_he}" with ${terms.length} terms...`)

    for (const term of terms.slice(0, 3)) { // max 3 terms per item to avoid rate limiting
      await new Promise((r) => setTimeout(r, 500)) // polite delay
      const listings = await searchYad2(term)
      if (listings.length > 0) {
        results.push({ item: item.name_he, term, listings })
        console.log(`    "${term}" → ${listings.length} results`)
        break // found results for this item, skip other terms
      }
    }
  }

  // Print summary
  console.log('\n📋 Scan complete:')
  if (results.length === 0) {
    console.log('No new listings found.')
    return
  }

  for (const { item, term, listings } of results) {
    console.log(`\n🛍️  ${item} (נמצא עם: "${term}")`)
    for (const l of listings) {
      console.log(`   ${l.price.padEnd(10)} ${l.title.slice(0, 50)}`)
      if (l.url) console.log(`   ${l.url}`)
    }
  }

  // TODO: send email summary via Gmail MCP when integrated
  console.log('\n✅ Done. Set SEND_EMAIL=1 to enable email delivery.')
}

main().catch(console.error)
