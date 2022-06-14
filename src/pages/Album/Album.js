import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlbum } from "../../hooks/useAlbum";
import "./Album.css";
import Opensea from "../../images/opensea.png";
import {
  ClockCircleOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  LeftCircleOutlined
} from "@ant-design/icons";
import {
  useMoralis,
  useMoralisFile,
  useWeb3ExecuteFunction,
} from "react-moralis";
import NewSongDropzone from "../../components/NewSongDropzone";
import { Input, notification } from "antd";
import { Loading } from "../../components/Loading";

import abi from "./mintAbi.json";

const Album = ({ setNftAlbum, setIndexToPlay }) => {
  const { state: album } = useLocation();
  const [mintingSong, setMintingSong] = useState(false);
  const { user, isAuthenticated, enableWeb3 } = useMoralis();
  const { saveFile: saveSong } = useMoralisFile();
  const { albumDetails } = useAlbum(JSON.parse(album).contractAddress);
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();
  const { error, fetch } = useWeb3ExecuteFunction();
  const { saveFile: saveMetadata } = useMoralisFile();
  const isMobile = window.innerWidth < 800;
  useEffect(() => {
    if (error && error.message) {
      setMintingSong(false);
      notification.error({
        description: error.message,
      });
    }
  }, [error]);
  const addSong = async () => {
    setMintingSong(true);
    let song = songs[0];
    let name = song.titleSong.replace(/([^a-z0-9]+)/gi, " ");
    await enableWeb3();
    let data = await saveSong(name + "." + song.extension, song, {
      saveIPFS: true,
    });
    let metadata = {
      path: `file_${name}.json`,
      content: {
        image: JSON.parse(album).image, //xxx = hash
        name: song.titleSong,
        animation_url: data.ipfs(), //xxx = hash
        duration: song.duration,
        artist: JSON.parse(albumDetails[0].metadata).artist,
        year: JSON.parse(album).year,
      },
    };
    let metadataIPFS = await saveMetadata(
      metadata.path,
      { base64: btoa(JSON.stringify(metadata.content)) },
      { type: "base64", saveIPFS: true }
    );
    let options = {
      abi: abi,
      contractAddress: JSON.parse(album).contractAddress,
      functionName: "createToken",
      params: {
        tokenURI: metadataIPFS.ipfs(),
        real_owner: user.get("ethAddress"),
      },
    };
    fetch({ params: options }).then((r) => {
      if (r) {
        setMintingSong(false);
        notification.success({
          description:
            "Your song have been minted successfully. You will be redirect to home.",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    });
  };

  return (
    <>
      {(mintingSong || !albumDetails) && <Loading />}
      <div className="backButton">
      <LeftCircleOutlined onClick={() => navigate('/')} />
      </div>
      <div className="albumContent">
        {albumDetails && (
          <>
            <div className="topBan">
              <img
                src={JSON.parse(album).image}
                alt="albumcover"
                className="albumCover"
              ></img>
              <div className="albumDeets">
                <div>ALBUM</div>
                <div className="title">{JSON.parse(album).title}</div>
                <div className="artist">
                  {albumDetails && JSON.parse(albumDetails[0].metadata).artist}
                </div>
                <div>
                  {albumDetails && JSON.parse(albumDetails[0].metadata).year} •{" "}
                  {albumDetails && albumDetails.length} Songs
                </div>
              </div>
            </div>
            <div className="topBan tobPlayButton">
              <div
                className="playButton"
                onClick={() => {
                  let aux = [...albumDetails];
                  aux.forEach((item) => {
                    item.title = JSON.parse(album).title;
                  });
                  setIndexToPlay(0);
                  setNftAlbum(aux);
                }}
              >
                PLAY
              </div>
            </div>
            <div className="tableHeader">
              <div className="numberHeader">#</div>
              <div className="titleHeader">TITLE</div>
                {!isMobile && 
                
              <div className="numberHeader">
              <ClockCircleOutlined />
            </div>
                }
            </div>
            {albumDetails &&
              albumDetails.map((nft, i) => {
                let nftAux = JSON.parse(nft.metadata);
                return (
                  <div key={i}>
                    <div className="tableContent">
                      <div className="numberHeader">
                        <div
                          className="openButton play-single-song"
                          onClick={() => {
                            let aux = [...albumDetails];
                            aux.forEach((item) => {
                              item.title = JSON.parse(album).title;
                            });
                            setIndexToPlay(i);
                            setNftAlbum(aux);
                          }}
                        >
                          <CaretRightOutlined />
                        </div>
                      </div>
                      <div
                        className="titleHeader"
                        style={{ color: "rgb(205, 203, 203)", display: "flex" }}
                      >
                        {nftAux.name}
                        <div
                          className="openButton"
                          onClick={() =>
                            window.open(
                              `https://testnets.opensea.io/assets/mumbai/${
                                JSON.parse(album).contractAddress
                              }/${nft.token_id}`
                            )
                          }
                        >
                          <img
                            src={Opensea}
                            className="openLogo"
                            alt="openLogo"
                          />
                        </div>
                      </div>
                      {!isMobile && 
                      <div className="numberHeader">{nftAux.duration}</div>
                      }
                    </div>
                  </div>
                );
              })}

            {songs.map((song, i) => (
              <div className="tableContent">
                <div className="numberHeader">
                  {" "}
                  {isAuthenticated &&
                    user.get("ethAddress").toLowerCase() ===
                      JSON.parse(album).owner.toLowerCase() &&
                    songs.length > 0 && (
                      <div className="playButton" onClick={addSong}>
                        ADD
                      </div>
                    )}{" "}
                </div>
                <div
                  className="titleHeader"
                  style={{ color: "rgb(205, 203, 203)", display: "flex" }}
                >
                  <Input
                    placeholder="Name..."
                    defaultValue={song.titleSong}
                    onChange={(e) => {
                      let aux = [...songs];
                      aux[i].titleSong = e.target.value;
                      setSongs(aux);
                    }}
                  />
                  <div className="openButton" onClick={() => setSongs([])}>
                    <DeleteOutlined />
                  </div>
                </div>

                <div className="numberHeader">{song.duration}</div>
              </div>
            ))}

            {isAuthenticated &&
              user.get("ethAddress").toLowerCase() ===
                JSON.parse(album).owner.toLowerCase() &&
              songs.length === 0 && (
                <div>
                  <NewSongDropzone setSong={setSongs} songs={songs} />
                </div>
              )}
          </>
        )}
      </div>
    </>
  );
};

export default Album;
