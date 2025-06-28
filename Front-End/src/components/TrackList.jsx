// src/components/TrackList.jsx
export default function TrackList({
  songs,
  currentIdx,
  onSelect,
}) {
  return (
    <div className="tracklist mt-8">
      <h3>Playlist</h3>
      <ul>
        {songs.map((s, i) => (
          <li
            key={i}
            onClick={() => onSelect(i)}
            className={
              i === currentIdx ? "active-track cursor-pointer" : "cursor-pointer"
            }
          >
            {s.title} – {s.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}
