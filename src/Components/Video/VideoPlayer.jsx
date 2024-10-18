import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
} from "react-icons/fa";
import { MdPictureInPictureAlt } from "react-icons/md";
import { api } from "../../Config/Api";
import {
  BsVolumeMuteFill,
  BsVolumeUpFill,
  BsSkipForwardFill,
  BsSkipBackwardFill,
} from "react-icons/bs";

// Helper function to format time
const formatTime = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  return hours > 0
    ? `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`
    : `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const VideoPlayer = ({ url, vidId }) => {
  const [isPlaying, setIsPlaying] = useState(true); // Start with autoplay enabled
  const [isMuted, setIsMuted] = useState(false); // Start with muted enabled
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playedPercentage, setPlayedPercentage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [overlay, setOverlay] = useState({
    type: null,
    show: false,
    value: null,
  });

  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const loggedPercentagesRef = useRef({
    thirtyThree: false,
    sixtySix: false,
    ninety: false,
  });

  useEffect(() => {
    const video = videoRef.current;
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [isPlaying, isMuted, volume, currentTime, duration]);

  const reqViewIncrement = useCallback(async () => {
    try {
      await api.videos.post(`/${vidId}/view`);
    } catch (error) {
      console.log(error);
    }
  }, [vidId]);

  const handleTimeUpdate = useCallback(() => {
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;

    setCurrentTime(currentTime);
    const playedPercentage = (currentTime / duration) * 100;
    setPlayedPercentage(playedPercentage);

    if (
      playedPercentage >= 33 &&
      playedPercentage < 34 &&
      !loggedPercentagesRef.current.thirtyThree
    ) {
      reqViewIncrement();
      loggedPercentagesRef.current.thirtyThree = true;
    }
    if (
      playedPercentage >= 66 &&
      playedPercentage < 67 &&
      !loggedPercentagesRef.current.sixtySix
    ) {
      reqViewIncrement();
      loggedPercentagesRef.current.sixtySix = true;
    }
    if (
      playedPercentage >= 90 &&
      playedPercentage < 91 &&
      !loggedPercentagesRef.current.ninety
    ) {
      reqViewIncrement();
      loggedPercentagesRef.current.ninety = true;
    }
  }, [reqViewIncrement]);

  const handleLoadedMetadata = useCallback(() => {
    setDuration(videoRef.current.duration);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    setOverlay({
      type: isMuted ? "volume-up" : "volume-mute",
      show: true,
      value: isMuted ? volume : 0,
    });

    setTimeout(() => setOverlay({ type: null, show: false, value: null }), 1000);
  }, [isMuted, volume]);

  const handleSeek = useCallback(
    (e) => {
      const seekTime = (e.nativeEvent.offsetX / progressBarRef.current.offsetWidth) * duration;
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    },
    [duration]
  );

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);

    setOverlay({
      type: "volume-up",
      show: true,
      value: Math.round(newVolume * 100),
    });

    setTimeout(() => setOverlay({ type: null, show: false, value: null }), 1000);
  }, []);

  const toggleFullScreenMode = useCallback(() => {
    const video = videoRef.current;
    if (!document.fullscreenElement) {
      video.requestFullscreen().catch((err) => console.log(err));
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  }, [isFullScreen]);

  return (
    <div
      className={`relative w-full mb-4`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={videoRef}
        className="w-full max-h-[70vh] object-contain"
        src={url}
        onClick={togglePlay}
        tabIndex="0"
        controls={false}
        autoPlay
        muted={isMuted}
      />

      {/* Overlay Controls */}
      {isHovering && (
        <div className="absolute bottom-0 left-0 w-full h-12 flex justify-center items-center bg-black/30 rounded-lg">
          <div
            className="absolute top-0 left-0 w-full h-1 bg-gray-400 cursor-pointer"
            ref={progressBarRef}
            onClick={handleSeek}
          >
            <div
              className="h-full bg-red-600"
              style={{ width: `${playedPercentage}%` }}
            />
          </div>
          <div className="w-full px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-7">
                <button onClick={togglePlay} className="text-white">
                  {isPlaying ? (
                    <FaPause className="text-lg" />
                  ) : (
                    <FaPlay className="text-lg" />
                  )}
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-white">
                    {isMuted ? (
                      <FaVolumeMute className="text-lg" />
                    ) : (
                      <FaVolumeUp className="text-lg" />
                    )}
                  </button>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-24 h-1 bg-gray-400 rounded-full"
                    />
                  </div>
                </div>
                <div className="text-white">
                  <span>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={toggleFullScreenMode} className="text-white">
                  <FaExpand className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for volume mute */}
      {overlay.show && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/20">
          <span className="text-white text-4xl">{overlay.value}</span>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
