import express, { Request, Response, NextFunction } from "express";
import { loginController } from "./controllers";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

// init
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8082;
const HOST = process.env.HOST || "0.0.0.0";

// load env variables
if (!dotenv.config()) {
  console.error("ENV VARS FAILED TO LOAD");
} else {
  console.log("ENV VARS LOADED SUCCESSFULLY");
}

// config
app.use(express.json());
app.use(express.urlencoded());
app.use(
  cors({
    origin: [process.env.DEV_CLIENT_URL as string],
  }),
);

// routes
app.get("/api/v1/status", async (_: Request, res: Response) => {
  res.json({ message: "OK" });
});

app.post("/api/v1/auth/login", loginController);

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
        res.data.message,
        "at",
        new Date().toLocaleString("en-GB"),
      );
      console.log(res.data);
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
