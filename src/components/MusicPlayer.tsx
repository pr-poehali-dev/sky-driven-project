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

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
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
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
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

      {/* Album art area */}
      <div className="flex items-center gap-5 mb-6">
        <div
          className={`w-20 h-20 rounded-xl bg-gradient-to-br from-purple-700 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg ${isPlaying ? "animate-pulse" : ""}`}
        >
          <Icon name="Music2" size={36} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-lg leading-tight">{track.title}</p>
          <p className="text-purple-300 text-sm mt-1">{track.artist}</p>
          <p className="text-gray-500 text-xs mt-1">В репертуаре Румили</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #9333ea ${progress}%, #374151 ${progress}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1.5">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition-all duration-200 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.7)] active:scale-95"
          aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
        >
          <Icon name={isPlaying ? "Pause" : "Play"} size={24} className="text-white ml-0.5" />
        </button>
      </div>
    </div>
  )
}
