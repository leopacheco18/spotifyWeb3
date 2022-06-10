import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./../Home/Home.css";
import { Tabs } from "antd";
import { useMoralisQuery } from "react-moralis";
const { TabPane } = Tabs;

const SearchAlbum = ({ searchVal, setSearchVal }) => {
  const [library, setLibrary] = useState([]);
  const { fetch, data } = useMoralisQuery(
    "Album",
    (query) => query.matches("title", searchVal),
    [searchVal],
    {
      live: true,
    }
  );

  //   useEffect(() => {
  //     fetch();
  //   }, []);

  useEffect(() => {
    setLibrary(data);
  }, [data]);

  return (
    <>
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="FEATURED" key="1">
          <h1 className="featuredTitle">Today Is The Day</h1>

          <div className="albums">
            {library.map((album) => (
              <Link
                to="/album"
                state={JSON.stringify(album)}
                className="albumSelection"
              >
                <img
                  src={album.get("image")}
                  alt="bull"
                  style={{ width: "150px", marginBottom: "10px" }}
                />

                <p>{album.get("title")}</p>
              </Link>
            ))}
          </div>
        </TabPane>
        <TabPane tab="GENRED & MOODS" key="2">
          <h1 className="featuredTitle">Top hits</h1>
          <div className="albums">
            {library.slice(5, 11).map((album) => (
              <Link
                to="/album"
                state={JSON.stringify(album)}
                className="albumSelection"
              >
                <img
                  src={album.image}
                  alt="bull"
                  style={{ width: "150px", marginBottom: "10px" }}
                />

                <p>{album.title}</p>
              </Link>
            ))}
          </div>
          <h1 className="featuredTitle">Country</h1>
          <div className="albums">
            {library.slice(0, 6).map((album) => (
              <Link to="/album" state={album} className="albumSelection">
                <img
                  src={album.image}
                  alt="bull"
                  style={{ width: "150px", marginBottom: "10px" }}
                />

                <p>{album.title}</p>
              </Link>
            ))}
          </div>
          <h1 className="featuredTitle">Classics</h1>
          <div className="albums">
            {library.slice(7, 13).map((album) => (
              <Link to="/album" state={album} className="albumSelection">
                <img
                  src={album.image}
                  alt="bull"
                  style={{ width: "150px", marginBottom: "10px" }}
                />

                <p>{album.title}</p>
              </Link>
            ))}
          </div>
        </TabPane>
        <TabPane tab="NEW RELEASES" key="3">
          <h1 className="featuredTitle">News</h1>
          <div className="albums">
            {library.slice(7, 13).map((album) => (
              <Link to="/album" state={album} className="albumSelection">
                <img
                  src={album.image}
                  alt="bull"
                  style={{ width: "150px", marginBottom: "10px" }}
                />

                <p>{album.title}</p>
              </Link>
            ))}
          </div>
        </TabPane>
      </Tabs>
    </>
  );
};

export default SearchAlbum;
