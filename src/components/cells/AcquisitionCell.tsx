import { ACQUISITION_LABELS, ACQUISITION_EMOJIS } from '../../lib/constants'
import type { AcquisitionType } from '../../types'

const TYPES: AcquisitionType[] = ['buy_new', 'borrow', 'second_hand']

const ACTIVE_STYLES: Record<AcquisitionType, string> = {
  buy_new: 'bg-milo-sky border-sky-400 text-sky-800 active',
  borrow: 'bg-milo-mint border-milo-sage text-teal-800 active',
  second_hand: 'bg-milo-lavender border-purple-300 text-purple-800 active',
}

interface AcquisitionCellProps {
  value: AcquisitionType
  onChange: (v: AcquisitionType) => void
}

export function AcquisitionCell({ value, onChange }: AcquisitionCellProps) {
  return (
    <div className="flex gap-1 flex-wrap">
      {TYPES.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`acquisition-btn ${
            value === t
              ? ACTIVE_STYLES[t]
              : 'bg-white border-milo-stone-light text-milo-stone hover:border-milo-lavender hover:text-milo-charcoal'
          }`}
        >
          {ACQUISITION_EMOJIS[t]}{' '}
          <span className="hidden sm:inline">{ACQUISITION_LABELS[t]}</span>
        </button>
      ))}
    </div>
  )
}
