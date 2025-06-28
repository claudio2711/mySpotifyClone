import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/**
 * Centralises playlist + player state.
 * Returns a ref + many helpers that the UI layer can consume.
 */
export default function useAudioPlayer() {
  /* -------------------------- state -------------------------- */
  const [songs, setSongs]                     = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime]         = useState(0);
  const [duration, setDuration]               = useState(0);
  const [volume, setVolume]                   = useState(1);

  const [isPlaying, setIsPlaying]             = useState(false);
  const [isLooping, setIsLooping]             = useState(false);
  const [isShuffling, setIsShuffling]         = useState(false);

  const [shuffleQueue,    setShuffleQueue]    = useState([]);
  const [shuffleStartIdx, setShuffleStartIdx] = useState(null);

  const audioRef = useRef(null);

  /* ---------------------- load playlist ---------------------- */
  useEffect(() => {
    fetch("http://localhost:3000/api/songs")
      .then(r => r.json())
      .then(setSongs)
      .catch(err => console.error("Errore nel caricamento:", err));
  }, []);

  /* ------------- restore persisted state on refresh ---------- */
  useEffect(() => {
    const restore = (key, fn, cast = v => v) => {
      const raw = localStorage.getItem(key);
      if (raw != null) fn(cast(raw));
    };
    restore("currentSongIndex", v => setCurrentSongIndex(+v));
    restore("currentTime",      v => setCurrentTime(+v));
    restore("isLooping",        v => setIsLooping(v === "true"));
    restore("isShuffling",      v => setIsShuffling(v === "true"));
    restore("volume",           v => {
      const vol = parseFloat(v);
      setVolume(vol);
      if (audioRef.current) audioRef.current.volume = vol;
    });
  }, []);

  /* ---------------------- derived helpers -------------------- */
  const currentSong = useMemo(
    () => songs[currentSongIndex] ?? null,
    [songs, currentSongIndex]
  );

  /* --------------------- utility functions ------------------- */
  const generateShuffleQueue = useCallback(
    (startIdx) => {
      const idxs = songs.map((_, i) => i);
      const rest = idxs.filter(i => i !== startIdx);
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      return [startIdx, ...rest];
    },
    [songs]
  );

  /* ------------------- player controls ----------------------- */
  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    isPlaying ? a.pause() : a.play();
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (isShuffling) {
      if (!shuffleQueue.length) {
        const q = generateShuffleQueue(currentSongIndex);
        setShuffleQueue(q);
        setShuffleStartIdx(0);
        setCurrentSongIndex(q[0]);
      } else {
        const next = (shuffleStartIdx + 1) % shuffleQueue.length;
        setShuffleStartIdx(next);
        setCurrentSongIndex(shuffleQueue[next]);
      }
    } else {
      setCurrentSongIndex((currentSongIndex + 1) % songs.length);
    }
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 0);
  };

  const previousSong = () => {
    if (isShuffling && shuffleQueue.length) {
      const prev = (shuffleStartIdx - 1 + shuffleQueue.length) % shuffleQueue.length;
      setShuffleStartIdx(prev);
      setCurrentSongIndex(shuffleQueue[prev]);
    } else {
      setCurrentSongIndex(
        (currentSongIndex - 1 + songs.length) % songs.length
      );
    }
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 0);
  };

  const selectSong = (idx) => {
    if (idx === currentSongIndex) return;
    setCurrentSongIndex(idx);
    setIsPlaying(true);
    if (isShuffling) {
      setShuffleQueue(generateShuffleQueue(idx));
      setShuffleStartIdx(0);
    }
    setTimeout(() => audioRef.current?.play(), 0);
  };

  /* -------------------------- API ---------------------------- */
  return {
    /* data */
    songs,
    currentSong,
    currentSongIndex,
    currentTime,
    duration,
    volume,
    isPlaying,
    isLooping,
    isShuffling,

    /* refs */
    audioRef,

    /* setters / actions */
    setCurrentTime,
    setDuration,
    setVolume,
    setIsLooping,
    setIsShuffling,
    togglePlay,
    nextSong,
    previousSong,
    selectSong,
    generateShuffleQueue,
    setShuffleQueue,
    setShuffleStartIdx,
  };
}

