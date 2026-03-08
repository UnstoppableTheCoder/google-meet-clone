import { getDB } from "../get-db";

export const usersCollection = async () => {
  const db = await getDB();
  return db.collection("users");
};
