const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const DrugSupplyChain = await ethers.getContractFactory("DrugSupplyChain");

  console.log("Deploying contract...");

  // Deploy the contract
  const contract = await DrugSupplyChain.deploy();

  // Wait for the deployment to complete
  await contract.waitForDeployment();

  // Get the deployed contract address
  const address = await contract.getAddress();

  console.log("Contract deployed successfully!");
  console.log("Contract Address:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
