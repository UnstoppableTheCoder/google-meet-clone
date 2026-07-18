import { ChatPayload } from "@repo/types";

export interface State {
  chats: ChatPayload[];
}

export interface Actions {
  setChat: (chat: ChatPayload) => void;
  setChats: (chats: ChatPayload[]) => void;
  resetChat: () => void;
}
