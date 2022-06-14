import React, { useEffect, useState } from "react";
import "../Album/Album.css";
import "./NewAlbum.css";
import {
  ClockCircleOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import AlbumCoverDropzone from "../../components/AlbumCoverDropzone";
import { DatePicker, Input, message, notification, Select } from "antd";
import NewSongDropzone from "../../components/NewSongDropzone";
import {
  useMoralisFile,
  useMoralis,
  useWeb3ExecuteFunction,
} from "react-moralis";
import { useNavigate } from "react-router-dom";
import abi from "./Abi.json";
import { Loading } from "../../components/Loading";

const NewAlbum = () => {
  const [cover, setCover] = useState([]);
  const [songs, setSongs] = useState([]);
  const [songsIPFS, setSongsIpfs] = useState([]);
  const [metadataAllIPFS, setMetadataAllIPFS] = useState([]);
  const [uploadingAlbum, setUploadingAlbum] = useState(false);
  const [formAlbum, setFormAlbum] = useState({
    title: "",
    artist: "",
    year: "",
    genre: "",
  });
  const { moralisFile: coverIPFS, saveFile } = useMoralisFile();
  const { moralisFile: songIPFS, saveFile: saveSong } = useMoralisFile();
  const { moralisFile: metadataIPFS, saveFile: saveMetadata } =
    useMoralisFile();
  const { enableWeb3, isAuthenticated } = useMoralis();
  const { error, fetch } = useWeb3ExecuteFunction();

  const navigate = useNavigate();
  const genre = [
    "Pop",
    "Hip Hop",
    "Rock",
    "Rhythm and Blues",
    "Soul",
    "Country",
    "Reggae",
    "Funk",
    "Folk",
    "Middle Eastern",
    "Jazz",
    "Disco",
    "Classical",
    "Electronic",
  ];

  useEffect(() => {
    if (coverIPFS && uploadingAlbum) {
      uploadSongs();
    }
  }, [coverIPFS]);

  useEffect(() => {
    if (songIPFS && uploadingAlbum) {
      let aux = [...songsIPFS];
      aux.push(songIPFS.ipfs());
      setSongsIpfs(aux);
    }
  }, [songIPFS]);

  useEffect(() => {
    if (metadataIPFS && uploadingAlbum) {
      let aux = [...metadataAllIPFS];
      aux.push(metadataIPFS.ipfs());
      setMetadataAllIPFS(aux);
    }
  }, [metadataIPFS]);

  useEffect(() => {
    if (
      songsIPFS.length === songs.length &&
      songs.length !== 0 &&
      uploadingAlbum
    ) {
      saveMetadataToIPFS();
    }
  }, [songsIPFS]);

  useEffect(() => {
    if (
      metadataAllIPFS.length === songs.length &&
      songs.length !== 0 &&
      uploadingAlbum
    ) {
      createNFT();
    }
  }, [metadataAllIPFS]);
  useEffect(() => {
    if (uploadingAlbum && error && error.message) {
      setUploadingAlbum(false);
      setSongsIpfs([]);
      setMetadataAllIPFS([]);
      notification.error({
        description: error.message,
      });
      console.log(error);
    }
  }, [error]);

  const createNFT = async () => {
    await enableWeb3();
    let name = removeAndCapitalize(formAlbum.title);
    let symbol = getSymbol(name);
    let songsMetadata = [...metadataAllIPFS];
    let options = {
      abi: abi,
      contractAddress: "0x081e6137Fd26d8B898D5F184db85abffd5cF2aA7",
      functionName: "createNewAlbum",
      params: {
        _name: name,
        _symbol: symbol,
        _songs: songsMetadata,
        _title: formAlbum.title,
        _image: coverIPFS.ipfs(),
        _genre: formAlbum.genre,
        _year: formAlbum.year,
      },
    };
    
    fetch({ params: options }).then((r) => {
      if (r) {
        setUploadingAlbum(false);
        notification.success({
          description:
            "Your album have been uploaded successfully. You will be redirect to home.",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    });
  };

  const removeAndCapitalize = (txt) => {
    var input = txt;
    var output = input
      .replace(/\w+/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
      })
      .replace(/\s/g, "");
    return output;
  };

  const getSymbol = (txt) => {
    var strings = txt;
    var i = 0;
    var character = "";
    var symbol = "";
    while (i <= strings.length) {
      character = strings.charAt(i);
      if (character === character.toUpperCase()) {
        symbol += character;
      }
      i++;
    }
    return symbol;
  };

  const saveMetadataToIPFS = async () => {
    let date = new Date();
    songsIPFS.forEach((song, i) => {
      let metadata = {
        path: `file_${i}.json`,
        content: {
          image: coverIPFS.ipfs(), //xxx = hash
          name: songs[i].titleSong,
          animation_url: song, //xxx = hash
          duration: songs[i].duration,
          artist: formAlbum.artist,
          year: date.getFullYear(),
        },
      };
      saveMetadata(
        metadata.path,
        { base64: btoa(JSON.stringify(metadata.content)) },
        { type: "base64", saveIPFS: true }
      );
    });
  };

  const uploadAlbum = () => {
    if (
      formAlbum.title.trim() === "" ||
      formAlbum.artist.trim() === "" ||
      formAlbum.genre.trim() === "" ||
      formAlbum.year.trim() === ""
    ) {
      message.error("The Title/Artist/Year/Genre is required.");
      return;
    }

    if (cover.length === 0) {
      message.error("The Cover is required.");
      return;
    }

    if (songs.length === 0) {
      message.error("The Album need at least 1 song.");
      return;
    }
    setUploadingAlbum(true);
    const coverFile = cover[0];

    saveFile(formAlbum.title + "_cover.jpeg", coverFile, { saveIPFS: true });
  };

  const uploadSongs = () => {
    songs.forEach((song) => {
      saveSong(song.titleSong + "." + song.extension, song, { saveIPFS: true });
    });
  };

  if (!isAuthenticated) {
    navigate("/");
  }

  return (
    <>
      {uploadingAlbum && <Loading />}
      <div className="albumContent">
        <div className="topBan">
          <div className="coverBody">
            {cover.length > 0 ? (
              <img
                src={cover[0].preview}
                alt="albumcover"
                className="albumCover"
              ></img>
            ) : (
              <AlbumCoverDropzone setCover={setCover} />
            )}
            {cover.length > 0 && (
              <div className="coverDeleteBody">
                <button className="coverDelete" onClick={() => setCover([])}>
                  <DeleteOutlined />{" "}
                </button>
              </div>
            )}
          </div>
          <div className="newAlbumDeets">
            <div>ALBUM</div>
            <div className="addTitle">
              <Input
                placeholder="Title..."
                onChange={(e) => {
                  setFormAlbum({ ...formAlbum, title: e.target.value });
                }}
              />
            </div>
            <div className="addTitle">
              <Input
                placeholder="Artist..."
                onChange={(e) => {
                  setFormAlbum({ ...formAlbum, artist: e.target.value });
                }}
              />
            </div>
            <div className="two-columns">
              <div className="addYear">
                <DatePicker
                  placeholder="Year..."
                  onChange={(e, year) =>
                    setFormAlbum({ ...formAlbum, year: year })
                  }
                  picker="year"
                />
              </div>
              <div className="addGenre">
                <Select
                  onChange={(e) => setFormAlbum({ ...formAlbum, genre: e })}
                  placeholder="Genre"
                >
                  {genre.map((gen, i) => (
                    <Select.Option value={gen} key={i}>
                      {" "}
                      {gen}{" "}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className="uploadSection">
            <button onClick={uploadAlbum}>
              Upload Album <UploadOutlined />
            </button>
          </div>
        </div>
        <br />
        <div className="tableHeader">
          <div className="numberHeader">#</div>
          <div className="titleHeader">TITLE</div>
          <div className="numberHeader">
            <ClockCircleOutlined />
          </div>
        </div>

        <div className="tableContentSize">
          {songs.map((song, i) => {
            return (
              <div key={i} className="tableContent">
                <div className="numberHeader">{i + 1}</div>
                <div className="newTitleHeader">
                  <Input
                    placeholder="Name..."
                    defaultValue={song.titleSong}
                    onChange={(e) => {
                      let aux = [...songs];
                      aux[i].titleSong = e.target.value;
                      setSongs(aux);
                    }}
                  />
                </div>
                <div className="numberHeader">{song.duration} </div>
              </div>
            );
          })}
        </div>
        <div>
          <NewSongDropzone setSong={setSongs} songs={songs} />
        </div>
      </div>
    </>
  );
};

export default NewAlbum;
