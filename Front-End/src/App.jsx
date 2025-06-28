import "./App.css";
import Background from "./components/Background";
import PlayerHeader  from "./components/PlayerHeader";
import Controls      from "./components/Controls";
import Toggles       from "./components/Toggles";
import ProgressBar   from "./components/ProgressBar";
import VolumeSlider  from "./components/VolumeSlider";
import TrackList     from "./components/TrackList";



import useAudioPlayer from "./hook/useAudioPlayer";

export default function App() {
  /* pull EVERYTHING from the hook */
  const {
    /* data */
    songs, currentSong, currentSongIndex,
    currentTime, duration, volume,
    isPlaying, isLooping, isShuffling,

    /* refs & setters */
    audioRef,
    setCurrentTime, setDuration, setVolume,
    setIsLooping,  setIsShuffling,

    /* actions */
    togglePlay, nextSong, previousSong, selectSong,
    generateShuffleQueue, setShuffleQueue, setShuffleStartIdx, //shuffleQueue
  } = useAudioPlayer();

  

  /* loading state --------------------------------------------------------- */
  if (!songs.length) return <p className="text-center mt-20">Caricamento playlist…</p>;

  

  /* UI -------------------------------------------------------------------- */
  return (
    
        <div className="relative min-h-screen flex flex-col items-center p-6">
      {/* Wallpaper */}
      <Background />

      {/* Contenitore centrale (max-width) */}
      <main className="w-full max-w-3xl flex flex-col items-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold drop-shadow-md text-white">
          My Personal Music Player
        </h1>

      <PlayerHeader
        song={currentSong}
        audioRef={audioRef}
        isLooping={isLooping}
        nextSong={nextSong}
        setCurrentTime={setCurrentTime}
        setDuration={setDuration}
      />

      <Controls
        isPlaying={isPlaying}
        onPrevious={previousSong}
        onTogglePlay={togglePlay}
        onNext={nextSong}
      />

      <Toggles
        isLooping={isLooping}
        isShuffling={isShuffling}
        onToggleLoop={() => setIsLooping(!isLooping)}
        onToggleShuffle={() => {
          setIsShuffling(!isShuffling);
          if (!isShuffling) {
            const q = generateShuffleQueue(currentSongIndex);
            setShuffleQueue(q);
            setShuffleStartIdx(0);
          } else {
            setShuffleQueue([]);
            setShuffleStartIdx(null);
          }
        }}
      />

      <VolumeSlider
        volume={volume}
        onChange={(v) => {
          setVolume(v);
          if (audioRef.current) audioRef.current.volume = v;
        }}
      />

      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={(t) => {
          audioRef.current.currentTime = t;
          setCurrentTime(t);
        }}
      />

      <TrackList
        songs={songs}
        currentIdx={currentSongIndex}
        onSelect={selectSong}
      />

     
</main>
    </div>


  );


}
