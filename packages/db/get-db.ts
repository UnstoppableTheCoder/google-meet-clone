import type { Db } from "mongodb";
import { client } from "./client";

let db: Db;

export const getDB = async () => {
  if (!db) {
    await client.connect();
    db = client.db();
  }

  return db;
};
