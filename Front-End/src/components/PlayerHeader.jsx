// src/components/PlayerHeader.jsx
import placeholderCover from "../assets/placeholder-cover.png";

export default function PlayerHeader({
  song,             // { title, artist, album, pictureUrl, url, … }
  audioRef,         // ref condiviso con il padre
  isLooping,        // stato loop dal padre
  nextSong,         // callback per andare al brano successivo
  setCurrentTime,   // dispatcher dal padre
  setDuration,      // dispatcher dal padre
}) {
  if (!song) return null;               // safety-check

  return (
    <>
      {/* ────────── INFO / COPERTINA ────────── */}
      <div className="song-info">
        <img
          className="cover-art"
          src={song.pictureUrl || placeholderCover}   /* fallback locale */
          alt="Cover"
        />

        <h2>{song.title}</h2>
        <p>{song.artist}</p>
        {song.album && <h4 className="album-name">{song.album}</h4>}
      </div>

      {/* ────────── AUDIO ELEMENT ────────── */}
      <audio
        ref={audioRef}
        src={song.url}
        onTimeUpdate={() => {
          const a = audioRef.current;
          setCurrentTime(a.currentTime);
          localStorage.setItem("currentTime", a.currentTime.toString());
        }}
        onLoadedMetadata={() => {
          setDuration?.(audioRef.current.duration);   // durata totale
        }}
        onEnded={() => {
          if (isLooping) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else {
            nextSong();
          }
        }}
      />
    </>
  );
}
