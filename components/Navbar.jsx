import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import {ethers } from 'ethers'
import Web3Modal from 'web3modal'

const Navbar = () => {
  const [connected, toggleConnect] = useState(false);
  const router = useRouter();
  const [currAddress, updateAddress] = useState('0x');
  
  async function getAddress() {
    const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }
  
  function updateButton() {
    const ethereumButton = document.querySelector('.enableEthereumButton');
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }
  
  async function connectWebsite() {
  
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if(chainId !== '0x5')
      {
        //alert('Incorrect network! Switch your metamask network to Rinkeby');
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x5' }],
       })
      }  
      await window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(() => {
          updateButton();
          console.log("here");
          getAddress();
          window.location.replace(location.pathname)
        });
  }
  
    useEffect(() => {
      let val = window.ethereum.isConnected();
      if(val)
      {
        console.log("here");
        getAddress();
        toggleConnect(val);
        updateButton();
      }
  
      window.ethereum.on('accountsChanged', function(accounts){
        window.location.replace(location.pathname)
      })
    });

  return (
    <nav className="border-b p-2">
      {/* <p className="text-4xl font-bold">Metaverse Marketplace</p> */}
      <ul className="flex items-end justify-between py-3 bg-transparent text-white pr-5">
        <li className="flex items-end ml-5 pb-2">
        <Link href="/">
            <a className="mr-4 text-pink-500">Home</a>
          </Link>

          <Link href="/create-nft">
            <a className="mr-6 text-pink-500">Sell NFT</a>
          </Link>

          <Link href="/my-nfts">
            <a className="mr-6 text-pink-500">My NFTs</a>
          </Link>

          <Link href="/dashboard">
            <a className="mr-6 text-pink-500">Dashboard</a>
          </Link>
        </li>
        <ul className="lg:flex justify-between font-bold mr-10 text-lg">
         
        </ul>
        <li>
        

          <li>
                <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" >connect</button>
              </li>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
