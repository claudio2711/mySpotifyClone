export default function Toggles({ isLooping, isShuffling, onToggleLoop, onToggleShuffle }) {
  return (
    <div className="toggle-buttons flex gap-4 justify-center my-4">
      <button onClick={onToggleLoop}    className="btn">
        Loop:   {isLooping   ? "On" : "Off"}
      </button>

      <button onClick={onToggleShuffle} className="btn">
        Shuffle:{isShuffling ? "On" : "Off"}
      </button>
    </div>
  );
}
