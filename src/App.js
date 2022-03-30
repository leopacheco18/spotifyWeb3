import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Album from "./pages/Album/Album";
import NewAlbum from "./pages/NewAlbum/NewAlbum";
import "./App.css";
import { Input, Layout, notification } from "antd";
import Spotify from "./images/Spotify.png";
import { SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import AudioPlayer from "./components/AudioPlayer";
import { useMoralis } from "react-moralis";

const { Footer, Sider, Content } = Layout;

const App = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authenticate, authError, logout, chainId } =
    useMoralis();
  const [nftAlbum, setNftAlbum] = useState();
  useEffect(() => {
    if (authError && authError.message) {
      notification.error({
        description: authError.message,
      });
    }
  }, [authError]);

  return (
    <Layout>
      <Layout>
        <Sider width={300} className="sideBar">
          <img src={Spotify} alt="Logo" className="logo" />
          <div className="searchBar">
            <Input
              suffix={
                <SearchOutlined style={{ fontSize: "30px", color: "white" }} />
              }
              placeholder="Search"
            />
          </div>
          <Link to="/">
            <p style={{ color: "#1DB954" }}>Home</p>
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/newAlbum">
                <p style={{ color: "white" }}>
                  Add Album <PlusCircleOutlined style={{ color: "#1DB954" }} />
                </p>
              </Link>
              <div className=" recentPlayed">
                <p className="recentTitle">RECENTLY PLAYED</p>
              </div>
              <div className="login">
                <button
                  onClick={() =>
                    logout().then(() => {
                      navigate("/");
                    })
                  }
                >
                  Logout
                </button>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <div className="login">
              <button onClick={authenticate}>Login with Metamask</button>
            </div>
          )}
        </Sider>
        <Content className="contentWindow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/album"
              element={<Album setNftAlbum={setNftAlbum} />}
            />

            <Route path="/newAlbum" element={<NewAlbum />} />
          </Routes>
        </Content>
      </Layout>
      {nftAlbum && (
        <Footer className="footer">
          <AudioPlayer nftAlbum={nftAlbum} />
        </Footer>
      )}
    </Layout>
  );
};

export default App;
