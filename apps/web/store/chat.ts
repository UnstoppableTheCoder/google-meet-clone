import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Actions, State } from "./types/chat-types";
import { ChatPayload } from "@repo/types";

export const useChat = create<State & Actions>()(
  devtools((set) => ({
    chats: [],

    setChat: (chat: ChatPayload) =>
      set((state) => ({ chats: [...state.chats, chat] })),

    setChats: (chats: ChatPayload[]) => set((state) => ({ chats })),

    resetChat: () => {
      set({ chats: [] });
    },
  })),
);
