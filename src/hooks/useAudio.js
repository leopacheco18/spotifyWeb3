import React, { useState, useEffect, useRef } from "react";
import { useIPFS } from "./useIPFS";

const useAudio = (url, index) => {
  const { resolveLink } = useIPFS();
  const [audio, setAudio] = useState(url);
  const [trackIndex, setTrackIndex] = useState(index);
  const [newSong, setNewSong] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(
    new Audio(resolveLink(JSON.parse(audio[trackIndex].metadata).animation_url))
  );

  const intervalRef = useRef();
  const isReady = useRef(false);

  const { duration } = audioRef.current;

  const toPrevTrack = () => {
    if (trackIndex - 1 < 0) {
      setTrackIndex(audio.length - 1);
    } else {
      setTrackIndex(trackIndex - 1);
    }
  };

  const toNextTrack = () => {
    if (trackIndex < audio.length - 1) {
      setTrackIndex(trackIndex + 1);
    } else {
      setTrackIndex(0);
    }
  };

  useEffect(() => {
    
    setTrackIndex(index);
    setAudio(url);
  }, [url]);
  useEffect(() => {
    playSong();
  }, [trackIndex])
  useEffect(() => {
    playSong();
  }, [audio])

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  const playSong = () => {
    audioRef.current.pause();
    audioRef.current = new Audio(
      resolveLink(JSON.parse(audio[trackIndex].metadata).animation_url)
    );
    audioRef.current.volume = volume;
    setTrackProgress(Math.round(audioRef.current.currentTime));
    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      isReady.current = true;
    }
  }

  const toggle = () => setIsPlaying(!isPlaying);

  const startTimer = () => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        toNextTrack();
      } else {
        setTrackProgress(Math.round(audioRef.current.currentTime));
      }
    }, [1000]);
  };

  const onSearch = (value) => {
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onSearchEnd = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  const onVolume = (vol) => {
    setVolume(vol);
    audioRef.current.volume = vol;
  };

  return [
    isPlaying,
    duration,
    toggle,
    toNextTrack,
    toPrevTrack,
    trackProgress,
    onSearch,
    onSearchEnd,
    onVolume,
    trackIndex
  ];
};

export default useAudio;
