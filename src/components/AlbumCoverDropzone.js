import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { PlusOutlined } from "@ant-design/icons";

const AlbumCoverDropzone = ({ setCover }) => {
  const onDrop = (acceptedFiles) => {
    setCover(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 1,
  });

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      <PlusOutlined />
    </div>
  );
};

export default AlbumCoverDropzone;
