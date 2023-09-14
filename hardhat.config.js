require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

// require("dotenv").config({ path: `.env.development` });
require("dotenv").config({ path: `.env.production` });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "ganache",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545",
    },
    mumbai: {
      url: process.env.NODE_PROVIDER_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API,
  },
};
