import { argon2id, hash, verify } from "argon2";

const passLib = {
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
