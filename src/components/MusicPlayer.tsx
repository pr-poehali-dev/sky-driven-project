import { useState, useRef, useEffect } from "react"
import Icon from "@/components/ui/icon"

interface Track {
  title: string
  artist: string
  src: string
}

interface MusicPlayerProps {
  tracks: Track[]
}

export default function MusicPlayer({ tracks }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTrack, setCurrentTrack] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(0)
    setDuration(0)
    audio.load()
    if (isPlaying) audio.play()

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => {
      if (currentTrack < tracks.length - 1) {
        setCurrentTrack(currentTrack + 1)
      } else {
        setIsPlaying(false)
        setCurrentTime(0)
      }
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("ended", onEnded)
    }
  }, [currentTrack])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) { audio.pause() } else { audio.play() }
    setIsPlaying(!isPlaying)
  }

  const prevTrack = () => {
    if (currentTrack > 0) { setCurrentTrack(currentTrack - 1) }
  }

  const nextTrack = () => {
    if (currentTrack < tracks.length - 1) { setCurrentTrack(currentTrack + 1) }
  }

  const selectTrack = (i: number) => {
    setCurrentTrack(i)
    setIsPlaying(true)
    setTimeout(() => audioRef.current?.play(), 50)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const val = Number(e.target.value)
    audio.currentTime = val
    setCurrentTime(val)
  }

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "0:00"
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const track = tracks[currentTrack]
  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-800/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(147,51,234,0.2)]">
      <audio ref={audioRef} src={track.src} preload="metadata" />

      {/* Now playing */}
      <div className="flex items-center gap-5 mb-6">
        <div className={`w-20 h-20 rounded-xl bg-gradient-to-br from-purple-700 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg ${isPlaying ? "animate-pulse" : ""}`}>
          <Icon name="Music2" size={36} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-gray-400 text-xs mb-1">Сейчас играет</p>
          <p className="text-white font-bold text-lg leading-tight truncate">{track.title}</p>
          <p className="text-purple-300 text-sm mt-1">{track.artist}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #9333ea ${progress}%, #374151 ${progress}%)` }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1.5">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prevTrack}
          disabled={currentTrack === 0}
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          aria-label="Предыдущий трек"
        >
          <Icon name="SkipBack" size={22} />
        </button>
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition-all duration-200 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.7)] active:scale-95"
          aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
        >
          <Icon name={isPlaying ? "Pause" : "Play"} size={24} className="text-white ml-0.5" />
        </button>
        <button
          onClick={nextTrack}
          disabled={currentTrack === tracks.length - 1}
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          aria-label="Следующий трек"
        >
          <Icon name="SkipForward" size={22} />
        </button>
      </div>

      {/* Track list */}
      <div className="mt-5 space-y-1">
        {tracks.map((t, i) => (
          <button
            key={i}
            onClick={() => selectTrack(i)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${i === currentTrack ? "bg-purple-700/40 text-white" : "hover:bg-gray-700/50 text-gray-400"}`}
          >
            <span className="text-xs w-4 text-center flex-shrink-0">
              {i === currentTrack && isPlaying ? <Icon name="Volume2" size={14} className="text-purple-400" /> : i + 1}
            </span>
            <div className="min-w-0">
              <p className={`text-sm font-medium truncate ${i === currentTrack ? "text-white" : "text-gray-300"}`}>{t.title}</p>
              <p className="text-xs text-gray-500">{t.artist}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
