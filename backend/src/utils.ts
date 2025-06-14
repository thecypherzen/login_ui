/**
 * Utils - A module containing api utility Libraries
 *
 * Libraries:
 * 1. passLib - password library - for password encryption and verification
 *    - uses argon2id
 */
import { argon2id, hash, verify } from "argon2";

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

export { passLib };
