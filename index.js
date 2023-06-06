import express from "express";
import morgan from "morgan";
import cors from "cors";
import { nanoid } from "nanoid";
import handleServerSentEvents from "./sse.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const stuff = [
  {
    id: nanoid(),
    from: "David",
    text: "handdoeken",
  },
  {
    id: nanoid(),
    from: "Mehdi",
    text: "vape",
  },
  {
    id: nanoid(),
    from: "Mehdi",
    text: "Badmuts",
  },
];

app.post("/stuff", (req, res) => {
  console.log(req.body);
  stuff.push({
    id: nanoid(),
    ...req.body,
  });
  console.log(req.body);
  res.json({ status: "ok" });
  sendToAllClients();
});

app.get("/stuff", (req, res) => {
  res.json(stuff);
});

const clients = [];
app.get("/sse", handleServerSentEvents(stuff, clients));

function sendToAllClients() {
  clients.forEach((c) => c.res.write(`data: ${JSON.stringify(stuff)}\n\n`));
}

app.listen("1234", function () {
  console.log("🚀 Server is listening on localhost:1234");
});
