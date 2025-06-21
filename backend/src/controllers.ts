/**
 * controllers - a module that creates and exposes various controllers for the backend.
 * - They are:
 * - signUpController - for signup sequence
 * - loginController - for login sequence
 * - logoutController - for logout sequence
 */
import { Request, Response } from "express";
import { cookiesLib, passLib, tokenLib } from "./utils";
import { Prisma } from "@prisma/client";
import db from "./dbClient";

const signupController = async (req: Request, res: Response) => {
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
      id: user.id,
    });
  } catch (err: Error | any) {
    // handle error
    res.status(500).json({
      code: 3,
      message: err?.message ?? "Some error occured",
      details: JSON.stringify(err),
    });
  }
};

// login controller
const loginController = async (req: Request, res: Response) => {
  // login with token
  const { authToken } = req.cookies;
  if (authToken) {
    try {
      console.log("LOGGING IN WITH TOKEN", authToken);
      // handle expired token
      const { payload, expired } = await tokenLib.decompose(authToken);
      if (expired) {
        res.status(400).json({
          code: 5,
          message: "Auth token expired",
        });
        return;
      }
      // fetch user from db and handle 404
      const user = await db.client.user.findUnique({
        where: { id: payload?.id, username: payload?.username },
      });
      if (!user) {
        res.status(404).json({
          code: 1,
          message: "User not found",
        });
        return;
      }
      // filter user model fields
      const filteredUser = await db.filterModel({ ...user, authToken });
      res.json({
        code: 0,
        user: filteredUser,
      });
      return;
    } catch (err: Error | any) {
      // handle error
      res.status(500).json({
        code: 3,
        message: err?.message ?? "Some error occured",
        details: JSON.stringify(err),
      });
      return;
    }
  }
  // login with credentials
  const { username, password } = req.body;
  console.log("LOGGING IN WITH CREDENTIALS...", username, password);
  // handle missing values
  if (!username && !password) {
    res.status(400).json({
      code: 5,
      message: "Auth token expired",
    });
    return;
  }
  if (!username || !password) {
    res.status(400).json({
      code: 2,
      message: `Missing ${!username ? "username" : "password"}`,
    });
    return;
  }

  try {
    // get user from db
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
    // generate auth token, set cookie and return
    const authToken = await tokenLib.generate({
      id: user.id,
      username: user.username,
    });
    cookiesLib.set(res, { name: "authToken", value: authToken });
    const filteredUser = await db.filterModel(user);
    res.json({ code: 0, user: filteredUser });
  } catch (err: Error | any) {
    res.status(500).json({
      code: 3,
      message: err?.message ?? "Some error occured",
      details: JSON.stringify(err),
    });
  }
};

// logout controller
const logoutController = async (req: Request, res: Response) => {
  // login with token
  const { authToken } = req.cookies;
  if (!authToken) {
    res.status(400).json({
      code: 5,
      message: "Auth token expired",
    });
    return;
  }
  try {
    // handle expired token
    const { payload, expired } = await tokenLib.decompose(authToken);
    if (expired) {
      res.status(400).json({
        code: 5,
        message: "Auth token expired or not logged in",
      });
      return;
    }
    // fetch user from db and handle 404
    const user = await db.client.user.findUnique({
      where: { id: payload?.id, username: payload?.username },
    });
    if (!user) {
      res.status(404).json({
        code: 1,
        message: "User not found",
      });
      return;
    }
    cookiesLib.clear(res, { name: "authToken" });
    res.status(200).end();
    return;
  } catch (err: Error | any) {
    // handle error
    res.status(500).json({
      code: 3,
      message: err?.message ?? "Some error occured",
      details: JSON.stringify(err),
    });
    return;
  }
};

// TYPE DEFINITIONS
// Credentials
type CredentialsType = {
  username: string | undefined;
  password: string | undefined;
};

export { loginController, logoutController, signupController };
