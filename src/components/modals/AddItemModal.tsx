import { useState } from 'react'
import { X } from 'lucide-react'
import { CATEGORY_LABELS, CATEGORY_ORDER, CATEGORY_SORT_BLOCK } from '../../lib/constants'
import type { NewNestingItem, Category, Priority, ForWhom, AcquisitionType } from '../../types'

interface AddItemModalProps {
  onAdd: (item: NewNestingItem) => Promise<unknown>
  onClose: () => void
  maxSortOrderByCategory: Record<string, number>
}

export function AddItemModal({ onAdd, onClose, maxSortOrderByCategory }: AddItemModalProps) {
  const [nameHe, setNameHe] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [category, setCategory] = useState<Category>('toys_activities')
  const [priority, setPriority] = useState<Priority>('must_have')
  const [forWhom, setForWhom] = useState<ForWhom>('baby')
  const [acquisition, setAcquisition] = useState<AcquisitionType>('buy_new')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nameHe.trim()) return

    const existing = maxSortOrderByCategory[category] ?? CATEGORY_SORT_BLOCK[category]
    const sort_order = existing + 1000

    setSaving(true)
    await onAdd({
      name_he: nameHe.trim(),
      name_en: nameEn.trim() || null,
      category,
      priority,
      for_whom: forWhom,
      acquisition_types: [acquisition],
      got_it: false,
      found_it: false,
      borrow_from: null,
      gift_from: null,
      store_links: [],
      notes: null,
      sort_order,
    })
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 animate-slide-down">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-milo-charcoal">הוספת פריט חדש ✨</h2>
          <button onClick={onClose} className="text-milo-stone hover:text-milo-charcoal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Hebrew */}
          <div>
            <label className="text-xs text-milo-stone mb-1 block">שם הפריט *</label>
            <input
              autoFocus
              type="text"
              value={nameHe}
              onChange={(e) => setNameHe(e.target.value)}
              placeholder="שם בעברית..."
              required
              className="w-full px-3 py-2 rounded-xl border border-milo-stone-light bg-milo-cream text-sm focus:outline-none focus:ring-2 focus:ring-milo-lavender text-right"
            />
          </div>

          {/* Name English */}
          <div>
            <label className="text-xs text-milo-stone mb-1 block">שם באנגלית (אופציונלי)</label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="English name..."
              className="w-full px-3 py-2 rounded-xl border border-milo-stone-light bg-milo-cream text-sm focus:outline-none focus:ring-2 focus:ring-milo-lavender text-right"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-milo-stone mb-1 block">קטגוריה</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 rounded-xl border border-milo-stone-light bg-milo-cream text-sm focus:outline-none focus:ring-2 focus:ring-milo-lavender text-right"
            >
              {CATEGORY_ORDER.map((cat) => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>

          {/* Priority + ForWhom row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-milo-stone mb-1 block">עדיפות</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-xl border border-milo-stone-light bg-milo-cream text-sm focus:outline-none focus:ring-2 focus:ring-milo-lavender text-right"
              >
                <option value="must_have">💗 חובה</option>
                <option value="nice_to_have">⭐ נחמד שיהיה</option>
                <option value="question_mark">❓ לא בטוח</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-milo-stone mb-1 block">עבור</label>
              <select
                value={forWhom}
                onChange={(e) => setForWhom(e.target.value as ForWhom)}
                className="w-full px-3 py-2 rounded-xl border border-milo-stone-light bg-milo-cream text-sm focus:outline-none focus:ring-2 focus:ring-milo-lavender text-right"
              >
                <option value="baby">👶 תינוק</option>
                <option value="mother">💗 אמא</option>
                <option value="both">🤝 שניהם</option>
              </select>
            </div>
          </div>

          {/* Acquisition */}
          <div>
            <label className="text-xs text-milo-stone mb-1 block">אופן השגה</label>
            <select
              value={acquisition}
              onChange={(e) => setAcquisition(e.target.value as AcquisitionType)}
              className="w-full px-3 py-2 rounded-xl border border-milo-stone-light bg-milo-cream text-sm focus:outline-none focus:ring-2 focus:ring-milo-lavender text-right"
            >
              <option value="buy_new">🛍️ קנייה חדשה</option>
              <option value="borrow">🤝 להשאיל</option>
              <option value="second_hand">♻️ יד שנייה</option>
              <option value="gift">🎁 מתנה</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || !nameHe.trim()}
              className="flex-1 py-2.5 rounded-xl bg-milo-coral text-white font-semibold text-sm hover:bg-milo-coral-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'שומר...' : 'הוסף פריט ✨'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-milo-stone-light text-milo-stone text-sm hover:bg-milo-cream transition-colors"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
