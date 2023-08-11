import config from "../env";
import connect from "./db";

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

insertArtists();
