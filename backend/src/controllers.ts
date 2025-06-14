import { Request, Response } from "express";
import { passLib } from "./utils";
import { Prisma } from "@prisma/client";
import db from "./dbClient";

type CredentialsType = {
  username: string | undefined;
  password: string | undefined;
};

const signupController = async (req: Request, res: Response) => {
  console.log("signup endpoint called with:\n", req.body);
  const { username, password }: CredentialsType = req.body;

  // handle missing credentials
  if (!username || !password) {
    res.status(400).json({
      code: 2,
      message: `Missing ${!username && !password ? "username and password" : !username ? "username" : "password"}`,
    });
    return;
  }

  try {
    const existingUser = await db.client.user.findUnique({
      where: { username },
    });
    // handle already existing user
    if (existingUser) {
      res.status(400).json({
        code: 5,
        message: `Username ${username} already in use`,
      });
      return;
    }
    // hash password
    const passwdHash = await passLib.generate(password);
    if (!passwdHash) {
      res.status(500).json({
        code: 3,
        message: "An internal error occured. Try again later",
      });
      return;
    }
    // create user
    const data = {
      username,
      password: passwdHash,
      email: username,
    } as Prisma.UserCreateInput;
    const user = await db.client.user.create({ data });
    res.json({
      code: 0,
      user,
    });
  } catch (err: Error | any) {
    console.log(err);
    res.status(500).json({
      code: 3,
      message: err?.message ?? "Some error occured",
      details: JSON.stringify(err),
    });
  }
};

// login controller
const loginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      code: 2,
      message: `Missing ${!username && !password ? "username and password" : !username ? "username" : "password"}`,
    });
    return;
  }

  try {
    const user = await db.client.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      res.status(404).json({ code: 1, message: "User not found" });
      return;
    }
    // verify password matches
    const passwdsMatch = await passLib.verify(user.password, password);
    if (!passwdsMatch) {
      res.status(400).json({
        code: 4,
        message: "Wrong password",
      });
      return;
    }
    res.json({ code: 0, ...user });
  } catch (err: Error | any) {
    res.status(500).json({
      code: 3,
      message: err?.message ?? "some error occured",
      details: JSON.stringify(err),
    });
  }
};

export { loginController, signupController };
