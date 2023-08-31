import express from "express";
import config from "../env";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import Moralis from "moralis";
import _ from "lodash";

import authRoutes from "./routes/authRoutes";
import connect from "./db";
import storage from "./memory_storage";

import asyncHandler from "express-async-handler";

import { verifyToken } from "./middleware/authHandler";
import { formatToTitleCase } from "./middleware/formatToTitleCase";

import { ObjectId } from "mongodb";

const app = express(); // instanciranje aplikacije

// iz https://stackoverflow.com/questions/18864677/what-is-process-env-port-in-node-js
// env var PORT je postavljena u slučaju da hosting koji ću koristiti (render) ima već postavljenu PORT var kao default
const port = process.env.PORT || 3000;

// omogući CORS na svim rutama
// dopusti credentials poput kolačića u cross-origin zahtjevima
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173/",
      "https://showstarter.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json()); // automatsko dekodiranje JSON poruku
app.use(bodyParser.json()); // req.body je undefined bez ovoga
app.use(cookieParser());

// vraca sve ulaznice određenog korisnika.
app.get(
  "/tickets/:userId",
  asyncHandler(async (req, res) => {
    console.log("get user tickets", req.params.userId);
    let filter = {
      owner: req.params.userId,
    };
    let db = await connect();
    let cursor = await db.collection("tickets").find(filter);
    let result = await cursor.toArray();
    res.send(result);
  })
);

// ulaznice koje su u preprodaji
app.get(
  "/tickets/event/:eventId",
  asyncHandler(async (req, res) => {
    console.log("get listed tickets");
    let filter = {
      isListed: true,
    };
    let eventId = req.params.eventId;
    let db = await connect();
    let cursor = await db
      .collection("tickets")
      .find({ $and: [{ isListed: true }, { eventAddress: eventId }] });
    let result = await cursor.toArray();
    res.send(result);
  })
);

// prodaja ulaznice = kreacija metapodataka
app.post(
  "/tickets",
  asyncHandler(async (req, res) => {
    let db = await connect();
    let ticketMeta = req.body;

    console.log("posting ticket metadata", ticketMeta);

    ticketMeta.isScanned = false;
    ticketMeta.isListed = false;

    let result = await db.collection("tickets").insertOne(ticketMeta);

    // decrease ticketSupply number only if greater than zero
    let supplyChange = await db.collection("events").updateOne(
      {
        ethEventAddress: ticketMeta.eventAddress,
        "tickets.supply": { $gt: 0 },
      },
      { $inc: { "tickets.$[ticket].supply": -1 } },
      { arrayFilters: [{ "ticket.type": `${ticketMeta.type}` }] }
    );
    console.log(supplyChange);

    if (result.acknowledged == true) {
      res.json({
        status: "success, respect ➕",
        id: result.insertedId,
      });
    } else {
      res.status(500).json({
        status: "mission failed",
      });
    }
  })
);

// skeniranje i preprodaja ulaznica
app.patch(
  "/tickets/:id",
  asyncHandler(async (req, res) => {
    console.log("scan ticket", req.params.id);
    let filter = {
      _id: new ObjectId(req.params.id),
    };
    let properties = req.body;
    let updateDoc = {
      $set: properties,
    };
    let db = await connect();

    let result = await db.collection("tickets").updateOne(filter, updateDoc);
    console.log("rezultat db transakcije", result);
    res.send(result);
  })
);

app.get(
  "/events",
  formatToTitleCase,
  asyncHandler(async (req, res) => {
    console.log("get all events route");
    let query = req.query;
    let db = await connect();

    let artistFilter = {};
    let venueFilter = {};

    if (query._any) {
      // @ts-ignore
      artistFilter["lineup.name"] = new RegExp(query._any);
      // @ts-ignore
      venueFilter["venue.city"] = new RegExp(query._any);

      let search = await db
        .collection("events")
        .find({ $or: [artistFilter, venueFilter] });
      search = await search.toArray();
      search = search.map((doc) => {
        return {
          id: doc.ethEventAddress,
          name: doc.name,
        };
      });
      res.send(search);
      // return sam stavio kako se ruta ne bi izvrsila do kraja
      return;
    }

    let cursor = await db.collection("events").find().sort({ startTime: 1 });
    let result = await cursor.toArray();
    res.send(result);
  })
);

app.get(
  "/events/:id",
  asyncHandler(async (req, res) => {
    console.log("event by id route");
    let filter = {
      ethEventAddress: req.params.id,
    };
    let db = await connect();
    let result = await db.collection("events").findOne(filter);
    res.send(result);
  })
);

app.post(
  "/events",
  asyncHandler(async (req, res) => {
    let db = await connect();
    let event = req.body;
    console.log("posting event:", event);
    let result = await db.collection("events").insertOne(event);

    if (result.acknowledged == true) {
      res.json({
        status: "success, respect ➕",
        id: result.insertedId,
      });
    } else {
      res.status(500).json({
        status: "mission failed",
      });
    }
  })
);

app.get(
  "/venues",
  formatToTitleCase,
  asyncHandler(async (req, res) => {
    let query = req.query;
    let filter = {};

    if (query._any) {
      // @ts-ignore
      filter["name"] = new RegExp(query._any);
    }

    let db = await connect();
    let cursor = await db.collection("venues").find(filter);
    let venues = await cursor.toArray();
    res.status(200).send(venues);
    return;
  })
);

app.get(
  "/artists",
  formatToTitleCase,
  asyncHandler(async (req, res) => {
    let query = req.query;
    let filter = {};

    if (query._any) {
      // @ts-ignore
      filter["name"] = new RegExp(query._any);
    }

    let db = await connect();
    let cursor = await db.collection("artists").find(filter);
    let artists = await cursor.toArray();

    res.status(200).send(artists);
    return;
  })
);

app.get("/", (req, res) => res.send("Hello World, ovaj puta preko browsera!"));

app.get(
  "/db_posts",
  asyncHandler(async (req, res) => {
    let db = await connect();
    let cursor = await db.collection("posts").find();
    let results = await cursor.toArray();
    console.log(results);
  })
);

// sa verifyToken testiram ako će se pokrenuti sljedeci handler ako nemam jwt
app.get("/posts", verifyToken, (req, res) => {
  res.json(storage.posts); // vraćamo postove direktno koristeći `json` metodu
});

app.post("/posts", (req, res) => {
  let data = req.body;
  // ovo inače radi baza (autoincrement ili sl.), ali čisto za primjer
  data.id = 1 + storage.posts.reduce((max, el) => Math.max(el.id, max), 0);
  // dodaj u našu bazu (lista u memoriji)
  storage.posts.push(data);
  // vrati ono što je spremljeno
  res.json(data); // vrati podatke za referencu
});

app.use("/auth", authRoutes);

app.use(errorHandler); // po express dokumentaciji ide zadnji. valjda jer je zadnji middleware u stack?

const startServer = async () => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  app.listen(port, () => console.log(`Backend sluša na port ${port}`));
};

startServer();
