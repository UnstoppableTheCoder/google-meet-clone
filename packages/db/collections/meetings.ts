import { getDB } from "../get-db";

export const meetingsCollection = async () => {
  const db = await getDB();
  return db.collection("meetings");
};
