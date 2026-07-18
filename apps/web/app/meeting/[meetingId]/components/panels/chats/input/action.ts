"use server";

import { chatsCollection } from "@repo/db";
import { ChatPayload } from "@repo/types";

export async function saveChatToDB(chatPayload: ChatPayload) {
  try {
    const chats = await chatsCollection();
    chats.insertOne(chatPayload);

    return {
      success: true,
      message: "Saved chat to db successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to save chat to db",
    };
  }
}
