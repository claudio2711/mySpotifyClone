export default function Controls({
  isPlaying,
  onPrevious,
  onTogglePlay,
  onNext,
}) {
  return (
    <div className="flex items-center justify-center gap-6 my-4">
      {/* ─── PREVIOUS ─── */}
      <button
        onClick={onPrevious}
        className="rounded-full p-3 bg-white/10 hover:bg-white/20 transition text-white focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Brano precedente"
      >
        {/* Se preferisci la parola “Precedente”, sostituisci l’SVG con il testo */}
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M11 18V6l-8.5 6L11 18zm1-12v12l8.5-6L12 6z" />
        </svg>
      </button>

      {/* ─── PLAY / PAUSE ─── */}
      <button
        onClick={onTogglePlay}
        className="rounded-full p-5 bg-green-500 hover:bg-green-600 transition text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 scale-105 active:scale-100"
        aria-label={isPlaying ? 'Pausa' : 'Play'}
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* ─── NEXT ─── */}
      <button
        onClick={onNext}
        className="rounded-full p-3 bg-white/10 hover:bg-white/20 transition text-white focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Brano successivo"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M13 6v12l8.5-6L13 6zM3 6v12l8.5-6L3 6z" />
        </svg>
      </button>
    </div>
  );
}

