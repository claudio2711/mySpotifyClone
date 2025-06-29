// src/components/Toggles.jsx
export default function Toggles({
  isLooping,
  isShuffling,
  onToggleLoop,
  onToggleShuffle,
}) {
  return (
    <div className="flex items-center justify-center gap-6 my-4">
      {/* ─── Loop ─── */}
      <button
        onClick={onToggleLoop}
        className={`px-4 py-2 rounded-md text-sm font-medium transition
          ${isLooping
            ? "bg-green-800 hover:bg-amber-700 text-white shadow-lg"
            : "bg-white/10 hover:bg-white/20 text-white"}`}
      >
        Loop: {isLooping ? "On" : "Off"}
      </button>

      {/* ─── Shuffle ─── */}
      <button
        onClick={onToggleShuffle}
        className={`px-4 py-2 rounded-md text-sm font-medium transition
          ${isShuffling
            ? "bg-green-800 hover:bg-amber-700 text-white shadow-lg"
            : "bg-white/10 hover:bg-white/20 text-white"}`}
      >
        Shuffle: {isShuffling ? "On" : "Off"}
      </button>
    </div>
  );
}
