import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Actions, State } from "./types/chat-types";
import { Chat } from "@repo/types";

export const useChat = create<State & Actions>()(
  devtools((set) => ({
    chats: [],

    setChat: (chat: Chat) =>
      set((state) => ({ chats: [...state.chats, chat] })),
  })),
);
