import { ACQUISITION_LABELS, ACQUISITION_EMOJIS } from '../../lib/constants'
import type { AcquisitionType } from '../../types'

const TYPES: AcquisitionType[] = ['buy_new', 'borrow', 'second_hand', 'gift']

const ACTIVE_STYLES: Record<AcquisitionType, string> = {
  buy_new: 'bg-milo-sky border-sky-400 text-sky-800',
  borrow: 'bg-milo-mint border-milo-sage text-teal-800',
  second_hand: 'bg-milo-lavender border-purple-300 text-purple-800',
  gift: 'bg-milo-blush border-milo-coral text-milo-coral-dark',
}

interface AcquisitionCellProps {
  value: AcquisitionType[]
  onChange: (v: AcquisitionType[]) => void
}

export function AcquisitionCell({ value, onChange }: AcquisitionCellProps) {
  function toggle(t: AcquisitionType) {
    if (value.includes(t)) {
      // Don't allow deselecting last one
      if (value.length === 1) return
      onChange(value.filter((x) => x !== t))
    } else {
      onChange([...value, t])
    }
  }

  return (
    <div className="flex gap-1 flex-wrap">
      {TYPES.map((t) => {
        const active = value.includes(t)
        return (
          <button
            key={t}
            onClick={() => toggle(t)}
            className={`acquisition-btn ${
              active
                ? ACTIVE_STYLES[t]
                : 'bg-white border-milo-stone-light text-milo-stone hover:border-milo-lavender hover:text-milo-charcoal'
            }`}
          >
            {ACQUISITION_EMOJIS[t]}{' '}
            <span className="hidden sm:inline">{ACQUISITION_LABELS[t]}</span>
          </button>
        )
      })}
    </div>
  )
}
