import { labels, types } from "@repo/constants";
import { getWSConnection } from "./socket-manager";

export const handleSendHandRaise = (
  handRaise: boolean,
  handRaiserId: string,
  meetingId: string,
) => {
  const message = {
    label: labels.NORMAL_PROCESS,
    data: {
      type: types.HAND_RAISE,
      payload: {
        handRaise,
        handRaiserId,
        meetingId,
      },
    },
  };

  const ws = getWSConnection();

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.warn("Socket not connected");
    return;
  }

  ws.send(JSON.stringify(message));
};
