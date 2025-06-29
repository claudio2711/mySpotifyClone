// src/components/TrackList.jsx
export default function TrackList({ songs, currentIdx, onSelect }) {
  return (
    <div className="mt-8 w-3/5 mx-auto text-left">
      <h3 className="text-lg font-semibold mb-3 text-white/90">Playlist</h3>

      <ul className="divide-y divide-white/10">
        {songs.map((s, i) => (
          <li
            key={i}
            onClick={() => onSelect(i)}
            className={`py-2 cursor-pointer transition
              ${
                i === currentIdx
                  ? "bg-emerald-600/60 hover:bg-emerald-600 text-amber-500 font-semibold"
                  : "hover:bg-white/10 text-white/90"
              }`}
          >
            {s.title} – {s.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}
