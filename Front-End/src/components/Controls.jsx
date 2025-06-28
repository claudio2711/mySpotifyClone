// src/components/Controls.jsx
export default function Controls({
  isPlaying,
  onPrevious,
  onTogglePlay,
  onNext,
}) {
  return (
    <div className="controls flex gap-4 justify-center my-4">
      <button onClick={onPrevious} className="btn">
        Precedente
      </button>

      <button onClick={onTogglePlay} className="btn">
        {isPlaying ? "Pausa" : "Play"}
      </button>

      <button onClick={onNext} className="btn">
        Prossima
      </button>
    </div>
  );
}
