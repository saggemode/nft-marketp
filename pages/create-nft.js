import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

import { nftaddress, nftmarketaddress } from "../config";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [message, updateMessage] = useState("");
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  async function OnChangeFile(e) {
    const file = e.target.files[0];
    try {
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        console.log("Uploaded image to Pinata: ", response.pinataURL);
        setFileUrl(response.pinataURL);
      }
    } catch (e) {
      console.log("Error during file upload", e);
    }
  }

  //1. create item (image/video) and upload to ipfs
  async function uploadMetadataToIPFS() {
    const { name, description, price } = formInput; //get the value from the form input

    //form validation
    if (!name || !description || !price || !fileUrl) {
      return;
    }

    const nftJSON = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response);
        return response.pinataURL;
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e);
    }
  }

  //2. List item for sale
  // async function createSale(url){
  //     const web3Modal = new Web3Modal();
  //     const connection = await web3Modal.connect();
  //     const provider = new ethers.providers.Web3Provider(connection);

  //     //sign the transaction
  //     const signer = provider.getSigner();
  //     let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
  //     let transaction = await contract.createToken(url);
  //     let tx = await transaction.wait()

  //     //get the tokenId from the transaction that occured above
  //     //there events array that is returned, the first item from that event
  //     //is the event, third item is the token id.
  //     console.log('Transaction: ',tx)
  //     console.log('Transaction events: ',tx.events[0])
  //     let event = tx.events[0]
  //     let value = event.args[2]
  //     let tokenId = value.toNumber() //we need to convert it a number

  //     //get a reference to the price entered in the form
  //     const price = ethers.utils.parseUnits(formInput.price, 'ether')

  //     contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  //     //get the listing price
  //     let listingPrice = await contract.getListingPrice()
  //     listingPrice = listingPrice.toString()

  //     transaction = await contract.createMarketItem(
  //         nftaddress, tokenId, price, {value: listingPrice }
  //     )

  //     await transaction.wait()

  //     router.push('/')

  // }

  async function listNFT(e) {
    e.preventDefault();

    //Upload data to IPFS
    try {
      const metadataURL = await uploadMetadataToIPFS();
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const signer = provider.getSigner();
      updateMessage("Please wait.. uploading (upto 5 mins)");

      let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
      const price = ethers.utils.parseUnits(formInput.price, "ether");
      let listingPrice = await contract.getListPrice();
      listingPrice = listingPrice.toString();

      //actually create the NFT
      let transaction = await contract.createToken(metadataURL, price, {
        value: listingPrice,
      });
      await transaction.wait();

      alert("Successfully listed your NFT!");
      updateMessage("");
      updateFormInput({ name: "", description: "", price: "" });
      router.push("/");
    } catch (e) {
      alert("Upload error" + e);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          value={formInput.name}
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset description"
          className="mt-2 border rounded p-4"
          value={formInput.description}
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Min 0.001 ETH"
          className="mt-8 border rounded p-4"
          step="0.001"
          type="number"
          value={formInput.price}
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={OnChangeFile}
        />
        <div className="text-green text-center">{message}</div>
        <button
          onClick={listNFT}
          className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg"
        >
          List NFT
        </button>
      </div>
    </div>
  );
}
