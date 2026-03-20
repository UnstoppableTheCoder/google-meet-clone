import { RefObject } from "react";

export interface MeetingContextType {
  wsRef: RefObject<WebSocket | null>;
  panelsRef: RefObject<HTMLDivElement | null>;
  topBarChatBtnRef: RefObject<HTMLButtonElement | null>;
  topBarParticipantBtnRef: RefObject<HTMLButtonElement | null>;
  bottomBarChatBtnRef: RefObject<HTMLButtonElement | null>;
  bottomBarParticipantBtnRef: RefObject<HTMLButtonElement | null>;
}
