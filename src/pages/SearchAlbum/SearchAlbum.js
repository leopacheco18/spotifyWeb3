import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./../Home/Home.css";
import { Tabs } from "antd";
import { useMoralisQuery } from "react-moralis";
const { TabPane } = Tabs;

const SearchAlbum = ({ searchVal, setSearchValue, globalAlbum }) => {
  const [library, setLibrary] = useState([]);

    useEffect(() => {
      searchInAlbum();
    }, [searchVal]);

    const searchInAlbum = () => {
      let arr = [];
      globalAlbum.forEach(item => {
        if(item.get("title").toLowerCase().includes(searchVal.toLowerCase())) arr.push(item)
      })
      setLibrary(arr);
    }

  return (
    <>
    <h1 className="featuredTitle">Search...</h1>
    <div className="albums">
            {library.map((album, i) => (
              <Link
              key={i}
              onClick={() => setSearchValue("")}
                to="/album"
                state={JSON.stringify(album)}
                className="albumSelection"
              >
                <img
                  src={album.get("image")}
                  alt="bull"
                  style={{ width: "200px", marginBottom: "10px" ,  height: '200px' }}
                />

                <p>{album.get("title")}</p>
              </Link>
            ))}
          </div>
          </>
  );
};

export default SearchAlbum;
