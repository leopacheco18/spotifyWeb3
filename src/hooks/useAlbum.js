import { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

export const useAlbum = (contract) => {
  const { token } = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();

  const [albumDetails, setAlbumDetails] = useState();

  useEffect(() => {
    if (isInitialized) {
      fetchAlbum().then((songs) => {
        setAlbumDetails(songs.result);
      });
    }
  }, [isInitialized, contract]);

  const fetchAlbum = async () => {
    return await token
      .getAllTokenIds({
        address: contract,
        chain: "mumbai",
      })
      .then((result) => result);
  };

  return { fetchAlbum, albumDetails };
};
