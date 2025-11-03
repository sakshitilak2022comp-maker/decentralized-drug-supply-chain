require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const path = require("path");

module.exports = {
  solidity: "0.8.19",
  paths: {
    sources: path.join(__dirname, "backend/contracts"),   // ✅ tell Hardhat where contracts are
    artifacts: path.join(__dirname, "artifacts"),         // store build output here
  },
  networks: {
    sepolia: {
      url: process.env.INFURA_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
