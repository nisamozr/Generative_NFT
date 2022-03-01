import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import { ethers } from "ethers"
import myNft from "./GenerativeNFT.json"
import Swal from 'sweetalert2'

const TWITTER_HANDLE = 'nisam_ozr';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0x0f1feA4b23990dBF5f918179EFaf81AAc7163eb2";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [loading, setloading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)

      setupEventListener()
    } else {
      console.log("No authorized account found")
    }
  }


  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }



  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          setloading(false);
          Swal.fire({
            title: 'Your are successfully minted',
            html:
              'Hey there! we are minted your NFT and sent it to your wallet. You can trade your nft on  <b>bold text</b>, ' +
              `<a href=' https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}'>OpenSea</a> ` +
              '',
            width: 600,
            padding: '3em',
            color: '#716add',
            background: '#fff url(/images/trees.png)',
            backdrop: `
              rgba(0,0,123,0.4)
              url("/images/nyan-cat.gif")
              left top
              no-repeat
            `
          })

        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {


    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();
        setloading(true);

        console.log("Mining...please wait.")
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);


      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  );

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );


  return (
    <div className="App">
      {
        loading ?
          <div className="loading">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          :
          ""}
      <div className={loading ? "container disabledbutton" : "container"}>
        <div className="nav header-container">
          <div><p className="header gradient-text nav-title">Generative NFT Collection</p> </div>
          <div className="connect">
            {currentAccount === "" ? (
              renderNotConnectedContainer()
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="container">
          <div className="row body">
            <div className="col-md-6">
              <p className="header gradient-text">Generative NFT</p>
              <p className="sub-text">
                Generative Sentences. Discover your NFT today.
              </p>
              <div className=" mint_div ">
                <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
                  Mint NFT
                </button>
                <a href="https://testnets.opensea.io/collection/the-quate-otdyyailpp"><img className="opensee" src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-White.png" alt="" srcset="" /></a>
                <a href="https://rinkeby.rarible.com/collection/0x0f1fea4b23990dbf5f918179efaf81aac7163eb2/items"><img className="rairble opensee" src=" https://global-uploads.webflow.com/60f008ba9757da0940af288e/60f29bbc7abeec44f5e53996_rarible.jpg" alt="" srcset="" /></a>
              </div>
            </div>
            <div className="col-md-6 img">
              <img src="https://storage.opensea.io/files/1385a81846a20a1c80aa0cac3f6114f2.svg" alt="" />
            </div>
          </div>
          <div className="footer-container">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a
              className="footer-text"
              href={TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`Nisam_ozr `}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;