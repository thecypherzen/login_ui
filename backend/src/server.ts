import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import db from "./dbClient.js";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8082;
const HOST = process.env.HOST || "0.0.0.0";

// load env variables
if (!dotenv.config()) {
  console.error("ENV VARS FAILED TO LOAD");
} else {
  console.log("ENV VARS LOADED SUCCESSFULLY");
}

app.use(express.json());
app.use(express.urlencoded());

// routes
app.get("/api/v1/status", async (_: Request, res: Response) => {
  res.json({ message: "OK" });
});

app.get("/api/v1/auth/status", async (_: Request, res: Response) => {
  res.json({ dbIsReady: db.isReady });
});

// 404 handlers
app.all(/\/*/, async (_: Request, res: Response) => {
  res.status(404).json({
    code: 1,
    message: "Not Found",
  });
});

// keep alive service
const keepAlive = () => {
  const url =
    process.env.NODE_ENV === "dev"
      ? `http://${HOST}:${PORT}/api/v1/status`
      : "https://live-server";
  axios
    .get(url)
    .then((res) => {
      console.log(
        "Server alive check",
        res.data.status,
        "at",
        Date.now().toLocaleString("en-GB"),
      );
    })
    .catch((err) => {
      console.log(err?.message ?? "error");
    });
};

setInterval(keepAlive, 840000);

// server listener
const server = app.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});

// server configs
server.keepAliveTimeout = 61 * 1000;
server.headersTimeout = 65 * 1000;
