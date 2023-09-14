import config from "../env";
import connect from "./db";
import { ethers } from "ethers";
import factoryArtifact from "../artifacts/contracts/EventFactory.sol/EventFactory.json";
import data from "./polygonData";

async function main() {
  const db = await connect();

  // mijenjaj ovisno o provideru; dev vs prod
  const provider = new ethers.JsonRpcProvider(process.env.NODE_PROVIDER_URL);

  // kreacija "walleta"
  // @ts-ignore
  const signingKey = new ethers.SigningKey(process.env.PRIVATE_KEY);
  const signer = new ethers.BaseWallet(signingKey, provider);

  const eventFactory = new ethers.Contract(
    // treba dodati adresu ugovora u artifacts, ovo mijenjas svaki put kada se ugovor kompajlira
    factoryArtifact.contractAddress,
    factoryArtifact.abi,
    signer
  );

  let i = 0;

  let newEventListener = await provider.on(
    {
      topics: [`${ethers.id("EventCreated(address)")}`],
    },
    async (proxyId) => {
      console.log(
        "event deployed at beaconProxy: ",
        ethers.stripZerosLeft(proxyId.data)
      );
      await insertEventDb(ethers.stripZerosLeft(proxyId.data), i, db);
      i++;
      if (i < data.ethEvents.length) {
        await insertEvent(eventFactory, i);
      } else {
        console.log("it is done");
        // db konekcija ostaje otvorena pa izađem is scripta ovako jer mi se ne da modificirati db.js
        process.exit();
      }
    }
  );

  // await insertArtists();
  // await insertVenues();

  await insertEvent(eventFactory, i);
  return;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function insertEventDb(proxyId, eventIndex, db) {
  data.dbEvents[eventIndex].ethEventAddress = proxyId;
  try {
    let result = await db
      .collection("events")
      .insertOne(data.dbEvents[eventIndex]);
    console.log(result);
  } catch (error) {}
}

async function insertEvent(eventFactory, eventIndex) {
  const eventData = {
    name: data.ethEvents[eventIndex].name,
    start: data.ethEvents[eventIndex].start,
    end: data.ethEvents[eventIndex].end,
  };

  let eventTx = await eventFactory.createEvent(
    eventData,
    data.ethEvents[eventIndex].ticketTypes,
    data.ethEvents[eventIndex].ticketSupplies,
    data.ethEvents[eventIndex].ticketPrices
  );

  let eventReceipt = await eventTx.wait();
}

async function insertArtists() {
  try {
    const db = await connect();
    const artists = db.collection("artists");

    // create an array of documents to insert

    const docs = [
      {
        address: "0x732f28c7915589f769434ce6a18f680ae113612d",
        name: "Nipplepeople",
      },
      {
        address: "0x4805015544c948d007ce269c09efb04377faf92f",
        name: "Rage Against The Machine",
      },
      {
        address: "0x149a8a0492a7df89c064c78cdf301806cda2687e",
        name: "Eros Ramazzotti",
      },
      {
        address: "0xb2591fd0cef325fa4ddedc0a905a8b7977e40fd8",
        name: "Imagine Dragons",
      },
      {
        address: "0xae52e68a9583823add0a064bb12a05fee1be742c",
        name: "Bullet For My Valentine",
      },
      {
        address: "0x6ffebdcdd84246231d2a83e819b8fb54791064e7",
        name: "Jinjer",
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

async function insertVenues() {
  try {
    const db = await connect();
    const venues = db.collection("venues");

    // create an array of documents to insert

    const docs = [
      {
        name: "Tvornica Kulture",
        capacity: 2200,
        address: {
          streetAddress: "Šubićeva ulica 2",
          city: "Zagreb",
          postalCode: 10000,
        },
      },
      {
        name: "Pogon Kulture",
        capacity: 600,
        address: {
          streetAddress: "Strossmayerova 1",
          city: "Rijeka",
          postalCode: 51000,
        },
      },
      {
        name: "Klub Crkva",
        capacity: 600,
        address: {
          streetAddress: "Ružićeva 22",
          city: "Rijeka",
          postalCode: 51000,
        },
      },
      {
        name: "Arena Zagreb",
        capacity: 24000,
        address: {
          streetAddress: "Ul. Vice Vukova 8",
          city: "Zagreb",
          postalCode: 10000,
        },
      },
      {
        name: "Arena Pula",
        capacity: 25000,
        address: {
          streetAddress: "Flavijevska ulica",
          city: "Pula",
          postalCode: 52100,
        },
      },
    ];

    // this option prevents additional documents from being inserted if one fails
    const options = { ordered: true };

    const result = await venues.insertMany(docs, options);

    console.log(`${result.insertedCount} documents were inserted`);
  } catch (error) {
    console.dir(error);
  }
}
