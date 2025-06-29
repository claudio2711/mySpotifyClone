export default function VolumeSlider({ volume, onChange }) {
  return (
    <div className="flex flex-col items-center gap-2 my-4">
      <label htmlFor="volume" className="text-white/90 text-sm">
        Volume
      </label>

      <input
        id="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        /* stessa logica della progress-bar ma con classe .range-blue */
        className="range-blue w-40 cursor-pointer"
      />
    </div>
  );
}
