import { RefObject } from "react";

export interface MeetingContextType {
  wsRef: RefObject<WebSocket | null>;
}
