/**
 * Utils - A module containing api utility Libraries
 *
 * Libraries:
 * 1. passLib - password library - for password encryption and verification
 *    - uses argon2id
 */
import { argon2id, hash, verify } from "argon2";
import jwt from "jsonwebtoken";
import { CookieOptions, Response } from "express";

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

const cookieOptions = {
  general: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod",
    sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
    path: "/",
  } as CookieOptions,
  maxAge: 60 * 60 * 7 * 1000,
};

const cookiesLib = {
  set: (res: Response, options: SetCookieOptionsType) => {
    res.cookie(options.name, options.value, {
      ...cookieOptions.general,
      maxAge: cookieOptions.maxAge,
      ...options.extras,
    });
    return;
  },

  clear: (res: Response, options: ClearCookieOptionsType) => {
    res.clearCookie(options.name, {
      ...cookieOptions.general,
      ...options.extras,
    });
  },
};

// types
type TokenPayloadType = {
  id: string;
  username: string;
};

type ClearCookieOptionsType = {
  name: string;
  extras?: { httpOnly: boolean; [key: string]: any };
};

type SetCookieOptionsType = ClearCookieOptionsType & {
  value: string;
};

export { cookiesLib, passLib, tokenLib };
