import React from "react";
import useAudio from "../hooks/useAudio";
import { Slider } from "antd";
import { useIPFS } from "../hooks/useIPFS";
import "./AudioPlayer.css";
import {
  SoundOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
} from "@ant-design/icons";

export default function AudioPlayer({ nftAlbum , indexToPlay}) {
  const { resolveLink } = useIPFS();
  const isMobile = window.innerWidth < 800;
  const [
    playing,
    duration,
    toggle,
    toNextTrack,
    toPrevTrack,
    trackProgress,
    onSearch,
    onSearchEnd,
    onVolume,
    trackIndex
  ] = useAudio(nftAlbum, indexToPlay);

  const minSec = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnMin = minutes < 10 ? `0${minutes}` : minutes;
    const seconds = Math.floor(secs % 60);
    const returnSec = seconds < 10 ? `0${seconds}` : seconds;

    return `${returnMin}:${returnSec}`;
  };

  return (
    <>
      <div
        className="buttons footer-content"
      >
        <img
          className="cover"
          src={resolveLink(JSON.parse(nftAlbum[trackIndex].metadata).image)}
          alt="currentCover"
        />
        <div>
          <div className="songTitle">
            {JSON.parse(nftAlbum[trackIndex].metadata).name}
          </div>
          <div className="songAlbum">{nftAlbum[trackIndex].title}</div>
        </div>
        {isMobile && 
        <div className="buttons">
        <StepBackwardOutlined className="forback" onClick={toPrevTrack} />
        {playing ? (
          <PauseCircleFilled className="pauseplay" onClick={toggle} />
        ) : (
          <PlayCircleFilled className="pauseplay" onClick={toggle} />
        )}
        <StepForwardOutlined className="forback" onClick={toNextTrack} />
      </div>
        }
      </div>
      <div>
      {!isMobile && 
        <div className="buttons">
          <StepBackwardOutlined className="forback" onClick={toPrevTrack} />
          {playing ? (
            <PauseCircleFilled className="pauseplay" onClick={toggle} />
          ) : (
            <PlayCircleFilled className="pauseplay" onClick={toggle} />
          )}
          <StepForwardOutlined className="forback" onClick={toNextTrack} />
        </div>
}
        <div className="buttons">
          {minSec(trackProgress)}
          <Slider
            value={trackProgress}
            step={1}
            min={0}
            max={duration ? duration : 0}
            className="progress"
            tooltipVisible={false}
            onChange={(value) => onSearch(value)}
            onAfterChange={onSearchEnd}
          />
          {duration ? minSec(Math.round(duration)) : "00:00"}
        </div>
      </div>
      {!isMobile &&
      <div className="soundDiv">
        <SoundOutlined />
        <Slider
          className="volume"
          defaultValue={100}
          tooltipVisible={false}
          onChange={(value) => onVolume(value / 100)}
        />
      </div>
      }
    </>
  );
}
