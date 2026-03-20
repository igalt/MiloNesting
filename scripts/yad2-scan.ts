#!/usr/bin/env tsx
/**
 * Yad2 marketplace scanner — runs twice a day via launchd.
 * Searches yad2.co.il/market for each second_hand item,
 * sorts by distance from Zikhron Yaacov then price asc,
 * saves top results to Supabase.
 *
 * Setup:
 *   1. npx tsx scripts/yad2-scan.ts   (test run)
 *   2. launchctl load ~/Library/LaunchAgents/com.milonesting.yad2scan.plist
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import { getSearchTerms } from '../src/data/yad2Aliases'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
puppeteer.use(StealthPlugin())

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing VITE_SUPABASE_URL / SUPABASE_SERVICE_KEY (or VITE_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Distance helpers ────────────────────────────────────────────────
const HOME_LAT = 32.5705
const HOME_LON = 34.9507  // Zikhron Yaacov

const CITY_COORDS: Record<string, [number, number]> = {
  'זכרון יעקב': [32.570, 34.951],
  'חריש': [32.458, 35.024],
  'פרדס חנה כרכור': [32.471, 34.965],
  'בנימינה': [32.521, 34.945],
  'עתלית': [32.693, 34.941],
  'טירת כרמל': [32.763, 34.970],
  'חיפה': [32.794, 34.989],
  'קריית ביאליק': [32.839, 35.079],
  'קריית אתא': [32.809, 35.108],
  'קריית מוצקין': [32.836, 35.077],
  'עכו': [32.925, 35.082],
  'נהריה': [33.007, 35.099],
  'כרמיאל': [32.916, 35.296],
  'נצרת': [32.700, 35.303],
  'עפולה': [32.608, 35.289],
  'מגדל העמק': [32.681, 35.238],
  'נתניה': [32.329, 34.858],
  'הרצליה': [32.165, 34.843],
  'כפר סבא': [32.178, 34.908],
  'רעננה': [32.184, 34.871],
  'הוד השרון': [32.151, 34.889],
  'ראש העין': [32.096, 34.957],
  'פתח תקווה': [32.084, 34.888],
  'תל אביב': [32.080, 34.780],
  'רמת גן': [32.070, 34.824],
  'גבעתיים': [32.067, 34.811],
  'בני ברק': [32.084, 34.834],
  'חולון': [32.011, 34.780],
  'בת ים': [32.022, 34.751],
  'אור יהודה': [32.028, 34.856],
  'יהוד': [32.030, 34.888],
  'ראשון לציון': [31.973, 34.789],
  'רחובות': [31.894, 34.808],
  'לוד': [31.952, 34.894],
  'רמלה': [31.929, 34.873],
  'מודיעין': [31.898, 35.010],
  'נס ציונה': [31.928, 34.797],
  'יבנה': [31.877, 34.742],
  'אשדוד': [31.804, 34.650],
  'גדרה': [31.809, 34.778],
  'אשקלון': [31.669, 34.572],
  'ירושלים': [31.768, 35.214],
  'בית שמש': [31.747, 34.988],
  'באר שבע': [31.252, 34.791],
  'טבריה': [32.793, 35.531],
  'צפת': [32.964, 35.496],
  'קריית שמונה': [33.207, 35.569],
  'אילת': [29.558, 34.952],
}

function distKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

interface RawListing {
  title: string
  price: string | null
  url: string | null
  city: string | null
  distance_km: number | null
}

// ── Yad2 scraper (puppeteer) ────────────────────────────────────────
let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
    })
  }
  return browser
}

async function searchYad2(term: string): Promise<RawListing[]> {
  const b = await getBrowser()
  const page = await b.newPage()
  try {
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    )
    const url = `https://www.yad2.co.il/market/search?q=${encodeURIComponent(term)}`
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 })

    const { title, items } = await page.evaluate(() => {
      const nd = (window as any).__NEXT_DATA__
      const pages =
        nd?.props?.pageProps?.dehydratedState?.queries?.[0]?.state?.data?.pages ?? []
      return { title: document.title, items: pages.flatMap((p: any) => p.items ?? []) }
    }) as { title: string; items: any[] }

    if (!items.length) {
      console.warn(`  ⚠️  0 items for "${term}" (page title: "${title}")`)
      return []
    }

    return items
      .map((i: any) => {
        const city = i.address?.city?.textHeb ?? null
        const coords = city ? CITY_COORDS[city] : undefined
        const km = coords ? Math.round(distKm(HOME_LAT, HOME_LON, coords[0], coords[1])) : null
        return {
          title: i.title ?? '?',
          price: i.price != null ? `₪${Number(i.price).toLocaleString('he-IL')}` : null,
          url: `https://www.yad2.co.il/market/item/${i.id}`,
          city,
          distance_km: km,
        }
      })
      .sort((a, b) => {
        const aDist = a.distance_km ?? 999
        const bDist = b.distance_km ?? 999
        if (aDist !== bDist) return aDist - bDist
        const aPrice = a.price ? Number(a.price.replace(/[^\d]/g, '')) : 999999
        const bPrice = b.price ? Number(b.price.replace(/[^\d]/g, '')) : 999999
        return aPrice - bPrice
      })
      .slice(0, 8)
  } catch (e: any) {
    console.warn(`  ⚠️  puppeteer failed for "${term}": ${e.message}`)
    return []
  } finally {
    await page.close()
  }
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  const startTime = Date.now()
  console.log(`🔍 Yad2 scan started — ${new Date().toLocaleString('he-IL')}`)

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

    for (const term of terms.slice(0, 2)) {
      await new Promise((r) => setTimeout(r, 800))
      const listings = await searchYad2(term)

      if (listings.length > 0) {
        const rows = listings.map((l) => ({
          item_id: item.id,
          title: l.title,
          price: l.price,
          url: l.url,
          city: l.city,
          distance_km: l.distance_km,
          search_term: term,
          is_read: false,
        }))

        const { error: insertError } = await supabase.from('yad2_listings').insert(rows)
        if (insertError) {
          console.error(`  ❌ Insert failed for "${item.name_he}":`, insertError.message)
        } else {
          console.log(
            `  ✅ "${item.name_he}" (${term}) → ${listings.length} תוצאות | קרוב ביותר: ${listings[0].city ?? '?'} ${listings[0].distance_km != null ? `~${listings[0].distance_km}km` : ''} ${listings[0].price ?? ''}`
          )
          totalFound += listings.length
        }
        found = true
        break
      }
    }

    if (!found) console.log(`  — "${item.name_he}" → אין תוצאות`)
  }

  // Clean up: keep only the latest 20 listings per item
  for (const item of targets) {
    const { data: old } = await supabase
      .from('yad2_listings')
      .select('id, found_at')
      .eq('item_id', item.id)
      .order('found_at', { ascending: false })
      .range(20, 1000)

    if (old && old.length > 0) {
      await supabase
        .from('yad2_listings')
        .delete()
        .in('id', old.map((r: any) => r.id))
    }
  }

  if (browser) await browser.close()

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`\n✅ סיום — ${totalFound} ממצאים נשמרו (${elapsed}s)`)
}

main().catch(console.error)
