import { getDB } from "../get-db";

export const chatsCollection = async () => {
  const db = await getDB();
  return db.collection("chats");
};
