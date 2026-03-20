// export interface Connections {
//   [connectionId: string]: WebSocket;
// }

import type { Participant } from "@repo/types";
import type WebSocket from "ws";

export type Connections = Record<string, WebSocket>;

export interface Meeting {
  host: Participant | null;
  participants: Participant[];
}

// export interface Meetings {
//   [meetingId: string]: Meeting;
// }

export type Meetings = Record<string, Meeting>;
