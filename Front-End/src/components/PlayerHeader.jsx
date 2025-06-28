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
    <header className="flex flex-col items-center gap-2 mb-6">
      {/* ─── Copertina ─── */}
      <img
        src={song.pictureUrl || placeholderCover}
        alt={`${song.title} cover`}
        className="w-100 h-100 object-cover rounded-xl shadow-lg border-4 border-green-950-500"
      />

      {/* ─── Titolo / artista / album ─── */}
      <h2 className="text-2xl font-semibold">{song.title}</h2>
      <p className="text-lg text-shadow-black-400">{song.artist}</p>
      {song.album && (
        <h4 className="italic text-sm text-blue-950-300">{song.album}</h4>
      )}

      {/* ─── Elemento <audio> ─── */}
      <audio
        ref={audioRef}
        src={song.url}
        onTimeUpdate={() => {
          const a = audioRef.current;
          setCurrentTime(a.currentTime);
          localStorage.setItem("currentTime", a.currentTime.toString());
        }}
        onLoadedMetadata={() => {
          if (audioRef.current?.duration) setDuration(audioRef.current.duration);
        }}
        onEnded={() => {
          if (isLooping) {
            const a = audioRef.current;
            a.currentTime = 0;
            a.play();
          } else {
            nextSong();
          }
        }}
      />
    </header>
  );
}

