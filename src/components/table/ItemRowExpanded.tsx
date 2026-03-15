import { useState, useEffect } from 'react'
import { ExternalLink, Trash2, Plus, X } from 'lucide-react'
import { FOR_WHOM_LABELS, CATEGORY_LABELS, CATEGORY_EMOJIS, CATEGORY_ORDER } from '../../lib/constants'
import type { NestingItem, AcquisitionType, Priority, ForWhom, Category, StoreLink } from '../../types'
import { AcquisitionCell } from '../cells/AcquisitionCell'
import { PriorityBadge } from '../cells/PriorityBadge'

interface ItemRowExpandedProps {
  item: NestingItem
  onUpdate: (id: string, updates: Partial<NestingItem>) => void
  onDelete: (id: string) => void
}

const PRIORITY_ORDER: Priority[] = ['must_have', 'nice_to_have', 'question_mark']

export function ItemRowExpanded({ item, onUpdate, onDelete }: ItemRowExpandedProps) {
  const [nameHe, setNameHe] = useState(item.name_he)
  const [nameEn, setNameEn] = useState(item.name_en ?? '')
  const [borrowFrom, setBorrowFrom] = useState(item.borrow_from ?? '')
  const [notes, setNotes] = useState(item.notes ?? '')
  const [storeLinks, setStoreLinks] = useState<StoreLink[]>(item.store_links ?? [])
  const [newLinkLabel, setNewLinkLabel] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [showAddLink, setShowAddLink] = useState(false)

  useEffect(() => { setNameHe(item.name_he) }, [item.name_he])
  useEffect(() => { setNameEn(item.name_en ?? '') }, [item.name_en])
  useEffect(() => { setBorrowFrom(item.borrow_from ?? '') }, [item.borrow_from])
  useEffect(() => { setNotes(item.notes ?? '') }, [item.notes])
  useEffect(() => { setStoreLinks(item.store_links ?? []) }, [item.store_links])

  function handleNameHeBlur() {
    const trimmed = nameHe.trim()
    if (trimmed && trimmed !== item.name_he) onUpdate(item.id, { name_he: trimmed })
  }

  function handleNameEnBlur() {
    const trimmed = nameEn.trim()
    if (trimmed !== (item.name_en ?? '')) onUpdate(item.id, { name_en: trimmed || null })
  }

  function handleBorrowBlur() {
    onUpdate(item.id, { borrow_from: borrowFrom || null })
  }

  function handleNotesBlur() {
    onUpdate(item.id, { notes: notes || null })
  }

  function cycleForWhom() {
    const opts: ForWhom[] = ['baby', 'mother', 'both']
    const idx = opts.indexOf(item.for_whom)
    onUpdate(item.id, { for_whom: opts[(idx + 1) % 3] })
  }

  function cyclePriority() {
    const idx = PRIORITY_ORDER.indexOf(item.priority)
    onUpdate(item.id, { priority: PRIORITY_ORDER[(idx + 1) % 3] })
  }

  function addStoreLink() {
    const label = newLinkLabel.trim()
    const url = newLinkUrl.trim()
    if (!label || !url) return
    const updated = [...storeLinks, { label, url }]
    setStoreLinks(updated)
    onUpdate(item.id, { store_links: updated })
    setNewLinkLabel('')
    setNewLinkUrl('')
    setShowAddLink(false)
  }

  function removeStoreLink(index: number) {
    const updated = storeLinks.filter((_, i) => i !== index)
    setStoreLinks(updated)
    onUpdate(item.id, { store_links: updated })
  }

  function updateStoreLink(index: number, field: 'label' | 'url', value: string) {
    const updated = storeLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    )
    setStoreLinks(updated)
  }

  function saveStoreLinkOnBlur() {
    onUpdate(item.id, { store_links: storeLinks })
  }

  return (
    <div className="animate-slide-down px-4 pb-4 bg-gradient-to-b from-white to-milo-cream/50 border-b border-milo-stone-light">
      {/* ── Name fields + Category ─────────────────────────── */}
      <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 pb-4 border-b border-milo-stone-light/50">
        {/* Hebrew name */}
        <div>
          <label className="text-xs text-milo-stone mb-1 block">שם בעברית</label>
          <input
            type="text"
            value={nameHe}
            onChange={(e) => setNameHe(e.target.value)}
            onBlur={handleNameHeBlur}
            className="w-full px-3 py-1.5 rounded-lg border border-milo-stone-light bg-white text-sm focus:outline-none focus:ring-2 focus:ring-milo-lavender text-right font-medium"
          />
        </div>

        {/* English name */}
        <div>
          <label className="text-xs text-milo-stone mb-1 block">שם באנגלית (אופציונלי)</label>
          <input
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            onBlur={handleNameEnBlur}
            placeholder="English name..."
            className="w-full px-3 py-1.5 rounded-lg border border-milo-stone-light bg-white text-sm focus:outline-none focus:ring-2 focus:ring-milo-lavender text-left"
            dir="ltr"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs text-milo-stone mb-1 block">קטגוריה</label>
          <select
            value={item.category}
            onChange={(e) => onUpdate(item.id, { category: e.target.value as Category })}
            className="w-full px-3 py-1.5 rounded-lg border border-milo-stone-light bg-white text-sm focus:outline-none focus:ring-2 focus:ring-milo-lavender text-right appearance-none cursor-pointer"
          >
            {CATEGORY_ORDER.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_EMOJIS[cat]} {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Main fields grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-3">
          {/* Acquisition type */}
          <div>
            <label className="text-xs text-milo-stone mb-1 block">אופן השגה</label>
            <AcquisitionCell
              value={item.acquisition_type}
              onChange={(v: AcquisitionType) => onUpdate(item.id, { acquisition_type: v })}
            />
          </div>

          {/* Borrow from (only when borrow) */}
          {item.acquisition_type === 'borrow' && (
            <div>
              <label className="text-xs text-milo-stone mb-1 block">מאת (ממי שואלים)</label>
              <input
                type="text"
                value={borrowFrom}
                onChange={(e) => setBorrowFrom(e.target.value)}
                onBlur={handleBorrowBlur}
                placeholder="שם החבר / משפחה..."
                className="w-full px-3 py-1.5 rounded-lg border border-milo-sage bg-milo-mint/20 text-sm focus:outline-none focus:ring-2 focus:ring-milo-sage text-right"
              />
            </div>
          )}

          {/* Store links manager (only when buy_new) */}
          {item.acquisition_type === 'buy_new' && (
            <div>
              <label className="text-xs text-milo-stone mb-1 block">היכן לקנות</label>
              <div className="space-y-2">
                {storeLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateStoreLink(i, 'label', e.target.value)}
                      onBlur={saveStoreLinkOnBlur}
                      placeholder="שם החנות..."
                      className="flex-1 min-w-0 px-2 py-1 rounded-lg border border-milo-stone-light text-xs focus:outline-none focus:ring-1 focus:ring-milo-sky text-right"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateStoreLink(i, 'url', e.target.value)}
                      onBlur={saveStoreLinkOnBlur}
                      placeholder="https://..."
                      className="flex-1 min-w-0 px-2 py-1 rounded-lg border border-milo-stone-light text-xs focus:outline-none focus:ring-1 focus:ring-milo-sky text-left"
                      dir="ltr"
                    />
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-sky-500 hover:text-sky-700 transition-colors shrink-0"
                      title="פתח קישור"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => removeStoreLink(i)}
                      className="p-1 text-red-400 hover:text-red-600 transition-colors shrink-0"
                      title="מחק קישור"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Add new link */}
                {showAddLink ? (
                  <div className="space-y-1.5 p-2 rounded-lg bg-milo-sky/20 border border-milo-sky">
                    <input
                      type="text"
                      value={newLinkLabel}
                      onChange={(e) => setNewLinkLabel(e.target.value)}
                      placeholder="שם החנות (למשל: ksp, ivory)"
                      autoFocus
                      className="w-full px-2 py-1 rounded border border-milo-stone-light text-xs focus:outline-none focus:ring-1 focus:ring-milo-sky text-right"
                    />
                    <input
                      type="url"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addStoreLink()}
                      placeholder="https://..."
                      className="w-full px-2 py-1 rounded border border-milo-stone-light text-xs focus:outline-none focus:ring-1 focus:ring-milo-sky text-left"
                      dir="ltr"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addStoreLink}
                        className="flex-1 py-1 rounded bg-milo-sky text-sky-800 text-xs font-medium hover:bg-sky-200 transition-colors"
                      >
                        הוסף
                      </button>
                      <button
                        onClick={() => { setShowAddLink(false); setNewLinkLabel(''); setNewLinkUrl('') }}
                        className="py-1 px-2 rounded border border-milo-stone-light text-xs text-milo-stone hover:bg-milo-cream transition-colors"
                      >
                        ביטול
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddLink(true)}
                    className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    הוסף קישור לחנות
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Second hand placeholder */}
          {item.acquisition_type === 'second_hand' && (
            <div className="p-2 rounded-lg bg-milo-lavender/40 border border-milo-lavender text-xs text-purple-700">
              🔍 סריקת יד2 ופייסבוק מרקטפלייס — בקרוב!
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-3">
          {/* Priority selector */}
          <div>
            <label className="text-xs text-milo-stone mb-1 block">עדיפות (לחץ להחלפה)</label>
            <PriorityBadge priority={item.priority} onClick={cyclePriority} />
          </div>

          {/* For whom */}
          <div>
            <label className="text-xs text-milo-stone mb-1 block">עבור (לחץ להחלפה)</label>
            <button
              onClick={cycleForWhom}
              className="px-3 py-1 rounded-full text-xs font-medium bg-milo-blush text-milo-coral-dark border border-milo-coral hover:opacity-80 transition-opacity"
            >
              {FOR_WHOM_LABELS[item.for_whom]}
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-milo-stone mb-1 block">הערות</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="הערות חופשיות..."
              rows={2}
              className="w-full px-3 py-1.5 rounded-lg border border-milo-stone-light bg-white text-sm focus:outline-none focus:ring-2 focus:ring-milo-lavender resize-none text-right"
            />
          </div>
        </div>
      </div>

      {/* Delete */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => {
            if (confirm(`למחוק את "${item.name_he}"?`)) onDelete(item.id)
          }}
          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          מחק פריט
        </button>
      </div>
    </div>
  )
}
