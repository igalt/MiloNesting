interface HeaderProps {
  total: number
  gotIt: number
}

export function Header({ total, gotIt }: HeaderProps) {
  const pct = total > 0 ? Math.round((gotIt / total) * 100) : 0

  return (
    <header className="bg-white border-b border-milo-blush shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-2">
          <span className="text-3xl">🐣</span>
          <div>
            <h1 className="text-xl font-bold text-milo-charcoal leading-tight">
              הכנות למילו
            </h1>
            <p className="text-xs text-milo-stone">מסודרים ומוכנים לבן שלנו 💗</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-sm text-milo-stone whitespace-nowrap">
            <span className="font-bold text-milo-charcoal">{gotIt}</span>
            {' מתוך '}
            <span className="font-bold text-milo-charcoal">{total}</span>
            {' הושגו'}
          </div>
          <div className="w-28 sm:w-40 bg-milo-stone-light rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-l from-milo-coral to-milo-sage transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-milo-coral whitespace-nowrap">{pct}%</span>
        </div>
      </div>
    </header>
  )
}
