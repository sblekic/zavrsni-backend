import express from "express";
import cors from "cors";
import storage from "./memory_storage";

const app = express(); // instanciranje aplikacije
const port = 3000; // port na kojem će web server slušati

app.use(cors()); // omogući CORS na svim rutama
app.use(express.json()); // automatsko dekodiranje JSON poruku

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

app.listen(port, () =>
  console.log("Slušam na: \x1b[36m%s\x1b[0m", `http://127.0.0.1:${port}`)
);
