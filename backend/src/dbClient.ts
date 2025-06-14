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
}

// client init
const db = new Database();
(async () => {
  console.log("performing db migrations...");
  await db.migrate();
  console.log("db is ready:", db.isReady);
})();

export default db;
