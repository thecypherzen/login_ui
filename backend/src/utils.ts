/**
 * Utils - A module containing api utility Libraries
 *
 * Libraries:
 * 1. passLib - password library - for password encryption and verification
 *    - uses argon2id
 */
import { argon2id, hash, verify } from "argon2";
import jwt from "jsonwebtoken";
import { Response } from "express";

// password library
const passLib = {
  // generate password hash
  generate: async (password: string): Promise<string | null> => {
    try {
      const Hash = await hash(password, {
        type: argon2id,
        memoryCost: 15360,
        parallelism: 2,
        timeCost: 3,
      });
      return Hash;
    } catch (_) {
      return null;
    }
  },
  // verify hash
  verify: async (passHash: string, passwd: string): Promise<boolean> => {
    try {
      const matches = await verify(passHash, passwd);
      return matches;
    } catch (_) {
      return false;
    }
  },
};

const tokenLib = {
  // generate token from payload
  generate: async (
    payload: TokenPayloadType,
    options: object = {
      expiresIn: "7d",
    },
  ): Promise<string> => {
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      throw new Error("Auth token generation failed");
    }
    return jwt.sign(payload, secret, options);
  },

  // extract payload from auth token
  decompose: async (
    token: string,
  ): Promise<{ payload: TokenPayloadType | null; expired: boolean }> => {
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      throw new Error("Auth token validation failed");
    }
    try {
      const payload = jwt.verify(token, secret) as TokenPayloadType;
      return { payload, expired: false };
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return { payload: null, expired: true };
      }
      throw err;
    }
  },
};

const cookiesLib = {
  set: (res: Response, value: string) => {
    res.cookie("authToken", value, {
      httpOnly: true,
      maxAge: 60 * 60 * 7 * 1000,
      secure: process.env.NODE_ENV === "prod",
      path: "/api/v1",
    });
    return;
  },
  clear: (res: Response) => {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      path: "/api/v1",
    });
  },
};

// types
type TokenPayloadType = {
  id: string;
  username: string;
};

export { cookiesLib, passLib, tokenLib };
