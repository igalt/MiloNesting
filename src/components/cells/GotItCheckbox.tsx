import { Check, Minus } from 'lucide-react'
import confetti from 'canvas-confetti'

// 3 states: unchecked → found (half) → got it (full)
interface GotItCheckboxProps {
  gotIt: boolean
  foundIt: boolean
  onChange: (gotIt: boolean, foundIt: boolean) => void
}

export function GotItCheckbox({ gotIt, foundIt, onChange }: GotItCheckboxProps) {
  function handleClick() {
    if (!foundIt && !gotIt) {
      // unchecked → found
      onChange(false, true)
    } else if (foundIt && !gotIt) {
      // found → got it
      onChange(true, true)
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF8FA3', '#C7F2E4', '#E2D4F0', '#FFF3B0', '#C8E6FA'],
      })
    } else {
      // got it → unchecked
      onChange(false, false)
    }
  }

  if (gotIt) {
    return (
      <button
        onClick={handleClick}
        className="w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 bg-milo-sage border-milo-sage-dark text-white animate-check-pop"
        aria-label="סמן כחסר"
      >
        <Check className="w-4 h-4" strokeWidth={3} />
      </button>
    )
  }

  if (foundIt) {
    return (
      <button
        onClick={handleClick}
        className="w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 bg-milo-sunshine border-amber-300 text-amber-700"
        aria-label="סמן כהושג"
      >
        <Minus className="w-4 h-4" strokeWidth={3} />
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className="w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 bg-white border-milo-stone-light hover:border-milo-sage hover:bg-milo-mint/30"
      aria-label="סמן כנמצא"
    />
  )
}
