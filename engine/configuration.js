/*
Private Key Encryption
Replace hhraw with your contract 
owner wallet private key "0xPRIVATEKEY"
*/

import SimpleCrypto from "simple-crypto-js"
const cipherKey = "#ffg3$dvcv4rtkljjkh38dfkhhjgt"
const hhraw = "0xREPLACEWITHPRIVATEKEY";
export const simpleCrypto = new SimpleCrypto(cipherKey)
export const cipherEth = simpleCrypto.encrypt(hhraw)
export const cipherHH = simpleCrypto.encrypt(hhraw)

/*
MARKET AND NFT CONTRACTS
*/
export var hhresell = "0x1B2cc1A8541bd42C24D69e441423daBe1780d529";
export var hhnftcol = "0xe3AC0395bCF534fa85416c4a8A539705fB540Ec6";
export var hhnft = "0x647000F9180A49B05B46773415AbD8d4A414C324";
export var hhmarket = "0x78b35489B7671Bd19dEb8eB6b8b28de1b8e84916";
export var hhrpc = "http://localhost:8545";
/*
NETWORK RPC ADDRESSES, Choose one then 
change the value of "hhrpc" below.
*/
var mumbai = 'https://matic-mumbai.chainstacklabs.com';
var goerli = 'https://rpc.ankr.com/eth_goerli';
var rinkeby = 'https://rpc.ankr.com/eth_rinkeby';

/*
CHANGE THIS TO YOUR PREFERRED TESTNET
*/
var hhrpc = goerli;
/*
Global Parameters
*/
export var mainnet = hhrpc

/*
DON'T FORGET TO SAVE!
*/