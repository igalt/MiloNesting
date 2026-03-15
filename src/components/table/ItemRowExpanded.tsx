import { useState, useEffect } from 'react'
import { ExternalLink, Trash2 } from 'lucide-react'
import { FOR_WHOM_LABELS } from '../../lib/constants'
import type { NestingItem, AcquisitionType, Priority, ForWhom } from '../../types'
import { AcquisitionCell } from '../cells/AcquisitionCell'
import { PriorityBadge } from '../cells/PriorityBadge'

interface ItemRowExpandedProps {
  item: NestingItem
  onUpdate: (id: string, updates: Partial<NestingItem>) => void
  onDelete: (id: string) => void
}

const PRIORITY_ORDER: Priority[] = ['must_have', 'nice_to_have', 'question_mark']

export function ItemRowExpanded({ item, onUpdate, onDelete }: ItemRowExpandedProps) {
  const [borrowFrom, setBorrowFrom] = useState(item.borrow_from ?? '')
  const [notes, setNotes] = useState(item.notes ?? '')

  useEffect(() => { setBorrowFrom(item.borrow_from ?? '') }, [item.borrow_from])
  useEffect(() => { setNotes(item.notes ?? '') }, [item.notes])

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

  return (
    <div className="animate-slide-down px-4 pb-4 bg-gradient-to-b from-white to-milo-cream/50 border-b border-milo-stone-light">
      <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Store links (only when buy_new) */}
          {item.acquisition_type === 'buy_new' && (
            <div>
              <label className="text-xs text-milo-stone mb-1 block">היכן לקנות</label>
              {item.store_links.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {item.store_links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-milo-sky text-sky-700 text-xs hover:bg-sky-200 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-milo-stone italic">עוד לא הוספנו קישורים</span>
              )}
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
