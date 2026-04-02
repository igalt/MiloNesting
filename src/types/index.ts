export type AcquisitionType = 'buy_new' | 'second_hand' | 'borrow' | 'gift'

export type Priority = 'must_have' | 'nice_to_have' | 'question_mark'

export type ForWhom = 'baby' | 'mother' | 'both'

export type Category =
  | 'stroller'
  | 'safety_travel'
  | 'sleep'
  | 'changing'
  | 'diapers'
  | 'bath'
  | 'care_hygiene'
  | 'feeding'
  | 'clothing'
  | 'toys_activities'
  | 'hospital_bag'

export interface StoreLink {
  label: string
  url: string
}

export interface NestingItem {
  id: string
  name_he: string
  name_en: string | null
  category: Category
  acquisition_types: AcquisitionType[]
  priority: Priority
  for_whom: ForWhom
  got_it: boolean
  found_it: boolean
  borrow_from: string | null
  gift_from: string | null
  store_links: StoreLink[]
  notes: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type NewNestingItem = Omit<NestingItem, 'id' | 'created_at' | 'updated_at'>

export interface Yad2Listing {
  id: string
  item_id: string
  title: string
  price: string | null
  url: string | null
  city: string | null
  distance_km: number | null
  search_term: string
  found_at: string
  is_read: boolean
}

export interface SortConfig {
  column: keyof NestingItem | null
  direction: 'asc' | 'desc'
}

export interface FilterState {
  categories: Category[]
  priorities: Priority[]
  forWhom: ForWhom | 'all'
  gotIt: 'all' | 'got' | 'found' | 'pending'
  searchText: string
}
