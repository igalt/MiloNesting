import { createClient } from '@supabase/supabase-js'
import type { NestingItem, NewNestingItem } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Only create client when real credentials are present
export const supabase = (supabaseUrl && supabaseUrl !== 'https://your-project.supabase.co')
  ? createClient(supabaseUrl, supabaseAnonKey!)
  : null as unknown as ReturnType<typeof createClient>

export type Database = {
  public: {
    Tables: {
      nesting_items: {
        Row: NestingItem
        Insert: NewNestingItem
        Update: Partial<NewNestingItem>
      }
    }
  }
}
