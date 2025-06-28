// src/components/VolumeSlider.jsx
export default function VolumeSlider({ volume, onChange }) {
  return (
    <div className="volume-control my-4 flex flex-col items-center">
      <label htmlFor="volume" className="mb-1">Volume</label>

      <input
        id="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-40"
      />
    </div>
  );
}
