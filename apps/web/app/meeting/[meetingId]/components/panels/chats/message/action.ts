"use server";

import { chatsCollection } from "@repo/db";
import { ChatPayload } from "@repo/types";

export async function getChats(meetingId: string, userId: string) {
  try {
    const chatsList: ChatPayload[] = [];
    const chats = await chatsCollection();
    const chatsArrRes = JSON.parse(
      JSON.stringify(await chats.find({ meetingId }).toArray()),
    );

    chatsArrRes.forEach((chat: ChatPayload) => {
      if (chat.senderId === userId) {
        chatsList.push(chat);
      } else if (chat.sendTo === "everyone" || chat.sendTo === userId) {
        chatsList.push(chat);
      }
    });

    return {
      success: true,
      message: "Chats fetched successfully",
      chats: JSON.parse(JSON.stringify(chatsList)),
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch chats",
    };
  }
}
