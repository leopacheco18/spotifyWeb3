import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { Tabs } from "antd";
import { useMoralisQuery } from "react-moralis";
const { TabPane } = Tabs;

const Home = ({setGlobalAlbum}) => {
  
  const isMobile = window.innerWidth < 800;
  const [library, setLibrary] = useState([]);
  const [pop, setPop] = useState([]);
  const [rock, setRock] = useState([]);
  const { fetch, data } = useMoralisQuery(
    "Album",
    (query) => query.equalTo("confirmed", true),
    {
      autoFetch: false,
    }
  );

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    setLibrary(data);
    getPopsAndRock();
    setGlobalAlbum(data);
  }, [data]);


  const getPopsAndRock = () => {
    let arrPop = [];
    let arrRock = [];
    data.forEach(item => {
      if(item.get("genre") === 'Pop') arrPop.push(item)
      if(item.get("genre") === 'Rock') arrRock.push(item)
    })
    setPop(arrPop);
    setRock(arrRock);
  }
  

  return (
    <>
      <Tabs defaultActiveKey="1" centered className="tabs-padding">
        <TabPane tab="FEATURED" key="1">
          <h1 className="featuredTitle">Today Is The Day</h1>

          <div className="albums">
            {library.map((album,i) => (
              <Link
                key={i}
                to="/album"
                state={JSON.stringify(album)}
                className="albumSelection"
              >
                <img
                  src={album.get("image")}
                  alt="bull"
                  style={{ width: "200px", marginBottom: "10px", height: '200px' }}
                />

                <p>{album.get("title")}</p>
              </Link>
            ))}
          </div>
        </TabPane>
        <TabPane tab="Pop" key="2">
          <h1 className="featuredTitle">All Pops Songs</h1>
          <div className="albums">
          {pop.map((album,i) => (
              <Link
                key={i}
                to="/album"
                state={JSON.stringify(album)}
                className="albumSelection"
              >
                <img
                  src={album.get("image")}
                  alt="bull"
                  style={{ width: "200px", marginBottom: "10px", height: '200px' }}
                />

                <p>{album.get("title")}</p>
              </Link>
            ))}
          </div>
        
          
        </TabPane>
        <TabPane tab="Rock" key="3">
          <h1 className="featuredTitle">All Rock Songs</h1>
          <div className="albums">
          {rock.map((album,i) => (
              <Link
                key={i}
                to="/album"
                state={JSON.stringify(album)}
                className="albumSelection"
              >
                <img
                  src={album.get("image")}
                  alt="bull"
                  style={{ width: "200px", marginBottom: "10px", height: '200px' }}
                />

                <p>{album.get("title")}</p>
              </Link>
            ))}
          </div>
        </TabPane>
      </Tabs>
    </>
  );
};

export default Home;
