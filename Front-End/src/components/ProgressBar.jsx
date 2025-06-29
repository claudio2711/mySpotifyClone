export default function ProgressBar({ currentTime, duration, onSeek }) {
  // formato mm:ss
  const format = (t = 0) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(
      Math.floor(t % 60)
    ).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center gap-2 my-4 w-full">
      {/* ─── Slider ─── */}
   <input
  type="range"
  min="0"
  max={duration || 0}
  step="0.1"
  value={currentTime}
onChange={(e) => {
  const val = parseFloat(e.target.value);
  onSeek(val);
  e.target.style.setProperty(
    "--tw-progress",
    `${(val / (duration || 1)) * 100}%`
  );
}}

  className="range w-11/12 outline-none cursor-pointer"
/>


      {/* ─── Timer ─── */}
      <div className="text-sm font-mono text-amber-400 drop-shadow-sm">
        {format(currentTime)} / {format(duration)}
      </div>
    </div>
  );
}
