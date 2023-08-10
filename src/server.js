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

app.get("/venues", formatToTitleCase, (req, res) => {
  let searchTerm = req.query._any;

  let venues = storage.venues;
  if (searchTerm) {
    venues = venues.filter((el) => {
      // @ts-ignore
      return el.name.indexOf(searchTerm) >= 0;
    });
  }

  res.status(200).send(venues);
  return;
});

app.get("/artists", formatToTitleCase, (req, res) => {
  let searchTerm = req.query._any;
  let artists = storage.artists;
  if (searchTerm) {
    artists = artists.filter((el) => {
      // @ts-ignore
      return el.name.indexOf(searchTerm) >= 0;
    });
  }

  res.status(200).send(artists);
  return;
});

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
