import config from "../env";
import connect from "./db";
import { ethers } from "ethers";
import factoryArtifact from "../artifacts/contracts/EventFactory.sol/EventFactory.json";
import implementationArtifact from "../artifacts/contracts/EventImplementation.sol/EventImplementation.json";
import data from "./dataToLoad";

async function main() {
  await insertEvent();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function insertEvent() {
  async function insertEventDb(proxyId) {
    const db = await connect();
    data.dbEvents[0].ethEventAddress = proxyId;
    try {
      let result = await db.collection("events").insertOne(data.dbEvents[0]);
      console.log(result);
    } catch (error) {}
  }

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
  let newEventListener = await provider.on(
    {
      topics: [`${ethers.id("EventCreated(address)")}`],
    },
    async (proxyId) => {
      console.log(
        "event deployed at beaconProxy: ",
        ethers.stripZerosLeft(proxyId.data)
      );
      await insertEventDb(ethers.stripZerosLeft(proxyId.data));
    }
  );

  const signingKey = new ethers.SigningKey(
    "0x79ed68cf5f6e968c1103aab5fa132d414fc1be328ffe71662067dbca2498e989"
  );
  const signer = new ethers.BaseWallet(signingKey, provider);

  const eventFactory = new ethers.Contract(
    // treba dodati adresu ugovora u artifacts
    "0xd49B6f81F4e16b22c872E9aA9B0a28cAD9bb8aAA",
    factoryArtifact.abi,
    signer
  );

  const eventData = {
    name: data.ethEvents[0].name,
    start: data.ethEvents[0].start,
    end: data.ethEvents[0].end,
  };

  let eventTx = await eventFactory.createEvent(
    eventData,
    data.ethEvents[0].ticketTypes,
    data.ethEvents[0].ticketSupplies,
    data.ethEvents[0].ticketPrices
  );

  let eventReceipt = await eventTx.wait();

  let [proxyAddr] = eventReceipt.logs[3].args;
  console.log("BeaconProxy deployed at address:", proxyAddr);

  // let eventProxy = new ethers.Contract(
  //   proxyAddr,
  //   implementationArtifact.abi,
  //   signer
  // );

  // console.log(await eventProxy.name());
}

async function insertArtists() {
  try {
    const db = await connect();
    const artists = db.collection("artists");

    // create an array of documents to insert

    const docs = [
      {
        address: "0x732f28c7915589F769434CE6a18F680AE113612D",
        name: "The Prodigy",
      },
      {
        address: "0x4805015544C948D007CE269C09efb04377Faf92F",
        name: "Bullet For My Valentine",
      },
      {
        address: "0x149A8a0492a7DF89c064c78CdF301806CDA2687E",
        name: "Harry Styles",
      },
      {
        address: "0xb2591fD0cEF325fa4DdEDc0A905A8B7977e40FD8",
        name: "Imagine Dragons",
      },
    ];

    // this option prevents additional documents from being inserted if one fails
    const options = { ordered: true };

    const result = await artists.insertMany(docs, options);

    console.log(`${result.insertedCount} documents were inserted`);
  } catch (error) {
    console.dir(error);
  }
}
