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
  console.log(`Contract EventFactory deployed at address: ${factoryAddress}`);

  saveAbiFrontend(factoryAddress, "EventFactory");
  saveAbiFrontend(implementationAddress, "EventImplementation");

  // ovo su testovi, bilo bi pametnije koristiti alate koje hh nudi ali eto, I live a dangerous life

  // // console.log(eventFactory.interface.fragments);
  // let eventTx = await eventFactory.createEvent(
  // ["The Prodigy u Tvornici Kulture", 1694368800, 1694379600],
  // ["GA", "VIP"],
  // // kolicina ulaznica po kategoriji
  // [500, 100],
  // //cijena ulaznica u wei
  // [35503483779348000n, 88758709448370000n]
  // );

  // let eventReceipt = await eventTx.wait();

  // let [proxyAddr] = eventReceipt.logs[3].args;
  // console.log("BeaconProxy deployed at address:", proxyAddr);

  // // mijenjaj ovisno ako se radi hre node ili ganache
  // let signer = await hre.ethers.getSigner(
  //   "0x5D9b9cC9Ba98881F5DEfAE78263283E79FFdC449"
  // );

  // let eventInstance = await hre.ethers.getContractAt(
  //   "EventImplementation",
  //   proxyAddr,
  //   signer
  // );

  // let buyTicketTx = await eventInstance.buyTicket("GA", {
  //   value: hre.ethers.parseEther("0.035503483779348"),
  // });

  // let buyTicketReceipt = await buyTicketTx.wait();

  // console.log(
  //   "tokenURI funkcija vraća endpoint:",
  //   await eventInstance.tokenURI(1)
  // );

  // // console.log(await eventInstance.ownerOf(1));
  // let ticketData = await eventInstance.tickets("GA");
  // console.log(
  //   "Struct Ticket za ovaj ugovor ima sljedeće vrijednosti: ",
  //   ticketData
  // );

  // console.log(await eventFactory.getEventBeacon());
}

// helper funkcija koja mi sprema abi ugovora po želji na frontendu
function saveAbiFrontend(contractAddress, fileName) {
  const factoryAbi = {
    contractAddress,
  };
  factoryAbi.abi = hre.artifacts.readArtifactSync(fileName).abi;

  // console.log(factoryAbi);
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
