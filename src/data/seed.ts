import { createClient } from '@supabase/supabase-js'
import { seedItems } from './seedItems'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
  // Check if already seeded
  const { count } = await supabase
    .from('nesting_items')
    .select('*', { count: 'exact', head: true })

  if (count && count > 0) {
    console.log(`✅ Already seeded with ${count} items. Skipping.`)
    return
  }

  console.log(`🌱 Seeding ${seedItems.length} items...`)
  const { error } = await supabase.from('nesting_items').insert(seedItems)

  if (error) {
    console.error('❌ Seed failed:', error.message)
    process.exit(1)
  }

  console.log(`✅ Seeded ${seedItems.length} items successfully!`)
}

seed()
