import type { NestingItem, NewNestingItem } from '../types'
import { seedItems } from '../data/seedItems'

const KEY = 'milo_nesting_items'

function uuid(): string {
  return crypto.randomUUID()
}

function now(): string {
  return new Date().toISOString()
}

function load(): NestingItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as NestingItem[]
  } catch {}
  return []
}

function save(items: NestingItem[]): void {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function localGetAll(): NestingItem[] {
  let items = load()
  // Migrate: add found_it if missing from older data
  items = items.map((i) => (i.found_it !== undefined ? i : { ...i, found_it: false }))
  if (items.length === 0) {
    // First run — seed from the built-in list
    const ts = now()
    items = seedItems.map((s) => ({
      ...s,
      id: uuid(),
      created_at: ts,
      updated_at: ts,
    }))
    save(items)
  }
  return items.sort((a, b) => a.sort_order - b.sort_order)
}

export function localUpdate(id: string, updates: Partial<NestingItem>): NestingItem | null {
  const items = load()
  const idx = items.findIndex((i) => i.id === id)
  if (idx === -1) return null
  items[idx] = { ...items[idx], ...updates, updated_at: now() }
  save(items)
  return items[idx]
}

export function localDelete(id: string): void {
  save(load().filter((i) => i.id !== id))
}

export function localInsert(newItem: NewNestingItem): NestingItem {
  const items = load()
  const item: NestingItem = {
    ...newItem,
    id: uuid(),
    created_at: now(),
    updated_at: now(),
  }
  items.push(item)
  save(items)
  return item
}
