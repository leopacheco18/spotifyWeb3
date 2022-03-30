import React from "react";
import { useLocation } from "react-router-dom";
import { useAlbum } from "../../hooks/useAlbum";
import "./Album.css";
import Opensea from "../../images/opensea.png";
import { ClockCircleOutlined } from "@ant-design/icons";

const Album = ({ setNftAlbum }) => {
  const { state: album } = useLocation();
  const { albumDetails } = useAlbum(JSON.parse(album).contractAddress);
  return (
    <>
      <div className="albumContent">
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
        <div className="topBan">
          <div
            className="playButton"
            onClick={() => {
              let aux = [...albumDetails];
              aux.forEach((item) => {
                item.title = JSON.parse(album).title;
              });
              setNftAlbum(aux);
            }}
          >
            PLAY
          </div>
        </div>
        <div className="tableHeader">
          <div className="numberHeader">#</div>
          <div className="titleHeader">TITLE</div>

          <div className="numberHeader">
            <ClockCircleOutlined />
          </div>
        </div>
        {albumDetails &&
          albumDetails.map((nft, i) => {
            let nftAux = JSON.parse(nft.metadata);
            return (
              <>
                <div className="tableContent">
                  <div className="numberHeader">{i + 1}</div>
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
                      <img src={Opensea} className="openLogo" alt="openLogo" />
                    </div>
                  </div>

                  <div className="numberHeader">{nftAux.duration}</div>
                </div>
              </>
            );
          })}
      </div>
    </>
  );
};

export default Album;
