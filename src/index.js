import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

import storage from "./memory_storage";

const app = express(); // instanciranje aplikacije
const port = process.env.PORT || 3001; // env var PORT je postavljena u slučaju da hosting koji ću koristiti (render) ima već postavljenu PORT var kao default
// omogući CORS na svim rutama
// dopusti credentials poput kolačića u cross-origin zahtjevima
app.use(cors({ credentials: true }));
app.use(express.json()); // automatsko dekodiranje JSON poruku
app.use(bodyParser.json()); // req.body je undefined bez ovoga
app.use(cookieParser());

const messageConfig = {
  domain: process.env.APP_DOMAIN,
  statement: "Please sign this message to confirm your identity.",
  uri: process.env.APP_URI,
  timeout: 60,
};

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
  console.log(req.body);
  const { address, chain, network } = req.body;

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
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
});

app.get("/authenticate", async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) return res.sendStatus(403); // if the user did not send a jwt token, they are unauthorized

  try {
    const data = jwt.verify(token, process.env.AUTH_SECRET);
    res.json(data);
  } catch {
    return res.sendStatus(403);
  }
});

app.get("/logout", async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.sendStatus(200);
  } catch {
    return res.sendStatus(403);
  }
});

const startServer = async () => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  app.listen(port, () =>
    console.log("Slušam na: \x1b[36m%s\x1b[0m", `http://127.0.0.1:${port}`)
  );
};

// Call startServer()
startServer();
