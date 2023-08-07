// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const eventImplementation = await hre.ethers.deployContract(
    "EventImplementation"
  );
  await eventImplementation.waitForDeployment();
  const implementationAddress = await eventImplementation.getAddress();
  console.log(
    `Contract EventImplementation deployed at address ${implementationAddress}`
  );

  const eventFactory = await hre.ethers.deployContract("EventFactory", [
    implementationAddress,
  ]);
  await eventFactory.waitForDeployment();
  const factoryAddress = await eventFactory.getAddress();
  console.log(`Contract EventFactory deployed at address ${factoryAddress}`);

  saveAbiFrontend(factoryAddress, "EventFactory");

  // console.log(eventFactory.interface.fragments);
  await eventFactory.createEvent(
    ["prodigy", 1694368800, 1694379600],
    ["GA", "VIP"],
    [500, 100],
    [55, 140]
  );
}

function saveAbiFrontend(contractAddress, fileName) {
  const factoryAbi = {
    contractAddress,
  };
  factoryAbi.abi = hre.artifacts.readArtifactSync("EventFactory").abi;

  console.log(factoryAbi);
  const abiDir = process.env.FRONTEND_DIR;

  // @ts-ignore
  if (!fs.existsSync(abiDir)) {
    // @ts-ignore
    fs.mkdirSync(abiDir);
  }

  fs.writeFileSync(
    abiDir + `/${fileName}.json`,
    JSON.stringify(factoryAbi, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
