/**
 * API Entry point
 * Defines all routes and exposes endpoints. It's a simple server, so it's best this way.
 */
import express, { Request, Response, NextFunction } from "express";
import {
  loginController,
  logoutController,
  signupController,
} from "./controllers";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// init
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8082;
const HOST = process.env.HOST || "0.0.0.0";

// load env variables
const vars = dotenv.config();
if (!vars) {
  console.error("ENV VARS FAILED TO LOAD");
} else {
  console.log("ENV VARS LOADED SUCCESSFULLY");
}

const setResHeaders = (res: Response): void => {
  res.setHeader("Cache-control", "no-cache, max-age=0");
  res.setHeader("Pragma", "no-cache");
};

// config
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded());
app.use(
  cors({
    origin: [
      process.env.DEV_CLIENT_URL as string,
      process.env.LIVE_CLIENT_URL as string,
    ],
    credentials: true,
  })
);
app.use(cookieParser());

// routes
app.get("/api/v1/status", async (_: Request, res: Response) => {
  res.json({ message: "OK" });
});
app.post(
  "/api/v1/auth/login",
  (_: Request, res: Response, next: NextFunction) => {
    setResHeaders(res);
    next();
  },
  loginController
);
app.post(
  "/api/v1/auth/logout",
  (_: Request, res: Response, next: NextFunction) => {
    setResHeaders(res);
    next();
  },
  logoutController
);
app.post(
  "/api/v1/auth/signup",
  (_: Request, res: Response, next: NextFunction) => {
    setResHeaders(res);
    next();
  },
  signupController
);

// 404 handlers
app.all(/\/*/, async (_: Request, res: Response) => {
  res.status(404).json({
    code: 1,
    message: "Requested resouce does not exist",
  });
});

// keep alive service
const keepAlive = () => {
  const url =
    process.env.NODE_ENV === "dev"
      ? `http://${HOST}:${PORT}/api/v1/status`
      : `${process.env.LIVE_API_URL}`;
  axios
    .get(url)
    .then((res) => {
      console.log(
        "Server alive check",
        res.data.message,
        "at",
        new Date().toLocaleString("en-GB")
      );
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err?.message ?? "error");
    });
};
const keepAliveInterval = 40 * 60 * 1000; // every 40mins in ms
setInterval(keepAlive, 2400000);

// server listener
const server = app.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});

// server configs
server.keepAliveTimeout = 61 * 1000;
server.headersTimeout = 65 * 1000;
