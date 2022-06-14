import { useEffect, useState } from "react";
import {
  useMoralis,
  useMoralisWeb3Api,
  useWeb3ExecuteFunction,
} from "react-moralis";

export const useAlbum = (contract) => {
  const { token } = useMoralisWeb3Api();
  const { isInitialized, enableWeb3 } = useMoralis();
  const { fetch: fetchMoralis } = useWeb3ExecuteFunction();

  const [albumDetails, setAlbumDetails] = useState();

  useEffect(() => {
    if (isInitialized && !albumDetails) {
      console.log("aqui");
      fetchAlbum().then(async (songs) => {
        await enableWeb3();
        for (let i = 0; i < songs.result.length; i++) {
          if (!songs.result[i].metadata) {
            let options = {
              abi: [
                {
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "tokenId",
                      type: "uint256",
                    },
                  ],
                  name: "tokenURI",
                  outputs: [
                    { internalType: "string", name: "", type: "string" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
              ],
              contractAddress: contract,
              functionName: "tokenURI",
              params: {
                tokenId: songs.result[i].token_id,
              },
            };
            await fetchMoralis({
              params: options,
              // eslint-disable-next-line no-loop-func
              onSuccess: async (data) => {
                let urlArr = data.split("/");
                let ipfsHash = urlArr[urlArr.length - 1];
                let url = `https://gateway.moralisipfs.com/ipfs/${ipfsHash}`;
                let response = await fetch(url);
                let jsonToAdd = await response.text();
                console.log(i);
                songs.result[i].metadata = jsonToAdd;
                // jsonToAdd.token_id = item;
                // arr.push(jsonToAdd);
                // if (item === 0) {
                //   setCertificateDetails(arr);
                // }
              },
              onError: console.log,
            });
          }
        }
        let allSongsHaveMetadata = true;
        songs.result.forEach((item) => {
          if (!item.metadata) {
            allSongsHaveMetadata = false;
          }
        });
        if (allSongsHaveMetadata) {
          setAlbumDetails(songs.result);
        } else {
          
          var interval = setInterval(function () {
            allSongsHaveMetadata = true;
            songs.result.forEach((item) => {
              if (!item.metadata) {
                allSongsHaveMetadata = false;
              }
            });
            if (allSongsHaveMetadata) {
              clearInterval(interval);
              setAlbumDetails(songs.result);
            }
            //do whatever here..
          }, 100);
        }
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
