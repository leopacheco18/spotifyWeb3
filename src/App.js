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
import SearchAlbum from "./pages/SearchAlbum/SearchAlbum";

const { Footer, Sider, Content } = Layout;

const App = () => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 800;
  const [closeMenu, setCloseMenu] = useState(isMobile)
  const [indexToPlay, setIndexToPlay] = useState(0)
  const [height, setHeight] = useState(0);
  const { isAuthenticated, authenticate, authError, logout } =
    useMoralis();
  const [globalAlbum, setGlobalAlbum] = useState([]);
  const [nftAlbum, setNftAlbum] = useState();
  const [searchAlbum, setSearchAlbum] = useState("");

  useEffect(() => {
    if (authError && authError.message) {
      notification.error({
        description: authError.message,
      });
    }
  }, [authError]);

  useEffect(() => {
    if(nftAlbum && height === 0){
      let item = document.getElementsByClassName('footer')[0];
      let height = item.offsetHeight + (isMobile ? 20 : 19);
      
      setHeight(height);
    }
  },[nftAlbum])

  return (
    <Layout>
      <Layout className="layout-own" style={{height: ('calc(100vh - ' + height +'px)')}}>
        <Sider width={(closeMenu ? '80' : '300')} className="sideBar" style={{padding : (closeMenu && '15px')}}>
          <img src={Spotify} alt="Logo" className="logo" onClick={() => setCloseMenu(!closeMenu)} />
          <div style={{display: (closeMenu ? 'none' : 'block')}}>
          
          <div className="searchBar">
            <Input
              suffix={
                <SearchOutlined style={{ fontSize: "30px", color: "white" }} />
              }
              placeholder="Search by album"
              onChange={(e) => setSearchAlbum(e.target.value)}
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
          </div>
          
        </Sider>
        <Content className="contentWindow">
          {searchAlbum.trim() !== "" ? (
            <SearchAlbum
              searchVal={searchAlbum}
              setSearchValue={setSearchAlbum}
              globalAlbum={globalAlbum}
            />
          ) : (
            <Routes>
              <Route path="/" element={<Home setGlobalAlbum={setGlobalAlbum} />} />
              <Route
                path="/album"
                element={<Album setNftAlbum={setNftAlbum} setIndexToPlay={setIndexToPlay} />}
              />

              <Route path="/newAlbum" element={<NewAlbum />} />
            </Routes>
          )}
        </Content>
      </Layout>
        <Footer className="footer" style={{height: (!nftAlbum && '0px'), padding: (!nftAlbum && '0px') }}>
      {nftAlbum && (
          <AudioPlayer nftAlbum={nftAlbum} indexToPlay={indexToPlay} />
          )}
        </Footer>
    </Layout>
  );
};

export default App;
