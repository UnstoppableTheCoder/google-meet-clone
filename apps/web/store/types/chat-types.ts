import { Chat } from "@repo/types";

export interface State {
  chats: Chat[];
}

export interface Actions {
  setChat: (chat: Chat) => void;
}
