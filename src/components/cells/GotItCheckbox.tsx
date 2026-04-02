import { useId } from 'react'
import { Check } from 'lucide-react'
import confetti from 'canvas-confetti'

function HalfCheckIcon({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={`lh-${id}`}>
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
        <clipPath id={`rh-${id}`}>
          <rect x="12" y="0" width="12" height="24" />
        </clipPath>
      </defs>
      {/* Left half: white fill */}
      <path d="M12 2 A10 10 0 1 0 12 22 Z" fill="white" />
      {/* Right half: green fill */}
      <path d="M12 2 A10 10 0 0 1 12 22 Z" fill="currentColor" />
      {/* Circle border on top */}
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      {/* Checkmark: green on white half */}
      <path
        d="M7 12.5 L10.5 16 L17 9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath={`url(#lh-${id})`}
      />
      {/* Checkmark: white on green half */}
      <path
        d="M7 12.5 L10.5 16 L17 9"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath={`url(#rh-${id})`}
      />
    </svg>
  )
}

interface GotItCheckboxProps {
  gotIt: boolean
  foundIt: boolean
  onChange: (gotIt: boolean, foundIt: boolean) => void
}

export function GotItCheckbox({ gotIt, foundIt, onChange }: GotItCheckboxProps) {
  function handleClick() {
    if (!foundIt && !gotIt) {
      onChange(false, true)
    } else if (foundIt && !gotIt) {
      onChange(true, true)
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF8FA3', '#C7F2E4', '#E2D4F0', '#FFF3B0', '#C8E6FA'],
      })
    } else {
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
        className="w-7 h-7 flex items-center justify-center transition-all duration-200 text-milo-sage hover:opacity-80"
        aria-label="סמן כהושג"
      >
        <HalfCheckIcon className="w-7 h-7" />
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
