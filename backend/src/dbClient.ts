/**
 * DbClient - Database management class
 * - Typically connects to db orm client and defines useful methods useful at top level
 * - Initialises and exposes instance of self
 */
import { exec } from "child_process";
import { PrismaClient } from "@prisma/client";

// migration script
const migrate = () => {
  return new Promise((resolve, reject) => {
    exec("npx prisma migrate deploy", (err, stdout, stderr) => {
      if (err) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

// class definition
class Database {
  client: PrismaClient;
  isReady: boolean;

  constructor() {
    this.client = new PrismaClient();
    this.isReady = false;
  }

  async migrate() {
    let result: any;
    try {
      result = await migrate();
      console.log(result);
      this.isReady = true;
    } catch (err) {
      console.log("DB MIGRATION ERROR:\n", err);
    }
  }

  async filterModel(model: Record<string, any>) {
    const filtered: Record<string, any> = {};
    for (let [key, value] of Object.entries(model)) {
      const valType = typeof value;
      // handle skipped values and arrays
      if (
        !this.#skippedFields.includes(key) &&
        valType === "object" &&
        value !== null
      ) {
        if (Array.isArray(value)) {
          filtered[key] = await this.filterModels(value);
        } else {
          filtered[key] = await this.filterModel(value);
        }
      } else if (!this.#hiddenFields.includes(key)) {
        // allow only allowed fields
        filtered[key] = value;
      }
    }
    return filtered;
  }

  async filterModels(objects: Array<object>) {
    const promises = objects.map(async (model) => {
      const res = await this.filterModel(model);
      return res;
    });
    let results = await Promise.allSettled(promises);
    return results.map((result) => {
      return result.status === "fulfilled" ? result.value : result.reason;
    });
  }

  #skippedFields = ["createdAt", "updatedAt"];

  #hiddenFields = ["password", "deletedAt", "isDeleted"];
}

// client init
const db = new Database();
(async () => {
  console.log("performing db migrations...");
  await db.migrate();
  console.log("db is ready:", db.isReady);
})();

export default db;
