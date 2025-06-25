import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [songs, setSongs] = useState([]);
  const [shuffleQueue, setShuffleQueue] = useState([]);
  const [shuffleStartIndex, setShuffleStartIndex] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("Errore nel caricamento:", err));
  }, []);

  useEffect(() => {
    const savedIndex = localStorage.getItem("currentSongIndex");
    const savedTime = localStorage.getItem("currentTime");
    const savedLoop = localStorage.getItem("isLooping");
    const savedShuffle = localStorage.getItem("isShuffling");
    const savedVolume = localStorage.getItem("volume");

    if (savedIndex !== null) setCurrentSongIndex(Number(savedIndex));
    if (savedTime !== null) setCurrentTime(Number(savedTime));
    if (savedLoop !== null) setIsLooping(savedLoop === "true");
    if (savedShuffle !== null) setIsShuffling(savedShuffle === "true");
    if (savedVolume !== null) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      if (audioRef.current) audioRef.current.volume = vol;
    }
  }, []);

  if (songs.length === 0) {
    return <p>Caricamento playlist...</p>;
  }

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const generateShuffleQueue = (startIndex) => {
    const indices = songs.map((_, i) => i);
    const remaining = indices.filter((i) => i !== startIndex);
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    const queue = [startIndex, ...remaining];
    console.log("🎲 Coda shuffle completa:", queue);
    return queue;
  };

  const nextSong = () => {
    if (isShuffling) {
      if (shuffleQueue.length === 0) {
        const newQueue = generateShuffleQueue(currentSongIndex);
        setShuffleQueue(newQueue);
        setShuffleStartIndex(0);
      } else {
        const nextIndex = (shuffleStartIndex + 1) % shuffleQueue.length;
        setCurrentSongIndex(shuffleQueue[nextIndex]);
        setShuffleStartIndex(nextIndex);
        localStorage.setItem("currentSongIndex", shuffleQueue[nextIndex]);
      }
    } else {
      const nextIndex = (currentSongIndex + 1) % songs.length;
      setCurrentSongIndex(nextIndex);
      localStorage.setItem("currentSongIndex", nextIndex);
    }

    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 0);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const selectSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    localStorage.setItem("currentSongIndex", index);

    if (isShuffling) {
      const newQueue = generateShuffleQueue(index);
      setShuffleQueue(newQueue);
      setShuffleStartIndex(0);
    }

    setTimeout(() => audioRef.current?.play(), 0);
  };

  return (
    <>
      <div className="app">
        <h1>My Personal Music Player</h1>

        <div className="song-info">
          <h2>{songs[currentSongIndex].title}</h2>
          <p>{songs[currentSongIndex].artist}</p>
        </div>

        <audio
          ref={audioRef}
          src={songs[currentSongIndex].url}
          onTimeUpdate={() => {
            const audio = audioRef.current;
            setCurrentTime(audio.currentTime);
            localStorage.setItem("currentTime", audio.currentTime.toString());
          }}
          onLoadedMetadata={() => setDuration(audioRef.current.duration)}
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
                const newQueue = generateShuffleQueue(currentSongIndex);
                setShuffleQueue(newQueue);
                setShuffleStartIndex(0);
              } else {
                setShuffleQueue([]);
                setShuffleStartIndex(null);
              }
            }}
          >
            Shuffle: {isShuffling ? "On" : "Off"}
          </button>
        </div>

        <div className="volume-control">
          <label htmlFor="volume">Volume</label>
          <input
            type="range"
            id="volume"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>

        <div className="progress-container" onClick={handleSeek}>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            ></div>
          </div>
          <div className="timer">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="tracklist">
          <h3>Playlist</h3>
          <ul>
            {songs.map((song, index) => (
              <li
                key={index}
                onClick={() => selectSong(index)}
                className={index === currentSongIndex ? "active-track" : ""}
              >
                {song.title} – {song.artist}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;

