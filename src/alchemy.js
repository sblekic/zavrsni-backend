// Setup. Ovdje bih mogao definirati konekciju sa web3 poput db.js
import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: process.env.ALCHEMY_API,
  network: Network.MATIC_MUMBAI,
};

const alchemy = new Alchemy(settings);

// Get the latest block
const latestBlock = alchemy.core.getBlockNumber();

// Get all outbound transfers for a provided address
alchemy.core
  .getTokenBalances("0x994b342dd87fc825f66e51ffa3ef71ad818b6893")
  .then(console.log);

// Get all the NFTs owned by an address
const nfts = alchemy.nft.getNftsForOwner("vitalik.eth");

// Listen to all new pending transactions
// alchemy.ws.on(
//   { method: "alchemy_pendingTransactions", fromAddress: "vitalik.eth" },
//   (res) => console.log(res)
// );
