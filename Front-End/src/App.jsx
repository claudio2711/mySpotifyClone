import { useState, useEffect, useRef } from "react";
import "./App.css";

import placeholderCover from "./assets/placeholder-cover.png";   // ⬅️ fallback locale

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime]   = useState(0);
  const [duration,   setDuration]       = useState(0);
  const [volume,     setVolume]         = useState(1);
  const [isLooping,  setIsLooping]      = useState(false);
  const [isShuffling, setIsShuffling]   = useState(false);

  const [songs, setSongs]                       = useState([]);
  const [shuffleQueue,    setShuffleQueue]      = useState([]);
  const [shuffleStartIdx, setShuffleStartIdx]   = useState(null);

  const audioRef = useRef(null);

  /* --------------------------- caricamento playlist --------------------------- */
  useEffect(() => {
    fetch("http://localhost:3000/api/songs")
      .then(r => r.json())
      .then(setSongs)
      .catch(err => console.error("Errore nel caricamento:", err));
  }, []);

  /* --------------------- ripristino stato salvato su refresh ------------------ */
  useEffect(() => {
    const idx      = localStorage.getItem("currentSongIndex");
    const ctime    = localStorage.getItem("currentTime");
    const loop     = localStorage.getItem("isLooping");
    const shuffle  = localStorage.getItem("isShuffling");
    const vol      = localStorage.getItem("volume");

    if (idx   !== null) setCurrentSongIndex(Number(idx));
    if (ctime !== null) setCurrentTime(Number(ctime));
    if (loop  !== null) setIsLooping(loop === "true");
    if (shuffle !== null) setIsShuffling(shuffle === "true");
    if (vol   !== null) {
      const v = parseFloat(vol);
      setVolume(v);
      if (audioRef.current) audioRef.current.volume = v;
    }
  }, []);

  /* ------------------------ debug: brano corrente in log ---------------------- */
  useEffect(() => {
    if (songs.length) console.log("🎧 brano attuale", songs[currentSongIndex]);
  }, [songs, currentSongIndex]);

  if (!songs.length) return <p>Caricamento playlist…</p>;

  /* ============================== funzioni ==================================== */

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    isPlaying ? a.pause() : a.play();
    setIsPlaying(!isPlaying);
  };

  const generateShuffleQueue = (startIdx) => {
    const idx = songs.map((_, i) => i);
    const rest = idx.filter(i => i !== startIdx);
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    const q = [startIdx, ...rest];
    console.log("🎲 Coda shuffle completa:", q);
    return q;
  };

  const nextSong = () => {
    if (isShuffling) {
      if (!shuffleQueue.length) {
        const q = generateShuffleQueue(currentSongIndex);
        setShuffleQueue(q);
        setShuffleStartIdx(0);
      } else {
        const next = (shuffleStartIdx + 1) % shuffleQueue.length;
        setCurrentSongIndex(shuffleQueue[next]);
        setShuffleStartIdx(next);
        localStorage.setItem("currentSongIndex", shuffleQueue[next]);
      }
    } else {
      const next = (currentSongIndex + 1) % songs.length;
      setCurrentSongIndex(next);
      localStorage.setItem("currentSongIndex", next);
    }
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 0);
  };

  const previousSong = () => {
    if (isShuffling && shuffleQueue.length) {
      const prev = (shuffleStartIdx - 1 + shuffleQueue.length) % shuffleQueue.length;
      setCurrentSongIndex(shuffleQueue[prev]);
      setShuffleStartIdx(prev);
      localStorage.setItem("currentSongIndex", shuffleQueue[prev]);
    } else {
      const prev = (currentSongIndex - 1 + songs.length) % songs.length;
      setCurrentSongIndex(prev);
      localStorage.setItem("currentSongIndex", prev);
    }
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 0);
  };

  const selectSong = (i) => {
    if (i === currentSongIndex) return;
    setCurrentSongIndex(i);
    setIsPlaying(true);
    localStorage.setItem("currentSongIndex", i);
    if (isShuffling) {
      setShuffleQueue(generateShuffleQueue(i));
      setShuffleStartIdx(0);
    }
    setTimeout(() => audioRef.current?.play(), 0);
  };

  const fmt = (t) =>
    isNaN(t) ? "00:00"
             : `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2,"0")}`;

  /* =============================== render ===================================== */

  const song = songs[currentSongIndex];

  return (
    <div className="app">
      <h1>My Personal Music Player</h1>

      <div className="song-info">
        <img
          className="cover-art"
          src={song.pictureUrl || placeholderCover}   /* <-- fallback */
          alt="Cover"
        />
        <h2>{song.title}</h2>
        <p>{song.artist}</p>
        {song.album && <h4 className="album-name">{song.album}</h4>}
      </div>

      <audio
        ref={audioRef}
        src={song.url}
        onTimeUpdate={() => {
          const a = audioRef.current;
          setCurrentTime(a.currentTime);
          localStorage.setItem("currentTime", a.currentTime.toString());
        }}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        /* ✔️  versione “lint-safe” */
        onEnded={() => {
          if (isLooping) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else {
            nextSong();
          }
        }}
      />

      <div className="controls">
        <button onClick={previousSong}>Precedente</button>
        <button onClick={togglePlay}>{isPlaying ? "Pausa" : "Play"}</button>
        <button onClick={nextSong}>Prossima</button>
      </div>

      <div className="toggle-buttons">
        <button onClick={() => setIsLooping(!isLooping)}>
          Loop: {isLooping ? "On" : "Off"}
        </button>
        <button
          onClick={() => {
            setIsShuffling(!isShuffling);
            if (!isShuffling) {
              setShuffleQueue(generateShuffleQueue(currentSongIndex));
              setShuffleStartIdx(0);
            } else {
              setShuffleQueue([]);
              setShuffleStartIdx(null);
            }
          }}
        >
          Shuffle: {isShuffling ? "On" : "Off"}
        </button>
      </div>

      <div className="volume-control">
        <label htmlFor="volume">Volume</label>
        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            if (audioRef.current) audioRef.current.volume = v;
          }}
        />
      </div>

      <div className="progress-container">
        <input
          className="progress-slider"
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={(e) => {
            const t = parseFloat(e.target.value);
            audioRef.current.currentTime = t;
            setCurrentTime(t);
          }}
        />
        <div className="timer">{fmt(currentTime)} / {fmt(duration)}</div>
      </div>

      <div className="tracklist">
        <h3>Playlist</h3>
        <ul>
          {songs.map((s, i) => (
            <li
              key={i}
              onClick={() => selectSong(i)}
              className={i === currentSongIndex ? "active-track" : ""}
            >
              {s.title} – {s.artist}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
