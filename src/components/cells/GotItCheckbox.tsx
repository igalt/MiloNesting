import { Check } from 'lucide-react'
import confetti from 'canvas-confetti'

interface GotItCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function GotItCheckbox({ checked, onChange }: GotItCheckboxProps) {
  function handleClick() {
    const next = !checked
    onChange(next)
    if (next) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF8FA3', '#C7F2E4', '#E2D4F0', '#FFF3B0', '#C8E6FA'],
      })
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
        checked
          ? 'bg-milo-sage border-milo-sage-dark text-white animate-check-pop'
          : 'bg-white border-milo-stone-light hover:border-milo-sage hover:bg-milo-mint/30'
      }`}
      aria-label={checked ? 'סמן כחסר' : 'סמן כיש לנו'}
    >
      {checked && <Check className="w-4 h-4" strokeWidth={3} />}
    </button>
  )
}
