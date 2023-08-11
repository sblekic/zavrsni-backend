import { MongoClient, ServerApiVersion } from "mongodb";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_STRING, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db = null;

export default async () => {
  // db inicijaliziran i klijent je još spojen
  if (db && client) {
    return db;
  } else {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection to the selected db
      await client.db("showStarter").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
      // navedem koji db želim koristiti
      db = client.db("showStarter");
      return db;
    } catch (err) {
      throw new Error("Spajanje na bazu nije uspjelo: " + err);
    }
  }
};
