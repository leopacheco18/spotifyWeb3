import React from "react";
import { useDropzone } from "react-dropzone";
import { PlusOutlined } from "@ant-design/icons";

const NewSongDropzone = ({ setSong, songs }) => {
  const onDrop = (acceptedFiles) => {
    var arrDuration = [];
    acceptedFiles.forEach((file, key) => {
      arrDuration[key] = file;
      let extension = file.name.split(".").pop();
      arrDuration[key].extension = extension;
      let name = arrDuration[key].name.replace("." + extension, "");
      arrDuration[key].titleSong = name;
      var newAudio = document.createElement("audio");
      newAudio.src = URL.createObjectURL(file);
      newAudio.onloadedmetadata = (e) => {
        arrDuration[key].duration = formatDuration(newAudio.duration);
        if (key === acceptedFiles.length - 1) {
          addSong(arrDuration);
        }
      };
    });
  };

  const addSong = (arr) => {
    setSong([...songs, ...arr]);
  };

  const formatDuration = (duration) => {
    var minutes = 0;
    var seconds = Math.floor(duration);
    while (seconds >= 60) {
      minutes++;
      seconds -= 60;
    }
    if (minutes.toString().length === 1) {
      minutes = "0" + minutes;
    }
    if (seconds.toString().length === 1) {
      seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "audio/*",
  });

  return (
    <div {...getRootProps({ className: "dropzoneSong" })}>
      <input {...getInputProps()} />
      <PlusOutlined />
    </div>
  );
};

export default NewSongDropzone;
