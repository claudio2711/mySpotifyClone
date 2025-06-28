// src/components/ProgressBar.jsx
export default function ProgressBar({
  currentTime,
  duration,
  onSeek,        // funzione che riceve il nuovo time (secondi)
}) {
  // formato mm:ss
  const format = (t = 0) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(
      Math.floor(t % 60)
    ).padStart(2, "0")}`;

  return (
    <div className="progress-container flex flex-col items-center my-4">
      <input
        type="range"
        className="progress-slider w-11/12"
        min="0"
        max={duration || 0}
        step="0.1"
        value={currentTime}
        onChange={(e) => onSeek(parseFloat(e.target.value))}
      />
      <div className="timer text-sm font-mono mt-1">
        {format(currentTime)} / {format(duration)}
      </div>
    </div>
  );
}
