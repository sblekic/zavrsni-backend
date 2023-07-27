import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { errorHandler } from "./middleware/errorHandler";
const dotenv = require("dotenv");

import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

import storage from "./memory_storage";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express(); // instanciranje aplikacije

// iz https://stackoverflow.com/questions/18864677/what-is-process-env-port-in-node-js
// env var PORT je postavljena u slučaju da hosting koji ću koristiti (render) ima već postavljenu PORT var kao default
const port = process.env.PORT || 3000;

// omogući CORS na svim rutama
// dopusti credentials poput kolačića u cross-origin zahtjevima
app.use(
  cors({
    origin: ["http://localhost:5173", "https://showstarter.netlify.app"],
    credentials: true,
  })
);
app.use(express.json()); // automatsko dekodiranje JSON poruku
app.use(bodyParser.json()); // req.body je undefined bez ovoga
app.use(cookieParser());

const messageConfig = {
  // domain i uri moraju biti u skladu sa frontendom, odnosno ne mogu ovdje označiti url gdje vite hosta ne networku (http://192.168.1.107:5173) a potpisati message sa localhost-a
  domain: process.env.APP_DOMAIN,
  statement: "Please sign this message to confirm your identity.",
  uri: process.env.APP_URI,
  timeout: 60,
};

// gledam kako se napiše custom error
app.get("/errorTest", (request, response) => {
  // throw an error with status code of 400
  let error = new Error(`Glavna poruka greške koja inače sadrži neki kod`);
  error.name = "IME GRESKE";
  // @ts-ignore
  error.statusCode = 6969; // ts izbaci grešku jer u interface nije ništa drugo definirano. ali mogu ja staviti u objektu šta god želim I guess
  throw error;
});

app.get("/", (req, res) => res.send("Hello World, ovaj puta preko browsera!"));

app.get("/posts", (req, res) => {
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

// request message to be signed by client
app.post("/request-message", async (req, res) => {
  // console.log("sadržaj request body: ", req.body);
  const { address, chain, network } = req.body;
  console.log("request message api connected");

  try {
    const message = await Moralis.Auth.requestMessage({
      address,
      chain,
      ...messageConfig,
    });

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
});

app.post("/verify", async (req, res) => {
  try {
    const { message, signature } = req.body;

    const { address, profileId } = (
      await Moralis.Auth.verify({
        message,
        signature,
        networkType: "evm",
      })
    ).raw;

    const user = { address, profileId, signature };

    // create JWT token
    const token = jwt.sign(user, process.env.AUTH_SECRET);

    // set JWT cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    console.log("user objekt", user);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
});

app.get("/authenticate", async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log("No token sent");
    return res.sendStatus(403); // if the user did not send a jwt token, they are unauthorized
  }
  try {
    const data = jwt.verify(token, process.env.AUTH_SECRET);
    res.json(data);
  } catch {
    return res.sendStatus(403);
  }
});

app.get("/logout", async (req, res) => {
  try {
    res.clearCookie("jwt", {
      sameSite: "none",
      secure: true,
    });
    return res.sendStatus(200);
  } catch {
    return res.sendStatus(403);
  }
});

app.use(errorHandler); // po express dokumentaciji ide zadnji. valjda jer je zadnji middleware u stack?

const startServer = async () => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  app.listen(port, () =>
    // console.log("Slušam na: \x1b[36m%s\x1b[0m", `http://127.0.0.1:${port}`)
    console.log(`backend sluša na port ${port}`)
  );
};

// Call startServer()
startServer();
